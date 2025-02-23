import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RequestConfig<T = any> {
    method: Method;
    endpoint: string;
    data?: T;
    params?: Record<string, any>;
    headers?: Record<string, string>;
}

export const apiRequest = async <T = any>({ method, endpoint, data, params, headers }: RequestConfig): Promise<AxiosResponse<T>> => {
    const queryString = params ? Object?.entries(params)?.map(([key, value]) => Array?.isArray(value) ? `${key}=${value?.join(",")}` : `${key}=${value}`).join("&") : "";
    const url = queryString ? `${baseUrl}${endpoint}?${queryString}` : `${baseUrl}${endpoint}`;
    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            data,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...headers,
            },
        };

        const response = await axios(config);
        return response; // Return full response object
    } catch (error: any) {
        console.log("API Request Error:", error?.response?.data || error?.message || "Unknown error");
        throw error;
    }
};
