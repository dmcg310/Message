import { useEffect, useRef, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import saveMessage from "../api/sendMessage";
import Header from "./Header";
import getConversations from "../api/getConversations";
import checkConversation from "../api/validateConversations";
import { ToastContainer, toast } from "react-toastify";

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
  const socket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage === "") {
      return;
    }

    sendMessage(currentMessage);
    setCharCount(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    if (newMessage.length <= 500) {
      setCurrentMessage(newMessage);
      setCharCount(newMessage.length);
    }
  };

  const tokenHandling = (): DecodedToken | undefined => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken;
    } else {
      navigate("/sign-in/");
      return undefined;
    }
  };

  const sendMessage = async (message: string) => {
    if (message === "") {
      return;
    }

    const decodedToken = tokenHandling();
    if (decodedToken != undefined) {
      const response = await saveMessage(Number(conversationId), message);

      if (response!.ok) {
        const wsMessage = {
          Message: {
            SenderUsername: decodedToken.username,
            Content: message,
            CreatedAt: new Date().toISOString(),
          },
        };

        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
          socket.current.send(JSON.stringify(wsMessage));
        }

        setCurrentMessage("");
      } else {
        toast.error("Message failed to send");
      }
    } else {
      navigate("/sign-in/");
    }
  };

  const validateConversations = async (conversationId: string) => {
    const token = tokenHandling();
    if (token != undefined) {
      // check to see if user is part of that conversation
      const response = await checkConversation(
        Number(conversationId),
        token.user_id
      );
      if (response == false) {
        navigate("/");
      }
    } else {
      toast.error("Error getting token");
    }
  };

  const initWS = () => {
    socket.current = new WebSocket(
      `ws://localhost:8080/messages/${conversationId}/`
    );

    socket.current.addEventListener("message", (event) => {
      handleWSMessage(event.data);
    });

    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  };

  const getUsernames = async (decodedToken: DecodedToken) => {
    const userId = decodedToken.user_id;
    const conversations = await getConversations(String(userId));

    if (conversations?.data) {
      setConversations(conversations.data);
    } else {
      toast.error(conversations?.error || "Error retrieving usernames");
    }
  };

  useEffect(() => {
    const decodedToken = tokenHandling();
    if (decodedToken != undefined) {
      getUsernames(decodedToken);

      if (Date.now() >= decodedToken.exp * 1000) {
        toast.error(
          "Your token has expired, please log in again. Redirecting..."
        );
        setTimeout(() => {
          navigate("/sign-in/");
        }, 2000);
      }
    } else {
      navigate("/sign-in/");
    }

    const cleanup = initWS();
    return cleanup;
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      // @ts-ignore
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    validateConversations(conversationId!);
  });

  const currentConversation = conversations.find(
    (conversation) => conversation.conversation_id === Number(conversationId)
  );

  return (
    <div
      className="bg-cover bg-center h-screen relative flex flex-col items-center justify-center p-4"
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
        <h1 className="text-5xl text-white mb-4 max-md:text-2xl max-md:w-4/5">
          Chatting with:{" "}
          {currentConversation
            ? currentConversation.other_usernames.join(", ")
            : "Loading..."}
        </h1>
      </div>
      <ul className="max-md:w-4/5 bg-opacity-60 backdrop-blur-md rounded p-4 w-full max-w-3xl bg-black text-white overflow-y-scroll h-2/3 max-md:h-3/5">
        {messages.length === 0 ? (
          <li className="text-gray-400 text-2xl">No messages yet</li>
        ) : (
          messages.map((message, index) => (
            <li className="border-b border-gray-400 py-2" key={index}>
              <p className="font-bold text-blue-600 text-sm">
                {message.SenderUsername}
              </p>
              <p className="text-gray-300 text-2xl max-md:text-lg">
                {message.Content}
              </p>
              <p className="text-gray-500 text-1xl max-md:text-sm">
                {new Date(message.CreatedAt).toLocaleString()}
              </p>
            </li>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </ul>
      <form
        className="mt-4 w-full max-w-3xl flex justify-between items-center max-md:w-4/5"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Message"
          className="max-md:w-full flex-grow rounded-l text-2xl p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none max-md:text-lg"
          onChange={handleChange}
          value={currentMessage}
        />
        <div className="flex items-center">
          <button
            type="submit"
            className="max-md:w-full bg-blue-600 text-white text-2xl ml-2 px-6 py-3 rounded-3xl hover:bg-blue-800 max-md:1/2 max-md:py-2 max-md:text-lg"
          >
            Send
          </button>
        </div>
      </form>
      <span className="m-2 text-1xl text-white max-md:text-sm">
        {charCount}/500
      </span>{" "}
    </div>
  );
};

export default SpecificConversation;
