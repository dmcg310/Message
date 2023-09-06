import { API_URL } from "./config";

const getAccountDetails = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/account/`, {
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

export default getAccountDetails;
