import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import getConversations from "../api/getConversations";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

type Conversation = {
  conversation_id: number;
  other_usernames: string[];
  lastMessage: string;
};

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      type DecodedToken = {
        user_id: number;
        username: string;
        iat: number;
        exp: number;
      };

      const decodedToken: DecodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      const conversations = await getConversations(String(userId));

      if (conversations) {
        setConversations(conversations);
      }
    } else {
      navigate("/sign-in/");
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen relative flex flex-col items-center p-4 justify-center"
      style={{ backgroundImage: `url("../../assets/index.jpg")` }}
    >
      <Header />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-5xl text-white mb-4">Conversations</h1>
      </div>
      <ul className="bg-opacity-60 backdrop-blur-md rounded p-4 w-full max-w-3xl bg-black text-white overflow-y-scroll h-2/3 relative flex flex-col items-center">
        {conversations.map((conversation) => (
          <li
            className="border-b border-gray-400 py-2 w-full"
            key={conversation.conversation_id}
          >
            <button
              className="text-3xl hover:text-gray-300 w-full text-left pl-4"
              onClick={() =>
                navigate(`/messages/${conversation.conversation_id}/`)
              }
            >
              {conversation.other_usernames.join(", ")}
            </button>
            <p className="text-gray-400 text-sm pl-4">
              {conversation.lastMessage}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
