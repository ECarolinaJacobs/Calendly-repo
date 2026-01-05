import { useEffect, useState } from "react";
import { getUserInformation, updateUserInformation } from "../api/users";
import "../css/ProfilePage.css";
import { DashboardBanner } from "../../components/Dashboard/Dashboard-banner";
import { Sidebar } from "../../components/Dashboard/Sidebar";
import { ProfileBanner } from "../../components/Profile/BannerDisplay";
import PersonalInfo from "../../components/Profile/PersonalInfoDisplay";
import PasswordInfoDisplay from "../../components/Profile/PasswordInfoDisplay";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coins, setCoins] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [IsEditing, setEditButton] = useState(false);
  const [IsEditingPassword, setIsEditingPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");

  useEffect(() => {
    loadUserData();
  }, []);

  const navigate = useNavigate();
  //Retrieves the user data and saves it in hooks
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("loading user data");
      const userId = Number(localStorage.getItem("userId"));
      console.log("userId being used:", userId);

      //Checks if the user with retrieved user id exists
      if (!userId || isNaN(userId) || userId < 1) {
        setError("User ID not found, please log in.");
        setLoading(false);
        return;
      }
      //retrieves user id  the API
      const userProfile = await getUserInformation(userId);
      console.log("Retrieved user profile:", userProfile);

      //Set user data
      setName(userProfile.name);
      setEmail(userProfile.email);
      setCoins(userProfile.coins);
      setNewPassword("");
    } catch (err) {
      setError("Failed to load user data");
      console.error("Error response:", err);
    } finally {
      setLoading(false);
    }
  };

  //Saves the name and email changes the user has made
  const saveUserChanges = async () => {
    try {
      setLoading(true);
      setError(null);

      //Checks if the user with retrieved user id exists
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        setError("User ID not found, please log in.");
        setLoading(false);
        return;
      }
      //Updates the name and email of the user
      await updateUserInformation(userId, {
        name,
        email,
      });
      //Updates password if there is an input value
      if (password.trim() !== "") {
        await updateUserInformation(userId, {
          password,
        });
      }
      //Reload the userdata so that is in sync with the backend
      await loadUserData();
      setIsEditingPassword(false);
    } catch (err) {
      setError("Failed to save changes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserPasswordChanges = async () => {
    try {
      setLoading(true);
      setPasswordError(null);
      setPassword("");
      setNewPassword("");
      //Checks if the user with retrieved user id exists
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        setPasswordError("User ID not found, please log in.");
        setLoading(false);
        return;
      }
      //Updates the current password and new password
      await updateUserInformation(userId, {
        password,
        newPassword,
      });

      setPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
      //Reload the userdata so that is in sync with the backend
      await loadUserData();
    } catch (err) {
      setPasswordError("Failed to save changes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="dashboard-layout">
      {/*Navigation of the sidebar that is used to navigate between different pages*/}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        navigate={navigate}
      />
      {/*Main content area displays the whole profile page content */}
      <div className={`main-content-area ${sidebarOpen ? "shift" : ""}`}>
        {/*Displays the name of the user*/}
        <DashboardBanner userName={name} />
        {/*profile page area displays the profile page content */}
        <div className="profile-page">
          {/*Displays name and coins of the user in a banner*/}
          <ProfileBanner name={name} coins={coins} />
          {/*Displays editing name and email of the user*/}
          <PersonalInfo
            name={name}
            email={email}
            IsEditing={IsEditing}
            onNameChange={setName}
            onEmailChange={setEmail}
            onEditClick={() => setEditButton(true)} // Enables editing name and email of the user
            onSaveClick={() => {
              setEditButton(false); //Disables editing
              saveUserChanges(); //Saves name and email of the user*/}
            }}
          />
          {/*Displays editing the password of the user*/}
          <PasswordInfoDisplay
            password={password}
            newPassword={newPassword}
            passwordError={passwordError}
            IsEditingPassword={IsEditingPassword}
            onPasswordChange={setPassword}
            onNewPasswordChange={setNewPassword}
            onEditClick={() => {
              setIsEditingPassword(true); //Enables editing password of the user
            }}
            onSaveClick={() => {
              setIsEditingPassword(false); //Disables editing password of the user
              saveUserPasswordChanges(); //Saves password of the user
            }}
          />
        </div>
      </div>
    </div>
  );
}
