import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import LoadingScreen from "../../../components/LoadingScreen"

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
        if (loading) {
            return <LoadingScreen />
        }
    }
    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="text">Username</label>
                        <input onChange={(e) => { setUsername(e.target.value) }} value={username} type="text" id="username" name="username" placeholder="Enter Username" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" id="email" name="email" placeholder="Enter Email Address" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" id="password" name="password" placeholder="Enter Password" />
                    </div>
                    <button className="button primary-button">Register</button>
                </form>
                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register