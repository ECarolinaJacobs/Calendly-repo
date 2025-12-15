import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authLogin from "../api/auth-login";
import "../css/Login.css";

export function LoginCredentials() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError("Email and password are required.");
			return;
		}

		try {
			const response = await authLogin(email, password);
			if (response && response.token) {
				localStorage.setItem("token", response.token);
				localStorage.setItem("userId", response.userId.toString());
				localStorage.setItem("userName", response.name);
				localStorage.setItem("userEmail", response.email);
				localStorage.setItem("isAdmin", response.isAdmin.toString());
			}
			console.log("Login successful! isAdmin:", response.isAdmin);
			//redirect based on admin status
			if (response.isAdmin === true) {
				console.log("Redirecting to admin page...");
				navigate("/admin");
			} else {
				console.log("Redirecting to dashboard...");
				navigate("/dashboard");
			}
		} catch (err) {
			setError("Invalid email or password.");
			console.error(err);
		}
	};

	return (
		<div className="login-page">
			<form className="login-input-fields" onSubmit={handleLogin}>
				<img className="logo" src="/download.png" alt="Calendly logo" />
				<h2>Log In</h2>
				<input
					className="login-field"
					type="email"
					placeholder="Email Address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<div className="password-and-forgot-password">
					<input
						className="login-field"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<a href="#" className="forgot-password">
						Forgot password?
					</a>
				</div>
				{error && <p className="error-message">{error}</p>}
				<button className="login-button" type="submit">
					Login
				</button>
				<p className="register-query">
					Don't have an account? <a href="/register">Register</a>
				</p>
			</form>
		</div>
	);
}
