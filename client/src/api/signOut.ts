import { API_URL } from "./config";

const signOut = async () => {
  try {
    const response = await fetch(`${API_URL}/sign-out/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
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

export default signOut;
