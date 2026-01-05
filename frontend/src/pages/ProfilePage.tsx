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
      setCoins(userProfile.coins);
      setNewPassword("");
    } catch (err) {
      setError("Failed to load user data");
      console.error("Error response:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserChanges = async () => {
    try {
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
        email,
      });

      if (password.trim() !== "") {
        await updateUserInformation(userId, {
          password,
        });
      }
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

      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        setPasswordError("User ID not found, please log in.");
        setLoading(false);
        return;
      }
      await updateUserInformation(userId, {
        password,
        newPassword,
      });

      setPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        navigate={navigate}
      />

      <div className={`main-content-area ${sidebarOpen ? "shift" : ""}`}>
        <DashboardBanner userName={name} />
        <div className="profile-page">
          <ProfileBanner name={name} coins={coins} />
          <PersonalInfo
            name={name}
            email={email}
            IsEditing={IsEditing}
            onNameChange={setName}
            onEmailChange={setEmail}
            onEditClick={() => setEditButton(true)}
            onSaveClick={() => {
              setEditButton(false);
              saveUserChanges();
            }}
          />
          <PasswordInfoDisplay
            password={password}
            newPassword={newPassword}
            passwordError={passwordError}
            IsEditingPassword={IsEditingPassword}
            onPasswordChange={setPassword}
            onNewPasswordChange={setNewPassword}
            onEditClick={() => {
              setIsEditingPassword(true);
            }}
            onSaveClick={() => {
              setIsEditingPassword(false);
              saveUserPasswordChanges();
            }}
          />
        </div>
      </div>
    </div>
  );
}
