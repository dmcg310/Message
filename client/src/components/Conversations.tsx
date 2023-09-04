import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import saveMessage from "../api/sendMessage";

type Message = {
  SenderUsername: string;
  Content: string;
  CreatedAt: string;
};

// TODO: clear input on submit

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SpecificConversation;
