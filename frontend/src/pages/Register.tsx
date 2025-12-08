import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authRegister from "../api/auth-register";
import './Register.css'

export function RegisterPage() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await authRegister(name, email, password);
            setSuccess("Registration successful! Please log in.");
            setTimeout(() => {
                navigate("/login");
            }, 2000); // Wait 2 seconds before redirecting
        }
        catch (err: any) {
            if (err.response && err.response.status === 409) {
                setError("Email already in use.");
            } else {
                setError("Registration failed. Please try again.");
            }
            console.error(err);
        }
    }

    return (
        <div className="register-page">
            <form className="register-input-fields" onSubmit={handleSubmit}>
                <img className="logo" src="/download.png" alt="Calendly logo" />
                <h2>Create an Account</h2>
                <input
                    className="login-field"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="login-field"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="login-field"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    className="login-field"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button className="register-button" type="submit">
                    Register
                </button>
                <p className="login-query">Already have an account? <a href="/login">Log in</a></p>
            </form>
        </div>
    )
}