import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import getAccountDetails from "../api/getAccountDetails";
import Header from "./Header";
import { DecodedToken } from "./Conversations";

type AccountDetails = {
  username: string;
  email: string;
};

const Account = () => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const fetchAccountDetails = async (decodedToken: DecodedToken) => {
    const details = await getAccountDetails(String(decodedToken.user_id));
    if (details) {
      setAccountDetails(details);
    } else {
      navigate("/sign-in/");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "old-password") {
      setOldPassword(e.target.value);
    } else if (e.target.id === "new-password") {
      setNewPassword(e.target.value);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "new-username") {
      setNewUsername(e.target.value);
    }
  };

  const handleNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle new password submission using oldPassword and newPassword state variables
  };

  const handleNewUsername = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle new username submission using oldUsername and newUsername state variables
  };

  const handleSignOut = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);

      if (Date.now() >= decodedToken.exp * 1000) {
        alert("token expired, please log in again");
        navigate("/sign-in/");
      } else {
        fetchAccountDetails(decodedToken);
      }
    } else {
      navigate("/sign-in/");
    }
  }, []);

  return (
    <div
      className="bg-cover bg-center h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url("../../assets/index.jpg")` }}
    >
      <Header />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-5xl text-white mb-4">Account</h1>
      </div>
      <div className="bg-opacity-60 backdrop-blur-md rounded p-4 w-max bg-black text-white flex flex-col items-center justify-center">
        {accountDetails && (
          <div className="w-full">
            <div className="flex pb-4 justify-between items-center">
              <div>
                <p className="text-2xl">Username: {accountDetails.username}</p>
                <p className="text-2xl">Email: {accountDetails.email}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-4 flex-col">
          <form onSubmit={handleNewPassword}>
            <div>
              <label
                className="block text-white text-xl mb-2"
                htmlFor="old-password"
              >
                Old Password
              </label>
              <input
                type="password"
                id="old-password"
                name="password"
                className="flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
                onChange={handlePasswordChange}
                value={oldPassword}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-white text-xl mb-2"
                htmlFor="new-password"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                name="password"
                className="flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
                onChange={handlePasswordChange}
                value={newPassword}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full"
              >
                Update Password
              </button>
            </div>
          </form>

          <div>
            <form onSubmit={handleNewUsername} className="mb-4">
              <div className="mb-4">
                <label
                  className="block text-white text-xl mb-2"
                  htmlFor="new-username"
                >
                  New Username
                </label>
                <input
                  type="text"
                  id="new-username"
                  name="username"
                  className="flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
                  onChange={handleUsernameChange}
                  value={newUsername}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full"
                >
                  Update Username
                </button>
              </div>
            </form>
            <div className="flex flex-row justify-center gap-2">
              <button
                type="submit"
                className="bg-emerald-600 text-white text-2xl px-6 py-2 rounded hover:bg-emerald-800 h-3/3 w-2/3"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
              <button
                type="submit"
                className="bg-rose-600 text-white text-2xl px-6 py-2 rounded hover:bg-rose-800 h-3/3 w-2/3"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;