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
        <input className="login-field" type="text" placeholder="username" onChange={(e : any) => setUsername(e.target.value)}/>
        <input className="login-field" type="password" placeholder="password" onChange={(e : any) => setPassword(e.target.value)}/>
        <button className="login-button" onClick={HandleLogin}>
            Login
        </button>
        <a className="forgot-password" href="">Forgot password?</a>
        { show && <p className="test">user: {username} pass: {password}</p>}
    </div>
    )
}