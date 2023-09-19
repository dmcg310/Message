import { API_URL } from "./config";

const updateUsername = async (newUsername: string, userId: number) => {
  try {
    const response = await fetch(`${API_URL}/new-username/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ newUsername, userId }),
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

export default updateUsername;
