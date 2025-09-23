import { use, useState } from "react";

export function LoginCredentials () {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);

    function HandleLogin() {
        setShow(true);
    }

    return (
    <div className="login-input-fields">
        <img className="logo" src="./public/download.png" alt="Calendly logo"/>
        <input className="login-field" type="text" placeholder="Email Address" onChange={(e : any) => setUsername(e.target.value)}/>
        <input className="login-field" type="password" placeholder="Password" onChange={(e : any) => setPassword(e.target.value)}/>
        <div className="forgot-password">
            <a href="">Forgot password?</a>
        </div>
        <button className="login-button" onClick={HandleLogin}>
            Login
        </button>
        { show && <p className="test">user: {username} pass: {password}</p>}
        <p className="register-query">Don't have an account? <a href="">Register</a></p>
    </div>
    )
}