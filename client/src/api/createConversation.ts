import { API_URL } from "./config";

const createConversation = async (otherUsername: string) => {
  try {
    const response = await fetch(`${API_URL}/conversations/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(otherUsername),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default createConversation;
