import { API_URL } from "./config";

const checkConversation = async (conversationId: string) => {
  try {
    const response = await fetch(`${API_URL}/valid-conversation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversationId),
    });

    if (response.ok) {
      const data = await response.json();
      return data.isValid;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default checkConversation;
