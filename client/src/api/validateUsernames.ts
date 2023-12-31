import { API_URL } from "./config";

const checkUsername = async (username: string) => {
  try {
    const response = await fetch(`${API_URL}/valid-username/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(username),
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

export default checkUsername;
