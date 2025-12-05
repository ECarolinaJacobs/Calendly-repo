import { use, useState } from "react";
import "./ProfilePage.css";

export default function ProfilePage()
{   
    const[firstName, setFirstname] = useState("");
    const[lastName, setLastname] = useState("");
    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[displayname, setDisplayname] = useState("");
    const[birthDate, setBirthDate] = useState("")
   
    const [IsEditing, setEditButton] = useState(false)

    //password change option
    //delete account button 
    //upload function can be added later

    return(
        <div className = "profile-page">
            <div className="main-container">
                <div className = "topbar">
                    <a href="/dashboard"> Dashboard</a>
                    <a href= "/events"> Events</a>
                    <a href="/booking"> Booking</a>
                    <a href = "/logout"> LogOut</a>
                </div>
                <div className = "banner-container">
                        <img className = "profilePicture" src = "/ProfilePicture.png" alt="profile picture"/>  
                        <p className="username-display"> username </p> 
                </div> 
            
                <div className = "info-section">
                    <div className="edit-button-container">
                        {!IsEditing &&(<button className="edit-button" onClick={() =>{setEditButton(true)}}>edit</button>) }
                    </div>          
                    <div className="personal-info-text-container">
                        <p> Personal Information</p>
                    </div>            
                    <form className= "info-form" onSubmit={(e)=> {e.preventDefault();}}>
                        <div className ="form-group">
                            <label htmlFor="firstname-form"> First Name</label>
                            <input type="text" className="firstname-form" placeholder= "First Name" value={firstName} disabled={!IsEditing} onChange={(e) => setFirstname(e.target.value)}/>
                        </div>
                        <div className= "form-group">
                            <label htmlFor="lastname-form"> Last Name</label>
                            <input type="text" className="lastname-form" placeholder= "Last Name" value={lastName} disabled={!IsEditing}  onChange={(e) =>setLastname(e.target.value)}/>                                
                        </div>
                        <div className= "form-group">
                            <label htmlFor="username-form"> User Name</label>
                            <input type="text" className="username-form" placeholder= "User Name" value={username} disabled={!IsEditing} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className= "form-group">
                            <label htmlFor="email-form"> Email</label>
                            <input type="text" className="email-form" placeholder="Email" value={email} disabled={!IsEditing} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className= "form-group">
                            <label htmlFor="password-form"> Password</label>
                            <input type="password" className="password-form" placeholder="Password" value={password} disabled={!IsEditing}onChange={(e)=> setPassword(e.target.value)}/>
                        </div> 
                        <div className= "form-group">
                            <label htmlFor="display-name-form"> Display Name</label>
                            <input type="text" className="display-name-form" placeholder="Display Name" value={displayname} disabled={!IsEditing} onChange={(e)=> setDisplayname(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date=of-birth-form"> Birth Date</label>
                            <input type="date" className="date-of-birth-form" placeholder="dd/mm/jjjj" value={birthDate} disabled={!IsEditing} onChange={(e) => setBirthDate(e.target.value)}/>
                        </div>    
                    </form>
                    <div className="save-changes-button-container">
                            {IsEditing && (<button type="submit" className="save-changes-button" onClick={() =>{setEditButton(false)}}>save changes</button>)}
                    </div>
                </div>

            </div>   
        </div>
        )
    
    
}