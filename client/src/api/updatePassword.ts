import { API_URL } from "./config";

const updatePassword = async (
  oldPassword: string,
  newPassword: string,
  userId: number
) => {
  try {
    const response = await fetch(`${API_URL}/new-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ oldPassword, newPassword, userId }),
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

export default updatePassword;
