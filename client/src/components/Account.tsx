import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import getAccountDetails from "../api/getAccountDetails";
import Header from "./Header";

type DecodedToken = {
  user_id: number;
  username: string;
  iat: number;
  exp: number;
};

type AccountDetails = {
  username: string;
  email: string;
};

const Account = () => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );

  const fetchAccountDetails = async (decodedToken: DecodedToken) => {
    const details = await getAccountDetails(String(decodedToken.user_id));
    if (details) {
      setAccountDetails(details);
    } else {
      navigate("/sign-in/");
    }
  };

  const handleNewPassword = () => {
    // TODO
  };

  const handleNewUsername = () => {
    // TODO
  };

  const handleChange = () => {
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
          <div className="mb-4">
            <h1>Current Account Details</h1>
            <p>Username: {accountDetails.username}</p>
            <p>Email: {accountDetails.email}</p>
          </div>
        )}

        <h1>Update Account Details</h1>

        <form onSubmit={handleNewPassword} className="mb-4">
          <div className="mb-4">
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
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              onChange={handleChange}
              value=""
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
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              onChange={handleChange}
              value=""
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

        <form onSubmit={handleNewUsername} className="mb-4">
          <div className="mb-4">
            <label
              className="block text-white text-xl mb-2"
              htmlFor="old-username"
            >
              Old Username
            </label>
            <input
              type="text"
              id="old-username"
              name="username"
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              onChange={handleChange}
              value=""
            />
          </div>

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
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              onChange={handleChange}
              value=""
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
      </div>
    </div>
  );
};

export default Account;
