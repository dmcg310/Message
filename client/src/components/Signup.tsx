import { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import signUp from "../api/signUp";

// TODO: email, password validation
// username can only be 25 characters long

type FormData = {
  username: string;
  password: string;
  email: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitForm = async (formData: FormData) => {
    const token = await signUp(formData);
    if (token) {
      localStorage.setItem("token", token);
      navigate("/messages");
    } else {
      // TODO: handle error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <button
              type="submit"
              className="bg-blue-600 text-white text-2xl px-6 py-2 rounded hover:bg-blue-800 w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
