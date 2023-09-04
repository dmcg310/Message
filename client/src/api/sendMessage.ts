import { API_URL } from "./config";

const saveMessage = async (
  userId: number,
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
          "User-Id": userId.toString(),
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
