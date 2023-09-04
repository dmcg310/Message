import { useEffect, useState } from "react";
import getConversations from "../api/getConversations";
import { useNavigate } from "react-router-dom";

type Conversation = {
  conversation_id: number;
  other_username: string;
  lastMessage: string;
};

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);

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
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.conversation_id}>
            <button
              onClick={() =>
                navigate(`/messages/${conversation.conversation_id}/`)
              }
            >
              {conversation.other_username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
