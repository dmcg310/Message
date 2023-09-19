import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import getConversations from "../api/getConversations";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { DecodedToken } from "./Conversations";
import Modal from "./Modal";
import createConversation from "../api/createConversation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Conversation = {
  conversation_id: number;
  other_usernames: string[];
  lastMessage: string;
};

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      if (Date.now() >= decodedToken.exp * 1000) {
        toast.error("Token has expired please sign in again");
        setTimeout(() => {
          navigate("/sign-in/");
        }, 2000);
      }

      const userId = decodedToken.user_id;
      const conversations = await getConversations(String(userId));

      if (conversations?.data) {
        setConversations(conversations.data);
      }
    } else {
      navigate("/sign-in/");
    }
  };

  const handleNewConversation = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = async (username: any) => {
    const response = await createConversation(username);
    if (response?.data) {
      if (response?.data.message == "Conversation created successfully") {
        toast.success("Success!");
        fetchConversations();
      } else {
        toast.error(response.error || "Error creating conversation");
      }
    } else {
      toast.error(response?.error || "Error creating conversation");
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const conversationContent = conversations.length ? (
    conversations.map((conversation) => (
      <li
        className="border-b border-gray-400 py-2 w-full"
        key={conversation.conversation_id}
      >
        <button
          className="text-3xl hover:text-gray-300 w-full text-left pl-4 max-md:text-xl"
          onClick={() => navigate(`/messages/${conversation.conversation_id}/`)}
        >
          {conversation.other_usernames.join(", ")}
        </button>
        <p className="text-gray-400 text-sm pl-4">{conversation.lastMessage}</p>
      </li>
    ))
  ) : (
    <li className="text-center py-2 w-full">
      <p className="text-gray-400 text-2xl">No conversations yet.</p>
    </li>
  );

  return (
    <div
      className="bg-cover bg-center h-screen relative flex flex-col items-center p-4 justify-center"
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
        <h1 className="text-5xl text-white mb-4 max-md:text-3xl">
          Conversations
        </h1>
      </div>
      <ul className="max-md:w-4/5 bg-opacity-60 backdrop-blur-md rounded p-4 w-full max-w-3xl bg-black text-white overflow-y-scroll h-2/3 relative flex flex-col items-center">
        {conversationContent}
      </ul>
      <button
        className="bg-emerald-600 text-2xl text-white rounded-md p-4 mt-4 hover:bg-emerald-800 max-md:text-lg"
        onClick={handleNewConversation}
      >
        Add New Conversation
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default Messages;
