const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;



export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await fetch(`${BASE_URL}/singUp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

