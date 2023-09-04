import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import saveMessage from "../api/sendMessage";

type Message = {
  SenderUsername: string;
  Content: string;
  CreatedAt: string;
};

const SpecificConversation = () => {
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

  const sendMesssage = async (message: string) => {
    const response = await saveMessage(5, 1, message);

    if (response!.ok) {
      const wsMessage = {
        Message: {
          SenderUsername: "YourUsername", // TODO: get actual username
          Content: message,
          CreatedAt: new Date().toISOString(),
        },
      };

      setMessages((prevMessages) => [...prevMessages, wsMessage.Message]);
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

  return (
    <div>
      <h1>Conversation</h1>
      <ul>
        {messages.map((message, index) => (
          <li className="pt-10 text-2xl text-white" key={index}>
            <p>Sender: {message.SenderUsername}</p>
            <p>Content: {message.Content}</p>
            <p>Created At: {message.CreatedAt}</p>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Message"
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={() => {
          sendMesssage(currentMessage);
        }}
      >
        Send
      </button>
    </div>
  );
};

export default SpecificConversation;
