import { useEffect, useRef, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import saveMessage from "../api/sendMessage";
import Header from "./Header";
import getConversations from "../api/getConversations";

type Message = {
  SenderUsername: string;
  Content: string;
  CreatedAt: string;
};

export type DecodedToken = {
  user_id: number;
  username: string;
  iat: number;
  exp: number;
};

type Conversation = {
  conversation_id: number;
  other_usernames: string[];
  lastMessage: string;
};

const SpecificConversation = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const handleWSMessage = (eventData: string) => {
    const data = JSON.parse(eventData);

    if (data.Messages) {
      setMessages((prevMessages) => [...prevMessages, ...data.Messages]);
    } else if (data.Message) {
      setMessages((prevMessages) => [...prevMessages, data.Message]);
    } else {
      console.log("No messages"); // TODO: display properly
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage === "") {
      return;
    }

    sendMesssage(currentMessage);
    setCharCount(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    if (newMessage.length <= 500) {
      setCurrentMessage(newMessage);
      setCharCount(newMessage.length);
    }
  };

  const sendMesssage = async (message: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      const response = await saveMessage(Number(conversationId), message);

      if (response!.ok) {
        const wsMessage = {
          Message: {
            SenderUsername: decodedToken.username, // adjusted here
            Content: message,
            CreatedAt: new Date().toISOString(),
          },
        };

        setMessages((prevMessages) => [...prevMessages, wsMessage.Message]);
        setCurrentMessage("");
      } else {
        console.log("Message failed to send"); // TODO: display properly
      }
    } else {
      navigate("/sign-in/");
    }
  };

  const initWS = () => {
    const socket = new WebSocket(
      `ws://localhost:8080/messages/${conversationId}/`
    );

    socket.addEventListener("message", (event) => {
      handleWSMessage(event.data);
      setCurrentMessage("");
    });

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  };

  const getUsernames = async (decodedToken: DecodedToken) => {
    const userId = decodedToken.user_id;
    const conversations = await getConversations(String(userId));

    if (conversations) {
      setConversations(conversations);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      getUsernames(decodedToken);

      if (Date.now() >= decodedToken.exp * 1000) {
        alert("token expired, please log in again"); // TODO: display better
        navigate("/sign-in/");
      }
    } else {
      navigate("/sign-in/");
    }

    const cleanup = initWS();
    return cleanup;
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const currentConversation = conversations.find(
    (conversation) => conversation.conversation_id === Number(conversationId)
  );

  return (
    <div
      className="bg-cover bg-center h-screen relative flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url("../../assets/index.jpg")` }}
    >
      <Header />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-5xl text-white mb-4">
          Chatting with:{" "}
          {currentConversation
            ? currentConversation.other_usernames.join(", ")
            : "Loading..."}
        </h1>
      </div>
      <ul className="bg-opacity-60 backdrop-blur-md rounded p-4 w-full max-w-3xl bg-black text-white overflow-y-scroll h-2/3">
        {messages.map((message, index) => (
          <li className="border-b border-gray-400 py-2" key={index}>
            <p className="font-bold text-blue-600 text-1xl">
              {message.SenderUsername}
            </p>
            <p className="text-gray-300 text-2xl">{message.Content}</p>
            <p className="text-gray-500 text-1xl">
              {new Date(message.CreatedAt).toLocaleString()}
            </p>
          </li>
        ))}
        <div ref={messagesEndRef}></div>
      </ul>
      <form
        className="mt-4 w-full max-w-3xl flex justify-between items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Message"
          className="flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
          onChange={handleChange}
          value={currentMessage}
        />
        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white text-2xl ml-2 px-6 py-3 rounded-3xl hover:bg-blue-800"
          >
            Send
          </button>
        </div>
      </form>
      <span className="m-2 text-1xl text-white">{charCount}/500</span>{" "}
    </div>
  );
};

export default SpecificConversation;
