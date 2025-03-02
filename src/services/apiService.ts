import { camelToSnakeKeys, snakeToCamelKeys } from "@/helpers/caseHelper";
import { TApiError, TRequestOptions } from "@/types/apiTypes";

const retriableStatusCode = [408, 429, 502, 503, 504];



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DEFAULT_TIMEOUT = 30000;

/**
 * Generates a full URL with query parameters.
 * 
 * @param {string} path - The endpoint path. Can be absolute (starts with "http") or relative.
 * @param {Record<string, any>} [queryParams] - An optional object containing query parameters.
 * 
 * @returns {string} - The fully constructed URL with query parameters.
 * 
 * @example
 * // Basic usage with query parameters
 * generateUrl("/users", { page: 2, limit: 10 });
 * // Output: BASE_URL/users?page=2&limit=10
 * 
 * @example
 * // Absolute URL (no BASE_URL prefix)
 * generateUrl("https://api.example.com/products", { category: "electronics" });
 * // Output: https://api.example.com/products?category=electronics
 * 
 * @example
 * // Handling array values
 * generateUrl("/search", { tags: ["tech", "javascript"] });
 * // Output: BASE_URL/search?tags[]=tech&tags[]=javascript
 * 
 * @example
 * // Ignoring undefined or null values
 * generateUrl("/posts", { sort: "desc", filter: undefined });
 * // Output: BASE_URL/posts?sort=desc
 */
const generateUrl = (path: string, queryParams?: Record<string, any>): string => {
    // handles both absolute and relative paths
    const baseUrl = path.startsWith("http") ? "" : BASE_URL;
    const url = new URL(`${baseUrl}${path}`);

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(`${key}[]`, String(v)));
                } else {
                    url.searchParams.append(key, String(value));
                }
            }
        });
    }
    return url.toString();
}

// generate api error with consistent structure
const createApiError = (status: number, message: string, data?: any): TApiError => ({
    status,
    message,
    data,
    isApiError: true
})

/**
 * Handles an HTTP response by parsing the response based on its content type.
 * Supports JSON, text, and binary (blob) responses.
 *
 * @param {Response} response - The HTTP response object.
 * @param {(data: any) => any} [transformResponse] - Optional function to transform the response data.
 * 
 * @returns {Promise<any>} - The parsed response data, optionally transformed.
 * 
 * @throws {ApiError} - Throws an error if the response is not successful (`!response.ok`).
 *
 * @example
 * // Handling a successful JSON response
 * const response = new Response(JSON.stringify({ message: "Success" }), {
 *     status: 200,
 *     headers: { "Content-Type": "application/json" }
 * });
 * const data = await handleResponse(response);
 * console.log(data); // Output: { message: "Success" }
 *
 * @example
 * // Handling an error response
 * const response = new Response(JSON.stringify({ error: "Unauthorized" }), {
 *     status: 401,
 *     headers: { "Content-Type": "application/json" }
 * });
 * try {
 *     await handleResponse(response);
 * } catch (error) {
 *     console.error(error.message); // Output: "Unauthorized"
 * }
 *
 * @example
 * // Using a transformResponse function
 * const transform = (data: any) => ({ ...data, transformed: true });
 * const response = new Response(JSON.stringify({ name: "John" }), {
 *     status: 200,
 *     headers: { "Content-Type": "application/json" }
 * });
 * const data = await handleResponse(response, transform);
 * console.log(data); // Output: { name: "John", transformed: true }
 */
