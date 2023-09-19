import { API_URL } from "./config";

const getConversations = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/messages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
        "User-Id": userId,
      },
    });

    const contentType = response.headers.get("content-type");

    if (response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return { data: data };
      }
    } else {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return { error: errorData.error };
      } else {
        const errorData = await response.text();
        return { error: errorData };
      }
    }
  } catch (error) {
    return { error: error.message };
  }
};

export default getConversations;
