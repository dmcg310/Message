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

    const contentType = response.headers.get("content-type");

    if (response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return { token: data.token };
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
    // @ts-ignore
    return { error: error.message };
  }
};

export default signUp;
