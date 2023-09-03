import { API_URL } from "./config";

const getConversations = async (userId: string) => {
  const response = await fetch(`${API_URL}/messages/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "User-Id": userId,
    },
  });
  const data = await response.json();

  return data;
};

export default getConversations;
