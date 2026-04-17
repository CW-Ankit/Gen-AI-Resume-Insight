import { Link, useNavigate } from "react-router"
import "../authForm.scss"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import LoadingScreen from "../../../components/LoadingScreen"


const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    if (loading) {
        return (<LoadingScreen />)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await handleLogin({ email, password })

        if (success) {
        navigate("/") // Only navigate if login worked
    }


    }
    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" id="email" name="email" placeholder="Enter Email Address" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" id="password" name="password" placeholder="Enter Password" />
                    </div>
                    <button className="button primary-button">Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login