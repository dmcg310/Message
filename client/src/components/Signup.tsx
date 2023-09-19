import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import signUp from "../api/signUp";

type FormData = {
  username: string;
  password: string;
  email: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitForm = async (formData: FormData) => {
    setIsLoading(true);
    const result = await signUp(formData);
    setIsLoading(false);

    if (result) {
      if (result.token) {
        localStorage.setItem("token", result.token);
        toast.success("Success! Redirecting...");
        setTimeout(() => {
          navigate("/messages/");
        }, 2000);
      } else {
        toast.error(result.error || "Error setting new token");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.username || !formData.password) {
      toast.error("Email, username, or password cannot be empty");
      return;
    }

    // <3 ai
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!passwordPattern.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    if (formData.username.length > 25) {
      toast.error("Username cannot be more than 25 characters long.");
      return;
    }

    if (formData.username.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }

    submitForm(formData);
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url("../../assets/index.jpg")` }}
    >
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
        <h1 className="text-5xl text-white mb-4 max-md:text-2xl">
          Create Account
        </h1>
      </div>
      <div className="bg-opacity-60 backdrop-blur-md rounded p-4 w-max bg-black text-white flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-xl mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="max-md:text-sm max-md:w-full flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-xl mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="max-md:text-sm max-md:w-full flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-xl mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="max-md:text-sm max-md:w-full flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full max-md:text-lg"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xl pt-2 max-md:text-sm">
              Already have an account? <br />
              Sign in{" "}
              <a className="text-blue-600 hover:text-blue-800" href="/sign-in/">
                here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
