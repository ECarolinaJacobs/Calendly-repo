import { useState } from "react";
import verifyData from '../api/verify-login.tsx';
import './Login.css'

export function LoginCredentials () {
    // Maak een User object, die je in de state bewaard, ipv losse strings

    const [username, setUsername] = useState();
    // TODO: Is it a good idea to store username and password in state? Do some researching on this
    // Password zou denk ik sowieso niet in de state bewaard moeten worden. Username is wel handig denk ik.
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);

    let authenticated: boolean = false;

    function HandleLogin() {
        if (username !== undefined && password !== undefined) {
            verifyData(username, password).then((response) => {
                console.log('test1');
                if (response !== undefined) {
                    console.log('test2');
                    authenticated = true;
                }
            })
        } else {
            authenticated = false;
            console.log('test3');
        }
        setShow(true);
    }

    return (
    <div className="login-page">
        <div className="login-input-fields">
            <img className="logo" src="/download.png" alt="Calendly logo"/>
            <input className="login-field" type="text" placeholder="Email Address" onChange={(e : any) => setUsername(e.target.value)}/>
            <div className="password-and-forgot-password">
                <input className="login-field" type="password" placeholder="Password" onChange={(e : any) => setPassword(e.target.value)}/>
                <a href="" className="forgot-password">Forgot password?</a>
            </div>
            <button className="login-button" onClick={HandleLogin}>
                Login
            </button>
            { show && <p className="test">user: {username} pass: {password} logged in: { authenticated ? "yes" : "no" }</p>}
            <p className="register-query">Don't have an account? <a href="/register">Register</a></p>
        </div>
    </div>
    )
}