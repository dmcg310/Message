import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Message = {
  SenderUsername: string;
  Content: string;
  CreatedAt: string;
};

const SpecificConversation = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleWSMessage = (eventData: string) => {
    const data = JSON.parse(eventData);

    if (data.Messages) {
      setMessages(data.Messages);
    } else {
      console.log("No messages"); // TODO: display properly
    }
  };

  const initWS = () => {
    const socket = new WebSocket(
      `ws://localhost:8080/messages/${conversationId}/`
    );

    socket.addEventListener("message", (event) => {
      handleWSMessage(event.data);
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
          <li key={index}>
            <p>Sender: {message.SenderUsername}</p>
            <p>Content: {message.Content}</p>
            <p>Created At: {message.CreatedAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecificConversation;
