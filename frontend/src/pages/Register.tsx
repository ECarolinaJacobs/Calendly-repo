import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authRegister from "../api/auth-register.tsx"
import './Register.css'

export function RegisterPage() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (e : any) => {
        let authorization = await authRegister(name, email, password)
        if (authorization) {
            navigate("/login");
        }
        else {
            console.log("Login unsuccessful")
        }
    }

    return (
    <div className="register-page">
        <div className="register-input-fields">
            <img className="logo" src="/download.png" alt="Calendly logo"/>
            <input className="login-field" type="text" placeholder="Email Address" onChange={(e : any) => setEmail(e.target.value)}/>
            <input className="login-field" type="text" placeholder="Name" onChange={(e : any) => setName(e.target.value)}/>
            <input className="login-field" type="password" placeholder="Password" onChange={(e : any) => setPassword(e.target.value)}/>
            <input className="login-field" type="password" placeholder="Confirm password"/>
            <button className="register-button" onClick={handleSubmit}>
                Register
            </button>
            <p className="login-query">Already have an account? <a href="/login">Log in</a></p>
        </div>
    </div>
    )
}