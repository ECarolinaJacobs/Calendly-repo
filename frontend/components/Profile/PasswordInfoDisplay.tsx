/* properties that are required for the passwordInfo component */

interface PasswordInfoProps {
  password: string;
  newPassword: string;
  passwordError: string | null;
  IsEditingPassword: boolean;
  onPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onEditClick: () => void;
  onSaveClick: () => void;
}
/* Displays the password info section that lets the user change their password */

export default function PasswordInfoDisplay({
  password,
  newPassword,
  passwordError,
  IsEditingPassword,
  onPasswordChange,
  onNewPasswordChange,
  onEditClick,
  onSaveClick,
}: PasswordInfoProps) {
  return (
    <div className="password-change-section">
      <div className="change-password-button-container">
        {/* Edit button that only shows when the user is not editing*/}
        {!IsEditingPassword && (
          <button className="change-password-button" onClick={onEditClick}>
            change password
          </button>
        )}
      </div>
      <div className="password-info-text-container">
        <p> Security</p>
      </div>
      <div className="instructions-password">
        <p>Input the current password to change to new password</p>
      </div>
      {/* Form that lets the user change their password*/}
      <form
        className="password-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Current password input*/}
        <div className="form-group">
          <label htmlFor="current-password-form"> Current Password</label>
          <input
            type="password"
            className="current-password-form"
            placeholder="Current Password"
            value={password}
            readOnly={!IsEditingPassword}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
        {/* New password input*/}
        <div className="form-group">
          <label htmlFor="new-password-form"> New Password</label>
          <input
            type="password"
            className="new-password-form"
            placeholder="New Password"
            value={newPassword}
            readOnly={!IsEditingPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
          />
        </div>
        {/*Display error if the current password doesnt match the input current password*/}
        {passwordError && (
          <div className="error-message-container">
            {" "}
            <p>Password does not match current password, please try again.</p>
          </div>
        )}
      </form>
      {/* Button that saves changes and disables editing*/}
      <div className="save-password-button-container">
        {IsEditingPassword && (
          <button
            className="save-password-button"
            onClick={() => {
              onEditClick();
              onSaveClick();
            }}
          >
            save new password
          </button>
        )}
      </div>
    </div>
  );
}
