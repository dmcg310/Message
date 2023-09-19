import { useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/messages/");
    }
  }, []);

  return (
    <div className="bg-cover bg-center h-screen relative flex items-center justify-center">
      <Header />
      <div className="text-center max-md:w-screen max-md:p-4">
        <h1 className="text-white text-5xl font-extrabold mb-4 max-md:text-4xl">
          Connect with the Universe
        </h1>
        <p className="text-white text-lg mb-6 max-md:text-sm">
          Engage in stellar conversations, make friends from all corners of the
          galaxy.
        </p>
        {(localStorage.getItem("token") && (
          <a
            href="/messages/"
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-800"
          >
            Start Chatting
          </a>
        )) || (
          <a
            href="/create-account/"
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-800"
          >
            Start Chatting
          </a>
        )}
      </div>
    </div>
  );
};

export default Index;
