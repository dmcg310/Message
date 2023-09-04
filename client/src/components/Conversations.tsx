import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import saveMessage from "../api/sendMessage";
import Header from "./Header";

type Message = {
  SenderUsername: string;
  Content: string;
  CreatedAt: string;
};

// TODO: clear input on submit

const SpecificConversation = () => {
  const messagesEndRef = useRef(null);
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

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
  };

  const sendMesssage = async (message: string) => {
    const response = await saveMessage(5, Number(conversationId), message); // TODO: get actual user id

    if (response!.ok) {
      const wsMessage = {
        Message: {
          SenderUsername: "YourUsername", // TODO: get actual username from user id
          Content: message,
          CreatedAt: new Date().toISOString(),
        },
      };

      setMessages((prevMessages) => [...prevMessages, wsMessage.Message]);
      setCurrentMessage(""); // Clear the message input after sending the message successfully.
    } else {
      console.log("Message failed to send"); // TODO: display properly
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

  useEffect(() => {
    initWS();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="bg-cover bg-center h-screen relative flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url("../../assets/index.jpg")` }}
    >
      <Header />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-5xl text-white mb-4">Chatting with: username</h1>
        {/* TODO: get actual username from user id */}
      </div>

      <ul className="bg-opacity-60 backdrop-blur-md rounded p-4 w-full max-w-xl bg-black text-white overflow-y-scroll h-1/2">
        {messages.map((message, index) => (
          <li className="border-b border-gray-400 py-2" key={index}>
            <p className="font-bold">{message.SenderUsername}</p>
            <p className="text-gray-300">{message.Content}</p>
            <p className="text-xs text-gray-500">
              {new Date(message.CreatedAt).toLocaleString()}
            </p>
          </li>
        ))}
        <div ref={messagesEndRef}></div>
      </ul>

      <form
        className="mt-4 w-full max-w-xl flex justify-between items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Message"
          className="flex-grow rounded-l p-2 bg-opacity-60 backdrop-blur-md bg-black text-white focus:outline-none"
          onChange={(e) => setCurrentMessage(e.target.value)}
          value={currentMessage}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-800"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SpecificConversation;