const handleResponse = async (response: Response, transformResponse: (data: any) => any=snakeToCamelKeys) => {
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
        let errorData: any = {};

        if (contentType?.includes('application/json')) {
            try {
                errorData = await response.json();
            } catch (e) {

            }
        } else if (contentType?.includes('text/')) {
            errorData = { message: await response.text() };
        }
        throw createApiError(
            response.status,
            errorData.message || response.statusText,
            errorData
        )
    }

    if (response.status === 204) return {};

    let data: any;

    if (contentType?.includes('application/json')) {
        data = await response.json();
    } else if (contentType?.includes('text/')) {
        data = await response.text();
    } else if (contentType?.includes('application/octet-stream')) {
        // for media file-> font,image,audio,video etc
        return await response.blob();
    } else {
        //default to json if content-type is not specified
        try {
            data = await response.json();
        } catch (err) {
            data = await response.text();
        }
    }

    return transformResponse ? transformResponse(data) : data;
}

/**
 * Creates a promise that will be rejected after the specified timeout period.
 * This function also handles proper cleanup of event listeners and timeouts.
 * 
 * @param {number} ms - Time in milliseconds before the request times out
 * @param {AbortController} controller - The AbortController used to cancel the request
 * @returns {Promise<never>} A promise that rejects after the specified timeout
 * 
 * @example
 * // Create a timeout promise that rejects after 5 seconds
 * const controller = new AbortController();
 * const timeoutPromise = createTimeoutPromise(5000, controller);
 * 
 * // Use in a race with a fetch promise
 * try {
 *   const response = await Promise.race([
 *     fetch('https://api.example.com/data', { signal: controller.signal }),
 *     timeoutPromise
 *   ]);
 *   // Handle successful response
 * } catch (error) {
 *   if (error.status === 408) {
 *     console.error('Request timed out');
 *   } else {
 *     console.error('Other error occurred:', error);
 *   }
 * }
 */
const createTimeoutPromise = (ms: number, controller: AbortController): Promise<never> => {
    return new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            controller.abort(); // Cancel request
            reject(createApiError(408, `Request timeout after ${ms}ms`));
        }, ms);

        // Cleanup: If the request completes, clear timeout
        const abortListener = () => clearTimeout(timeoutId);
        controller.signal.addEventListener('abort', abortListener);
        
        // Ensure the abort listener is removed after the timeout fires
        setTimeout(() => {
            controller.signal.removeEventListener('abort', abortListener);
        }, ms + 100); // slightly longer than the timeout to ensure it runs after
    });
};


/**
 * Retries an API request if it fails with a retriable status code using exponential backoff with jitter.
 *
 * @param {string} path - The API endpoint to request.
 * @param {TRequestOptions} options - The request configuration (method, headers, body, etc.).
 * @param {number} retries - The number of allowed retries before failing.
 * @returns {Promise<any>} - Resolves with the response if successful, otherwise rejects with the error.
 * 
 * @throws {Error} - Throws the last encountered error if all retries are exhausted.
 *
 * @example
 * // Attempt to fetch data with up to 3 retries
 * retryRequest('/api/data', { method: 'GET' }, 3)
 *   .then(response => console.log('Success:', response))
 *   .catch(error => console.error('Final failure:', error));
 */
