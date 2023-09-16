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

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default updateUsername;
