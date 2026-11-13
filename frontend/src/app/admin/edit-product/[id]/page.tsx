"use client";

import { getProductById } from "@/services/productService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data)



      } catch (err) {


      }
    };

    fetchProduct()
  }, [id]);

  return (
    <div>
      <h1>Edit Product</h1>
      <p>Product ID: {id}</p>
    </div>
  );
};

export default EditProductPage;
