/* properties that are required for the personalInfo component */
interface PersonalInfoProps {
  name: string;
  email: string;
  IsEditing: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onEditClick: () => void;
  onSaveClick: () => void;
}

/* Displays the users info that lets the user view and change their username and email */
export default function PersonalInfo({
  name,
  email,
  IsEditing,
  onNameChange,
  onEmailChange,
  onEditClick,
  onSaveClick,
}: PersonalInfoProps) {
  return (
    <div className="info-section">
      <div className="edit-button-container">
        {/* Edit button that only shows when the user is not editing*/}
        {!IsEditing && (
          <button className="edit-button" onClick={onEditClick}>
            edit
          </button>
        )}
      </div>

      <div className="personal-info-text-container">
        <p> Personal Information</p>
      </div>
      {/* Form that lets the user change their name and email*/}
      <form
        className="info-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* First name input*/}
        <div className="form-group">
          <label htmlFor="firstname-form"> Name</label>
          <input
            type="text"
            className="firstname-form"
            value={name}
            readOnly={!IsEditing}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        {/* email input*/}
        <div className="form-group">
          <label htmlFor="email-form"> Email</label>
          <input
            type="text"
            className="email-form"
            placeholder="Email"
            value={email}
            readOnly={!IsEditing}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
      </form>
      {/* Button that saves changes and disables editing*/}
      <div className="save-changes-button-container">
        {IsEditing && (
          <button
            className="save-changes-button"
            onClick={() => {
              onEditClick(), onSaveClick();
            }}
          >
            Save changes
          </button>
        )}
      </div>
    </div>
  );
}
