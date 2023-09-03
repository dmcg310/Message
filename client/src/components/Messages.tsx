import { useEffect, useState } from "react";
import getConversations from "../api/getConversations";

const Messages = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const conversations = await getConversations("5"); // TODO: get actual user id
    if (conversations) {
      setConversations(conversations);
    }
  };

  return (
    <div>
      <h1>Conversations</h1>
      {conversations.map((conversation: string) => (
        <div key={conversation}>
          <h2>{conversation}</h2>
        </div>
      ))}
    </div>
  );
};

export default Messages;
