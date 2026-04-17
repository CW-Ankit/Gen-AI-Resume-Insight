import { useContext, useEffect } from "react";
import { AuthContext } from "../authContext";
import { login, register, logout, getMe } from "../services/authApi";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true)
            const data = await login({ email, password })
            if (data && data.user) {
                setUser(data.user)
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error)
            return false;
        } finally {
            setLoading(false)
        }
    }


    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true)
            const data = await register({ username, email, password })
            if (data && data.user) {
                setUser(data.user)
            }
        } catch (error) {
            console.error("Registration failed:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            await logout()
            setUser(null)
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                // This call will trigger the interceptor's refresh logic 
                // if the initial memory token is empty
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Session expired or no user logged in");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setUser, setLoading]);

    return { user, loading, handleLogin, handleRegister, handleLogout }
}