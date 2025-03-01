export type THttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type TRequestOptions = {
    method?: THttpMethod;
    headers?: HeadersInit;
    body?: any;
    queryParams?: Record<string, any>;
    retry?: number; // number of retyr attempts
    timeout?: number; // request timeout in ms
    cache?: RequestCache; // request cache mode
    credentials?: RequestCredentials; // request credentials
    abortSignal?: AbortSignal; // allow external abort control
    validateStatus?: (status: number) => boolean; // custom status validation
    transformResponse?: (response: Response) => any; // custom response transformation
};

export type TApiError = {
    status: number;
    message: string;
    data?: any;
    isApiError: true;
}