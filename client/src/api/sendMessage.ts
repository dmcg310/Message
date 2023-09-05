import { API_URL } from "./config";

const saveMessage = async (
  conversationId: number,
  content: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/messages/${conversationId}/save/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content,
        }),
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default saveMessage;
