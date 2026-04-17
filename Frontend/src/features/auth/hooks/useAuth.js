import { useContext } from "react";
import { AuthContext } from "../authContext";
import { login, register, logout } from "../services/authApi";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser,loading, setLoading } = context

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

    return { user,loading, handleLogin, handleRegister, handleLogout }
}