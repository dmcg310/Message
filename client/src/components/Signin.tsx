import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import signIn from "../api/signIn";
import { DecodedToken } from "./Conversations";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
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
    if (!formData.email || !formData.password) {
      toast.error("Email or password cannot be empty");
      return;
    }

    setIsLoading(true);
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      const decodedToken: DecodedToken = jwtDecode(existingToken);

      if (Date.now() >= decodedToken.exp * 1000) {
        const result = await signIn(formData);
        setIsLoading(false);

        if (result) {
          if (result.token) {
            localStorage.setItem("token", result.token);
            navigate("/messages");
          } else {
            toast.error(result.error || "Error setting new token");
            navigate("/sign-in/");
          }
        }
      } else {
        toast.info("You are already logged in!");
        navigate("/messages");
      }
    } else {
      const result = await signIn(formData);
      setIsLoading(false);

      if (result) {
        if (result.token) {
          localStorage.setItem("token", result.token);
          navigate("/messages");
        } else {
          toast.error(result.error || "Error setting new token");
          navigate("/sign-in/");
        }
      }
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
        <h1 className="text-5xl text-white mb-4 max-md:text-2xl">Login</h1>
      </div>
      <div className="bg-opacity-60 backdrop-blur-md rounded p-4 w-max bg-black text-white flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
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
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="text-center">
            <p className="text-xl pt-2 max-md:text-sm">
              Create an account{" "}
              <a
                className="text-blue-600 hover:text-blue-800"
                href="/create-account/"
              >
                here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
