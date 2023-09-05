import { API_URL } from "./config";

const getConversations = async (userId: string) => {
  try {
    console.log(userId);
    const response = await fetch(`${API_URL}/messages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
        "User-Id": userId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getConversations;
