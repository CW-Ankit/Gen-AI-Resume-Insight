import axios from "axios"

// This variable stays in memory (safe from XSS)
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

// Add the Access Token to every request
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Handle 401 errors by refreshing the token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;

        // If error is 401 and we haven't retried yet
        if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            try {
                // Call your backend refresh endpoint
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-access-token`, {
                    withCredentials: true
                });

                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);

                // Retry the original request with the new token
                prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(prevRequest);
            } catch (refreshError) {
                // Refresh token expired or invalid -> logout user
                accessToken = null;
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export async function register({ username, email, password }) {
    try {
        const response = await api.post(`/api/auth/register`, {
            username,
            email,
            password
        })

        if (response.data?.accessToken) {
            setAccessToken(response.data.accessToken);
        }

        return response.data
    } catch (error) {
        console.log(error)
    }

}

export async function login({ email, password }) {
    try {
        const response = await api.post(`/api/auth/login`, {
            email,
            password
        })
        if (response.data?.accessToken) {
            setAccessToken(response.data.accessToken);
        }

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function logout() {
    try {
        const response = await api.get(`/api/auth/logout`)
        setAccessToken(null);
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function getMe() {
    try {
        const response = await api.get(`/api/auth/me`)

        return response.data
    } catch (error) {
        console.log(error)
    }
}