import { useState } from "react";
import './Register.css'

export function RegisterPage() {
    return (
    <div className="register-page">
        <div className="register-input-fields">
            <img className="logo" src="/download.png" alt="Calendly logo"/>
            <input className="login-field" type="text" placeholder="Email Address"/>
            <input className="login-field" type="text" placeholder="Username"/>
            <input className="login-field" type="password" placeholder="Password"/>
            <input className="login-field" type="password" placeholder="Confirm password"/>
            <button className="register-button">
                Register
            </button>
            <p className="login-query">Already have an account? <a href="/login">Log in</a></p>
        </div>
    </div>
    )
}