const retryRequest = async (path: string, options: TRequestOptions, retries: number): Promise<any> => {
    try {
        return await makeRequest(path, options, false);
    } catch (error: any) {
        const isRetriableError = error.isApiError && retriableStatusCode.includes(error.status);

        if (retries > 0 && isRetriableError) {
            // added random ms for jitter in order to avoid sending retry request at the same time from multiple clients
            // capped the max delay to 5 minutes although max delay generate by randomness can upto 17.5 minutes
            const delay = Math.min(
                Math.pow(2, 10 - retries) * 1000 + Math.random() * 1000, 300000
            )
            console.info(`Retrying ${options.method || 'GET'} ${path} after ${delay}ms (${retries} retries left)`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retryRequest(path, options, retries - 1);
        }
        throw error;
    }
}

const makeRequest = async (path: string, options: TRequestOptions = {}, useRetry = true) => {
    // creating controller when not provided
    const controller = new AbortController();

    if (options.abortSignal) {
        options.abortSignal.addEventListener('abort', () => controller.abort());
    }

    const signal = options.abortSignal || controller.signal;
    const url = generateUrl(path, options.queryParams);

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
    };

    // Only stringify if body is an object and not already a string or FormData
    debugger
    const body = options.body ?
        (typeof options.body === 'object' && !(options.body instanceof FormData) ?
            JSON.stringify(camelToSnakeKeys(options.body)) :
            options.body) :
        undefined;

    // request configuration

    const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers,
        body,
        signal,
        cache: options.cache,
        credentials: options.credentials
    }

    try {
        const timeout = options.timeout || DEFAULT_TIMEOUT;
        const fetchPromise = fetch(url, fetchOptions);
        const timeoutPromise = createTimeoutPromise(timeout,controller);
        const responseTransformer = options.transformResponse;

        // race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        // custom status code valdation if provided
        if (options.validateStatus && !options.validateStatus(response.status)) {
            throw createApiError(
                response.status,
                `Request failed with status ${response.status}`,
            )
        }

        return await handleResponse(response, responseTransformer);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.warn('Request Aborted: ', path);
            throw createApiError(499, 'Request Aborted');
        }

        if (useRetry && options.retry && options.retry > 0) {
            return retryRequest(path, options, options.retry);
        }

        if (!error.isApiError) {
            throw createApiError(
                0,
                error.message || 'Unknown Error',
                error
            )
        }

        throw error
    }
}

export const createCancellableRequest = () => {
    const controller = new AbortController();

    return {
        signal: controller.signal,
        cancel: (reason?: string) => controller.abort(reason)
    }
}

export const api = {
    get: <T = any>(path: string, queryParams?: Record<string, any>, options: TRequestOptions = {}): Promise<T> =>
        makeRequest(path, { ...options, queryParams, method: 'GET' }),

    post: <T = any>(path: string, body?: any, options: TRequestOptions = {}): Promise<T> =>
        makeRequest(path, { ...options, body, method: 'POST' }),

    put: <T = any>(path: string, body?: any, options: TRequestOptions = {}): Promise<T> =>
        makeRequest(path, { ...options, body, method: 'PUT' }),

    patch: <T = any>(path: string, body?: any, options: TRequestOptions = {}): Promise<T> =>
        makeRequest(path, { ...options, body, method: 'PATCH' }),

    delete: <T = any>(path: string, queryParams?: Record<string, any>, options: TRequestOptions = {}): Promise<T> =>
        makeRequest(path, { ...options, queryParams, method: 'DELETE' }),

    createCancellable: createCancellableRequest,

    /**
     * Helper to check if an error is an API error
    */
    isApiError: (error: any): error is TApiError => error && typeof error === 'object' && error.isApiError === true
}

export const createApiClient = (basePath: string, defaultOptions: TRequestOptions = {}) => {
    const client = {
      get: <T = any>(path: string, queryParams?: Record<string, any>, options: TRequestOptions = {}): Promise<T> =>
        api.get<T>(`${basePath}${path}`, queryParams, { ...defaultOptions, ...options }),
      
      post: <T = any>(path: string, body?: any, options: TRequestOptions = {}): Promise<T> =>
        api.post<T>(`${basePath}${path}`, body, { ...defaultOptions, ...options }),
      
      put: <T = any>(path: string, body?: any, options: TRequestOptions = {}): Promise<T> =>
        api.put<T>(`${basePath}${path}`, body, { ...defaultOptions, ...options }),
      
      patch: <T = any>(path: string, body?: any, options: TRequestOptions = {}): Promise<T> =>
        api.patch<T>(`${basePath}${path}`, body, { ...defaultOptions, ...options }),
      
      delete: <T = any>(path: string, queryParams?: Record<string, any>, options: TRequestOptions = {}): Promise<T> =>
        api.delete<T>(`${basePath}${path}`, queryParams, { ...defaultOptions, ...options }),
    };
    
    return client;
  };