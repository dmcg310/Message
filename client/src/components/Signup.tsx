import { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import signUp from "../api/signUp";
import Loading from "./Loading";

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
    const token = await signUp(formData);
    setIsLoading(false);

    if (token) {
      localStorage.setItem("token", token);
      navigate("/messages/");
    } else {
      alert("error setting token");
      navigate("/create-account/");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // <3 ai
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!passwordPattern.test(formData.password)) {
      alert(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    if (formData.username.length > 25) {
      alert("Username cannot be more than 25 characters long.");
      return;
    }

    if (formData.username.length < 3) {
      alert("Username must be at least 3 characters long.");
      return;
    }

    submitForm(formData);
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url("../../assets/index.jpg")` }}
    >
      <Header />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-5xl text-white mb-4">Create Account</h1>
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
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
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
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
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
              className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="text-center">
            <Loading isLoading={isLoading} />
            <button
              type="submit"
              className="bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full"
            >
              Sign Up
            </button>
          </div>

          <div className="text-center">
            <p className="text-xl pt-2">
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
