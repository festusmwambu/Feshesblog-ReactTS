const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function FeshesblogApiClient(onError) {
    const base_url = BASE_API_URL + '/api';

    async function request(options) {
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
    }

    async function requestInternal(options) {
        let query = new URLSearchParams(options.query || {}).toString();
        if (query !=='') {
            query = '?' + query;
        }

        let response;
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
        }

        catch (error) {
            response = {
                ok: false,
                status: 500,
                json: async () => {
                    return {
                        code: 500,
                        message: 'The server is unresponsive',
                        description: error.toString(),
                    };
                }
            };
        }

        return {
            ok: response.ok,
            status: response.status,
            body: response.status !== 204 ? await response.json(): null
        };
    }

    async function get(url, query, options) {
        return request({
            method: 'GET', url, query, ...options
        });
    }

    async function post(url, body, options) {
        return request({
            method: 'POST', url, body, ...options
        });
    } 

    async function put(url, body, options) {
        return request({
            method: 'PUT', url, body, ...options
        });
    }

    async function remove(url, options) {
        return request({
            method: 'DELETE', url, ...options
        });
    }

    async function login(username, password) {
        const response = await post('/tokens', null, {
            headers: {
                Authorization: 'Basic ' + btoa(username + ":" + password)
            },
        });
        if (!response.ok) {
            return response.status === 401 ? 'fail' : 'error';
        }
        localStorage.setItem('accessToken', response.body.access_token);
        return 'ok';
    }

    async function logout() {
        await remove('/tokens');
        localStorage.removeItem('accessToken');
    }

    function isAuthenticated() {
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

export default FeshesblogApiClient;
