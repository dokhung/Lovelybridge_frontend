import axios from "axios";
import { NativeModules } from "react-native";

const getDevServerHost = () => {
    const scriptURL = NativeModules?.SourceCode?.scriptURL as string | undefined;
    if (!scriptURL) return null;
    const match = scriptURL.match(/https?:\/\/([^/]+)\//);
    if (!match) return null;
    const hostWithPort = match[1];
    return hostWithPort.split(":")[0];
};

const DEV_LAN_HOST = "192.168.0.19";
const isLoopbackHost = (host: string) =>
    host === "127.0.0.1" || host === "localhost";

const getDefaultBaseUrl = () => {
    const devHost = getDevServerHost();
    if (devHost) {
        const host = isLoopbackHost(devHost) ? DEV_LAN_HOST : devHost;
        return `http://${host}:8000`;
    }
    return `http://${DEV_LAN_HOST}:8000`;
};

const DEFAULT_BASE_URL = getDefaultBaseUrl();

const client = axios.create({
    baseURL: DEFAULT_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.request.use(
    (config) => {
        const method = (config.method || "GET").toUpperCase();
        const url = `${config.baseURL || ""}${config.url || ""}`;
        console.log("[API] request", method, url);
        return config;
    },
    (error) => {
        console.log("[API] request error", error?.message || error);
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => {
        console.log("[API] response", response.status, response.config?.url || "");
        return response;
    },
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url;
        console.log("[API] response error", status, url, error?.message || error);
        return Promise.reject(error);
    }
);

export const setApiBaseUrl = (baseUrl: string) => {
    client.defaults.baseURL = baseUrl;
};

export default client;
