import { API_URL } from "./config";

const getConversations = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/messages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id": userId,
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getConversations;
