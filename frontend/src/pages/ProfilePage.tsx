import { use, useEffect,useState } from "react";
import {getUserInformation, updateUserInformation} from "../api/users";
import "./ProfilePage.css";


export default function ProfilePage()
{   
    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [IsEditing, setEditButton] = useState(false);
    const [IsEditingPassword, setIsEditingPassword] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);


    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("loading user data");
            const userId = Number(localStorage.getItem("userId"));
            console.log("userId being used:", userId); 
            if (!userId || isNaN(userId) || userId < 1) {
                setError("User ID not found, please log in.");
                setLoading(false);
                return;
            }
            const userProfile = await getUserInformation(userId);
            console.log("Retrieved user profile:", userProfile);


            setName(userProfile.name);
            setEmail(userProfile.email);
            setNewPassword("");

        } catch (err) {
            setError("Failed to load user data" );
            console.error("Error response:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveUserChanges = async () =>{
        try{
            setLoading(true);
            setError(null);

            const userId = Number(localStorage.getItem("userId"));
            if (!userId) {
                setError("User ID not found, please log in.");
                setLoading(false);
                return;
           
            }
            await updateUserInformation(userId, {

                name,
                email
            });

            if (password.trim() !== "") {
                await updateUserInformation(userId, {
                    password
                });
            }
            await loadUserData();
            setIsEditingPassword(false);
        }
        catch (err){
            setError("Failed to save changes");
            console.error(err);
        }
        finally{
            setLoading(false);
        }
    };

    const saveUserPasswordChanges = async () =>{
    try{
        setLoading(true);
        setError(null);

        const userId = Number(localStorage.getItem("userId"));
        if (!userId) {
            setError("User ID not found, please log in.");
            setLoading(false);
            return;
        }
        await updateUserInformation(userId, {
            password,
            newPassword
        });

        setPassword("");
        setNewPassword("");
        setIsEditingPassword(false);
        await loadUserData();
       
    }
    catch (err){
        setError("Failed to save changes");
        console.error(err);
    }
    finally{
        setLoading(false);
    }
};

    //upload profile picture function can be added later
    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }
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
                        <p className="username-display"> {name} </p> 
                </div> 
            
                <div className = "info-section">

                    <div className="edit-button-container">
                        {!IsEditing && <button className="edit-button" onClick={() =>{setEditButton(true)}}>edit</button> }
                    </div>          

                    <div className="personal-info-text-container">
                        <p> Personal Information</p>
                    </div>

                    <form className= "info-form" onSubmit={(e)=> {e.preventDefault();}}>
                        <div className ="form-group">
                            <label htmlFor="firstname-form"> Name</label>
                            <input type="text" className="firstname-form" value={name} readOnly={!IsEditing} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className= "form-group">
                            <label htmlFor="email-form"> Email</label>
                            <input type="text" className="email-form" placeholder="Email" value={email} readOnly={!IsEditing} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </form>
                    <div className="save-changes-button-container">
                        {IsEditing && <button className="save-changes-button" onClick={() =>{setEditButton(false),saveUserChanges()}}>Save changes</button> }
                    </div>  
                
                    
                    <div className="change-password-button-container">
                        {!IsEditingPassword && <button className="change-password-button" onClick={() =>{setIsEditingPassword(true)}}>change password</button> }
                    </div> 

                    <div className="password-info-text-container">
                        <p> Security</p>
                    </div>
                    <div className="password-change-section">
                        <p>Input the current password to change to new password</p>
                    </div>
                    <form className= "password-form" onSubmit={(e)=> {e.preventDefault();}}>
                        <div className ="form-group">
                            <label htmlFor="current-password-form"> Current Password</label>
                            <input type="password" className="current-password-form" placeholder="Current Password" value={password} readOnly={!IsEditingPassword} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="new-password-form"> New Password</label>
                            <input type="password" className="new-password-form" placeholder="New Password" value={newPassword} readOnly={!IsEditingPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
                        </div>
                    </form>

                    <div className="save-password-button-container">
                        {IsEditingPassword && <button className="save-password-button" onClick={() =>{setIsEditingPassword(false),saveUserPasswordChanges()}}>save new password</button> }
                    </div>

                </div>

            </div>
        </div>
        )
    
    
}