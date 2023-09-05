import { API_URL } from "./config";

type FormData = {
  username: string;
  email: string;
  password: string;
};

const signUp = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/create-account/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default signUp;