// Define the type for CustomResponse
export type CustomResponse = {
    ok: boolean;
    status: number;
    body: any; // Adjust the type of 'body' as needed.
    json: () => Promise<any>; // Add a 'json' property with the correct type.
}

// Define the type for FeshesblogAPIClient
export type FeshesblogAPIClientType = {
    request: (options: {
        method: string;
        url: string;
        query?: Record<string, string>;
        headers?: Record<string, string>;
        body?: any;
    }) => Promise<CustomResponse>;

    // Define methods and properties for custom responses
    get: (url: string, query?: Record<string, string>, options?: any) => Promise<CustomResponse>;
    post: (url: string, body?: any, options?: any) => Promise<CustomResponse>;
    put:(url: string, body?: any, options?: any) => Promise<CustomResponse>;
    remove: (url: string, options?: any) => Promise<CustomResponse>;
    login: (username: string, password: string) => Promise<CustomResponse>;
    logout: () => Promise<void>;
    isAuthenticated: () => boolean;
}

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const FeshesblogAPIClient: (onError: (response: CustomResponse) => void) => FeshesblogAPIClientType = (onError) => {
    const base_url = BASE_API_URL + '/api';

    async function request(options: {
        method: string;
        url: string;
        query?: Record<string, string>;
        headers?: Record<string, string>;
        body?: any;
    }): Promise<CustomResponse> {
        let response = await requestInternal(options);
        
        if (response.status === 401 && options.url !== '/tokens') {
            const refreshResponse = await put('/tokens', {
                access_token: localStorage.getItem('accessToken'),
            });

            if (refreshResponse.ok) {
                localStorage.setItem('accessToken', refreshResponse.body.access_token);
                response = await requestInternal(options);
            }
        }

        if (response.status >= 500 && onError) {
            onError(response);
        }
        return response;
    };

    async function requestInternal(options: {
        method: string;
        url: string;
        query?: Record<string, string>;
        headers?: Record<string, string>;
        body?: any;
    }): Promise<CustomResponse> {
        let query = new URLSearchParams(options.query || {}).toString();
        
        if (query !=='') {
            query = '?' + query;
        }

        let response: CustomResponse = { // Annotate the type of 'response' as 'CustomResponse'
            ok: false,
            status: 500,
            body: {
                code: 500,
                message: "An unknown error occurred",
                description: "Unknown error",
            },
            json: async () => {
                return {
                    code: 500,
                    message: "An unknown error occurred",
                    description: "Unknown error",
                };
            }
        }; 
        
        try {
            response = await fetch(base_url + options.url + query, {
                method: options.method,
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                    ...options.headers,
                },
                credentials: options.url === '/tokens' ? 'include' : 'omit', 
                body: options.body ? JSON.stringify(options.body): null,
            });
        } catch (error) {
            if (error instanceof Error) {
                // Handle the error when it's an instance of Error
                response = {
                    ok: false,
                    status: 500,
                    body: {
                        code: 500,
                        message: 'The server is unresponsive',
                        description: error.toString(),
                    },
                } as CustomResponse;
            } else {
            // Handle other cases when 'error' has an unknown type
            // For example, you can provide a default error response
                response = {
                    ok: false,
                    status: 500,
                    json: async () => {
                        return {
                            code: 500,
                            message: "An unknown error occurred",
                            description: "Unknown error",
                        };
                    },
                } as CustomResponse
            }
        } 

        return response;
    };

    async function get(url: string, query?: Record<string, string>, options?: any): Promise<CustomResponse> {
        return request({
            method: 'GET', 
            url, 
            query, 
            ...options,
        });
    };

    async function post(url: string, body?: any, options?: any): Promise<CustomResponse> {
        return request({
            method: 'POST', 
            url, 
            body, 
            ...options,
        });
    };

    async function put(url: string, body?: any, options?: any): Promise<CustomResponse> {
        return request({
            method: 'PUT', 
            url, 
            body, 
            ...options,
        });
    };

    async function remove(url: string, options?: any): Promise<CustomResponse> {
        return request({
            method: 'DELETE', 
            url, 
            ...options
        });
    };

    async function login(username: string, password: string): Promise<CustomResponse> {
        const response = await post('/tokens', null, {
            headers: {
                Authorization: 'Basic ' + btoa(username + ":" + password),
            },
        });

        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                body: {
                    code: response.status,
                    message: response.status === 401 ? "Authentication failed" : "Error",
                    description: response.status === 401 ? "Authentication failed" : "Unknown Error",
                },
                json: async () => {
                    return {
                        code: response.status,
                        message: response.status === 401 ? "Authentication failed" : "Error",
                        description: response.status === 401 ? "Authentication failed" : "Unknown Error",
                    };
                },
            };
        }

        localStorage.setItem('accessToken', response.body.access_token);

        // Return a custom response for a successful login
        return {
            ok: true,
            status: response.status,
            body: {
                code: response.status,
                message: "Authentication successful",
                description: "User authenticated successfully",
            },
            json: async () => {
                return {
                    code: response.status,
                    message: "Authentication successful",
                    description: "User authenticated successfully"
                };
            },
        };
    };

    async function logout(): Promise<void> {
        await remove('/tokens');
        localStorage.removeItem('accessToken');
    }

    function isAuthenticated(): boolean {
        return localStorage.getItem('accessToken') !== null;
    }

    return {
        request,
        get,
        post,
        put,
        remove,
        login,
        logout,
        isAuthenticated,
    };
}

export default FeshesblogAPIClient;
