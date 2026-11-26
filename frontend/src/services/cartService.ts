import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addToCart = async (
  productId: string,
  quantity: number,
  size: string,
  color: string,
) => {
  const res = await axios.post(`${API_URL}/cart`, {
    productId,
    quantity,
    size,
    color,
  },{
    withCredentials: true,
  }
);

return res.data;

};
