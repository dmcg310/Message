import { useState } from "react";
import debounce from "lodash.debounce";

const Modal = ({ isOpen, onClose, onConfirm }: any) => {
  const [usernames, setUsernames] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateUsernames = debounce(async (value: any) => {
    // TODO: Add API call to validate usernames here
    // setIsValid(response.isValid);
  }, 300);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setUsernames(value);
    validateUsernames(value);
  };

  const handleSubmit = () => {
    if (isValid) {
      onConfirm(usernames);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <div>
        <input
          type="text"
          value={usernames}
          onChange={handleChange}
          placeholder="Enter usernames, separated by commas"
        />
        {!isValid && <p className="error-text">Invalid usernames</p>}
        <button onClick={handleSubmit}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
