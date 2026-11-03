const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

export const updateUserName = async (name: string) => {
  const response = await fetch(`${BASE_URL}/name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data

};
