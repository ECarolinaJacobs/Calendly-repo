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

      <form
        className="password-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
        {passwordError && (
          <div className="error-message-container">
            {" "}
            <p>Password does not match current password, please try again.</p>
          </div>
        )}
      </form>

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
