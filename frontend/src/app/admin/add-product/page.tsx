
"use client";

import { useState, FormEvent } from "react";
import { createProduct } from "@/services/productService";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setLoading(true);
      setMessage("");

      await createProduct(formData);

      setMessage("Product created successfully!");
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">

        <h1 className="text-3xl font-bold text-gray-900">
          Add New Product
        </h1>
        <p className="mb-8 mt-2 text-sm text-gray-500">
          Add a new fashion product to your store.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block font-medium">Product Name</label>
            <input name="name" type="text" required
              placeholder="Enter product name"
              className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block font-medium">Gender</label>
            <select name="gender" required className={inputClass}>
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Description</label>
            <textarea name="description" rows={4} required
              placeholder="Product description"
              className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Price</label>
              <input name="price" type="number" min="0" required
                placeholder="Enter price"
                className={inputClass} />
            </div>

            <div>
              <label className="mb-2 block font-medium">Category</label>
              <input name="category" type="text" required
                placeholder="e.g. T-shirt"
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Product Image</label>
            <input name="image" type="file" accept="image/*"
              required className={inputClass} />
            <p className="mt-1 text-xs text-gray-500">
              Maximum image size: 5 MB
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Sizes</label>
              <input name="sizes" type="text"
                placeholder="S, M, L, XL"
                className={inputClass} />
            </div>

            <div>
              <label className="mb-2 block font-medium">Colors</label>
              <input name="colors" type="text"
                placeholder="Black, White, Blue"
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Stock</label>
            <input name="stock" type="number" min="0"
              defaultValue="0" required
              className={inputClass} />
          </div>

          {message && (
            <p className="rounded-lg bg-gray-100 p-3 text-sm">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50">
            {loading ? "Creating Product..." : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  );
}
