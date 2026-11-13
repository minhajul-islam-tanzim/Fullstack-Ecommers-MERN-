
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductById,
  updateProduct,
} from "@/services/productService";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Product not found"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update product
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setUpdating(true);

      await updateProduct(id, formData);

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Product update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label>Gender</label>
          <input
            type="text"
            name="gender"
            defaultValue={product.gender}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            defaultValue={product.category}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            defaultValue={product.description}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            defaultValue={product.price}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            defaultValue={product.stock}
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label>Sizes</label>
          <input
            type="text"
            name="sizes"
            defaultValue={product.sizes?.join(", ")}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label>Colors</label>
          <input
            type="text"
            name="colors"
            defaultValue={product.colors?.join(", ")}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label>Current Image</label>
          <img
            src={product.image}
            alt={product.name}
            className="w-32 h-32 object-cover my-2"
          />
        </div>

        <div>
          <label>Choose New Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Product"}
        </button>

      </form>
    </div>
  );
};

export default EditProductPage;
