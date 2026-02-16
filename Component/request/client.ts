import axios from "axios";

const DEFAULT_BASE_URL = "http://127.0.0.1:8000";

const client = axios.create({
    baseURL: DEFAULT_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setApiBaseUrl = (baseUrl: string) => {
    client.defaults.baseURL = baseUrl;
};

export default client;
