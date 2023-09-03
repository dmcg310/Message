import { useEffect } from "react";
import getConversations from "../api/getConversations";

const Messages = () => {
  useEffect(() => {
    const fetchConversations = async () => {
      const conversations = await getConversations("5");
      if (conversations) {
        console.log(conversations);
      } else {
        console.log("No conversations");
      }
    };

    fetchConversations();
  });
  return (
    <div>
      <h1>Messages</h1>
    </div>
  );
};

export default Messages;
