import client from "./client";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    refresh: string;
    access: string;
    username: string;
    email: string;
    has_profile: boolean;
};

export type RegisterRequest = {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
};

export type RegisterResponse = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
};

export type CompleteProfileRequest = {
    nickname?: string;
    gender?: "female" | "male" | "other";
};

export type CompleteProfileResponse = {
    username?: string;
    email?: string;
    nickname?: string;
    gender?: "female" | "male" | "other";
};

export type ProfileExistsResponse = {
    has_profile: boolean;
};

export type CoupleRequestCreateRequest = {
    partner_username: string;
};

export type CoupleRequestItem = {
    id: number;
    requester_username: string;
    recipient_username: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
};

export type CoupleIncomingResponse = {
    requests: CoupleRequestItem[];
};

export type CoupleStatusResponse = {
    is_coupled: boolean;
    partner_username?: string;
    partner_nickname?: string;
    partner_gender?: "female" | "male" | "other" | "";
};

export type AttendanceStatusResponse = {
    today: string;
    checked_in_today: boolean;
    streak_count: number;
};

export type AttendanceCheckInResponse = AttendanceStatusResponse & {
    already_checked_in: boolean;
};

export type MemoryCreateRequest = {
    title: string;
    content: string;
};

export type MemoryResponse = {
    id: number;
    title: string;
    content: string;
    created_at: string;
};

export type MemoryListResponse = {
    memories: MemoryResponse[];
};

export type MemoryUpdateRequest = {
    title?: string;
    content?: string;
};

export type MemoryListQuery = {
    q?: string;
    ordering?: "-created_at" | "created_at" | "title" | "-title";
};

export type PasswordVerifyRequest = {
    current_password: string;
};

export type PasswordVerifyResponse = {
    verified: boolean;
};

export type PasswordChangeRequest = {
    current_password: string;
    new_password: string;
    new_password_confirm: string;
};

export type PasswordChangeResponse = {
    changed: boolean;
};

let completeProfilePath = "/api/auth/profile/";

export const setCompleteProfilePath = (path: string) => {
    completeProfilePath = path;
};

export const login = (payload: LoginRequest) =>
    client.post<LoginResponse>("/api/auth/login/", payload);

export const register = (payload: RegisterRequest) =>
    client.post<RegisterResponse>("/api/auth/register/", payload);

export const completeProfile = async (payload: CompleteProfileRequest) => {
    try {
        return await client.patch<CompleteProfileResponse>(completeProfilePath, payload);
    } catch (error: any) {
        if (error?.response?.status === 405) {
            return client.post<CompleteProfileResponse>(completeProfilePath, payload);
        }
        throw error;
    }
};

export const checkProfileExists = async () => {
    const response = await client.get<ProfileExistsResponse>("/api/auth/profile/exists/");
    return response.data.has_profile;
};

export const getProfile = async () => {
    const response = await client.get<CompleteProfileResponse>(completeProfilePath);
    return response.data;
};

export const requestCouple = (payload: CoupleRequestCreateRequest) =>
    client.post<CoupleRequestItem>("/api/auth/couple/request/", payload);

export const getIncomingCoupleRequests = async () => {
    const response = await client.get<CoupleIncomingResponse>("/api/auth/couple/requests/incoming/");
    return response.data.requests;
};

export const getSentCoupleRequests = async () => {
    const response = await client.get<CoupleIncomingResponse>("/api/auth/couple/requests/sent/");
    return response.data.requests;
};

export const acceptCoupleRequest = (requestId: number) =>
    client.post<CoupleStatusResponse>("/api/auth/couple/accept/", { request_id: requestId });

export const rejectCoupleRequest = async (requestId: number) => {
    const response = await client.post<CoupleIncomingResponse>("/api/auth/couple/reject/", { request_id: requestId });
    return response.data.requests;
};

export const cancelCoupleRequest = async (requestId: number) => {
    const response = await client.post<CoupleIncomingResponse>("/api/auth/couple/cancel/", { request_id: requestId });
    return response.data.requests;
};

export const getCoupleStatus = async () => {
    const response = await client.get<CoupleStatusResponse>("/api/auth/couple/status/");
    return response.data;
};

export const getAttendanceStatus = async () => {
    const response = await client.get<AttendanceStatusResponse>("/api/auth/attendance/status/");
    return response.data;
};

export const checkInAttendance = async () => {
    const response = await client.post<AttendanceCheckInResponse>("/api/auth/attendance/check-in/", {});
    return response.data;
};

export const createMemory = async (payload: MemoryCreateRequest) => {
    const response = await client.post<MemoryResponse>("/api/auth/memories/", payload);
    return response.data;
};

export const getMemories = async (params?: MemoryListQuery) => {
    const response = await client.get<MemoryListResponse>("/api/auth/memories/", { params });
    return response.data.memories;
};

export const getMemory = async (memoryId: number) => {
    const response = await client.get<MemoryResponse>(`/api/auth/memories/${memoryId}/`);
    return response.data;
};

export const updateMemory = async (memoryId: number, payload: MemoryUpdateRequest) => {
    const response = await client.patch<MemoryResponse>(`/api/auth/memories/${memoryId}/`, payload);
    return response.data;
};

export const deleteMemory = async (memoryId: number) => {
    await client.delete(`/api/auth/memories/${memoryId}/`);
};

export const verifyPassword = async (payload: PasswordVerifyRequest) => {
    const response = await client.post<PasswordVerifyResponse>("/api/auth/password/verify/", payload);
    return response.data;
};

export const changePassword = async (payload: PasswordChangeRequest) => {
    const response = await client.post<PasswordChangeResponse>("/api/auth/password/change/", payload);
    return response.data;
};
