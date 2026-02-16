import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import client from "./client";

const ACCESS_KEY = "lovelybridge.auth.access";
const REFRESH_KEY = "lovelybridge.auth.refresh";
const USERNAME_KEY = "lovelybridge.auth.username";
const EMAIL_KEY = "lovelybridge.auth.email";
const LAST_LOGIN_KEY = "lovelybridge.auth.last_login_at";
const SESSION_TIMEOUT_KEY = "lovelybridge.auth.session_timeout_min";
let refreshPath = "/api/auth/token/refresh/";
let onRefreshFailure: (() => void) | null = null;

type PendingRequest = {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    config: any;
};

type AuthTokens = {
    access: string;
    refresh: string;
    username?: string;
    email?: string;
};

type LoadedTokens = AuthTokens & { lastLoginAt?: number };

export const saveAuthTokens = async (tokens: AuthTokens) => {
    const items: [string, string][] = [
        [ACCESS_KEY, tokens.access],
        [REFRESH_KEY, tokens.refresh],
        [LAST_LOGIN_KEY, String(Date.now())],
    ];
    if (tokens.username) items.push([USERNAME_KEY, tokens.username]);
    if (tokens.email) items.push([EMAIL_KEY, tokens.email]);
    await AsyncStorage.multiSet(items);
    client.defaults.headers.common.Authorization = `Bearer ${tokens.access}`;
};

export const clearAuthTokens = async () => {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, USERNAME_KEY, EMAIL_KEY, LAST_LOGIN_KEY]);
    delete client.defaults.headers.common.Authorization;
};

export const applyAuthTokens = (access: string) => {
    client.defaults.headers.common.Authorization = `Bearer ${access}`;
};

export const loadAuthTokens = async (): Promise<LoadedTokens | null> => {
    const entries = await AsyncStorage.multiGet([
        ACCESS_KEY,
        REFRESH_KEY,
        USERNAME_KEY,
        EMAIL_KEY,
        LAST_LOGIN_KEY,
    ]);
    const map = Object.fromEntries(entries) as Record<string, string | null>;
    if (!map[ACCESS_KEY] || !map[REFRESH_KEY]) return null;
    return {
        access: map[ACCESS_KEY],
        refresh: map[REFRESH_KEY],
        username: map[USERNAME_KEY] ?? undefined,
        email: map[EMAIL_KEY] ?? undefined,
        lastLoginAt: map[LAST_LOGIN_KEY] ? Number(map[LAST_LOGIN_KEY]) : undefined,
    };
};

export const loadSessionTimeoutMinutes = async () => {
    const value = await AsyncStorage.getItem(SESSION_TIMEOUT_KEY);
    const minutes = value ? Number(value) : NaN;
    return Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
};

export const saveSessionTimeoutMinutes = async (minutes: number) => {
    await AsyncStorage.setItem(SESSION_TIMEOUT_KEY, String(minutes));
};

export const setAuthRefreshPath = (path: string) => {
    refreshPath = path;
};

export const setAuthRefreshFailureHandler = (handler: (() => void) | null) => {
    onRefreshFailure = handler;
};

let interceptorsAttached = false;
let isRefreshing = false;
let pendingQueue: PendingRequest[] = [];

export const setupAuthInterceptors = () => {
    if (interceptorsAttached) return;
    interceptorsAttached = true;

    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const status = error?.response?.status;
            const originalRequest = error?.config;

            if (!originalRequest || status !== 401) {
                return Promise.reject(error);
            }
            if (originalRequest._retry || originalRequest.url?.includes(refreshPath)) {
                return Promise.reject(error);
            }

            const refresh = await AsyncStorage.getItem(REFRESH_KEY);
            if (!refresh) return Promise.reject(error);

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshClient = axios.create({
                    baseURL: client.defaults.baseURL,
                    timeout: 10000,
                    headers: { "Content-Type": "application/json" },
                });
                const refreshResponse = await refreshClient.post(refreshPath, { refresh });
                const access = refreshResponse?.data?.access;
                const nextRefresh = refreshResponse?.data?.refresh ?? refresh;

                if (!access) {
                    throw new Error("Refresh token response missing access.");
                }

                await AsyncStorage.multiSet([
                    [ACCESS_KEY, access],
                    [REFRESH_KEY, nextRefresh],
                ]);
                client.defaults.headers.common.Authorization = `Bearer ${access}`;

                pendingQueue.forEach((item) => item.resolve(client(item.config)));
                pendingQueue = [];

                return client(originalRequest);
            } catch (refreshError) {
                pendingQueue.forEach((item) => item.reject(refreshError));
                pendingQueue = [];
                await clearAuthTokens();
                if (onRefreshFailure) {
                    onRefreshFailure();
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
};
