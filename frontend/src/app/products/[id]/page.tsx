"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/productService";

const ProductDetailsContent = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return <div>{product.name}</div>;
};

const ProductDetailsPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductDetailsContent />
    </Suspense>
  );
};

export default ProductDetailsPage;