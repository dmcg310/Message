import { useState } from "react";
import debounce from "lodash.debounce";
import checkUsername from "../api/validateUsernames";
import jwtDecode from "jwt-decode";
import { DecodedToken } from "./Conversations";

// Modal for adding users to a conversation
const Modal = ({ isOpen, onClose, onConfirm }: any) => {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setUsername(value);

    setIsLoading(true);
    const debouncedValidation = debounce(async () => {
      const response = await checkUsername(value);
      setIsValid(response);
      setIsLoading(false);
    }, 300);

    debouncedValidation();
  };

  const handleSubmit = () => {
    if (isValid) {
      const decodedToken: DecodedToken = jwtDecode(
        localStorage.getItem("token")!
      );

      if (username == decodedToken.username) {
        setUsername("");
        setIsValid(null);
        return;
      }

      onConfirm(username);
      setIsValid(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <div
        className="max-md:w-4/5 bg-opacity-60 backdrop-blur-md rounded p-4 w-1/3 bg-black text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Check if a user exists by specifying their username"
          className="max-md:text-sm flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
        />
        <p className="mt-2 flex text-2xl items-center max-md:text-sm">
          {isLoading ? (
            <span className="text-gray-500">Checking...</span>
          ) : isValid === null ? (
            <span className="text-gray-500">Enter a username to check</span>
          ) : isValid ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2 text-green-500">Username is valid</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="ml-2 text-red-500">Username is not valid</span>
            </>
          )}
        </p>
        <div className="flex gap-5">
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-2xl w-full text-white p-2 rounded mt-2 hover:bg-emerald-800 max-md:text-lg"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="bg-rose-600 text-2xl w-full text-white p-2 rounded mt-2 hover:bg-rose-800 max-md:text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
