import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import getAccountDetails from "../api/getAccountDetails";
import Header from "./Header";
import { DecodedToken } from "./Conversations";
import signOut from "../api/signOut";
import updateUsername from "../api/updateUsername";
import updatePassword from "../api/updatePassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AccountDetails = {
  username: string;
  email: string;
};

const Account = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );

  const fetchAccountDetails = async (decodedToken: DecodedToken) => {
    setIsLoading(true);

    try {
      const result = await getAccountDetails(String(decodedToken.user_id));
      setIsLoading(false);

      if (result) {
        setAccountDetails(result.data);
      } else {
        toast.error(result!.error || "Error fetching account details");
      }
    } catch (error) {
      console.error(error);
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
    setNewUsername(e.target.value);
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      oldPassword === null ||
      oldPassword === undefined ||
      oldPassword === ""
    ) {
      toast.error("Old password cannot be blank");
      setIsLoading(false);
      return;
    } else if (
      newPassword === null ||
      newPassword === undefined ||
      newPassword === ""
    ) {
      toast.error("New password cannot be blank");
      setIsLoading(false);
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);

      const response = await updatePassword(
        oldPassword,
        newPassword,
        decodedToken.user_id
      );
      setIsLoading(false);

      if (response!.data) {
        if (response?.data.message == "Password updated successfully") {
          toast.success("Success! Redirecting...");
          setTimeout(() => {
            navigate("/messages/");
          }, 2000);
        }
      } else {
        toast.error(response!.error || "Error updating password");
      }
    } else {
      navigate("/sign-in/");
    }

    setIsLoading(false);
  };

  const handleNewUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      newUsername === null ||
      newUsername === undefined ||
      newUsername === ""
    ) {
      toast.error("New username cannot be blank");
      setIsLoading(false);
      return;
    }

    if (newUsername.length < 3) {
      toast.error("New username must be longer than 3 characters");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);

      const response = await updateUsername(newUsername, decodedToken.user_id);
      setIsLoading(false);

      if (response?.data.message == "Username updated successfully") {
        toast.success("Success! Redirecting...");
        setTimeout(() => {
          navigate("/messages/");
        }, 2000);
      } else {
        toast.error(response?.error || "Error updating username");
      }
    } else {
      navigate("/sign-in/");
    }

    setIsLoading(false);
  };

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await signOut();
    setIsLoading(false);

    if (response!.data) {
      if (response?.data.message == "Remove JWT from client") {
        localStorage.removeItem("token");
        toast.success("Success! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } else {
      toast.error(response?.error || "Error signing out");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);

      if (Date.now() >= decodedToken.exp * 1000) {
        toast.error(
          "Your token has expired, please log in again. Redirecting..."
        );
        setTimeout(() => {
          navigate("/sign-in/");
        }, 2000);
      } else {
        fetchAccountDetails(decodedToken);
      }
    } else {
      navigate("/sign-in/");
    }
  }, []);

  return (
    <div className="bg-cover bg-center h-screen flex flex-col items-center justify-center p-4">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-5xl text-white mb-4 max-md:text-3xl">Account</h1>
      </div>
      <div className="max-md:w-4/5 bg-opacity-60 backdrop-blur-md rounded p-4 w-max bg-black text-white flex flex-col items-center justify-center">
        {accountDetails && (
          <div className="w-full">
            <div className="flex pb-4 justify-between items-center">
              <div>
                <p className="text-2xl max-md:text-lg ">
                  Username: {accountDetails.username}
                </p>
                <p className="text-2xl max-md:text-lg">
                  Email: {accountDetails.email}
                </p>
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
                className="max-md:text-sm flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
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
                className="max-md:text-sm flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
                onChange={handlePasswordChange}
                value={newPassword}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="max-md:text-lg bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full"
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
                  htmlFor="username"
                >
                  New Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="max-md:text-sm flex-grow w-full rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
                  onChange={handleUsernameChange}
                  value={newUsername}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="max-md:text-lg bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full"
                >
                  Update Username
                </button>
              </div>
            </form>
            <button
              type="submit"
              className="max-md:text-lg bg-rose-600 text-white w-full text-2xl px-6 py-2 rounded hover:bg-rose-800 h-3/3"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            {isLoading && (
              <div className="text-center pt-2">
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
