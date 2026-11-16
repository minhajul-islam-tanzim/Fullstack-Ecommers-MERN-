
"use client";

import { Suspense, useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductById, updateProduct } from "@/services/productService";

interface ProductImage {
  url: string;
  public_id: string;
}

interface Product {
  _id: string;
  name: string;
  gender: string;
  description: string;
  price: number;
  category: string;
  mainImage: ProductImage;
  additionalImages: ProductImage[];
  sizes: string[];
  colors: string[];
  stock: number;
}

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women", "Kids"];
const CATEGORIES = ["T-shirt", "Shirt", "Pant", "Shoes", "Top"];
const COLOR_PRESETS = ["White", "Red", "Blue", "Black", "Yellow", "Green"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setName(data.name || "");
        setPrice(String(data.price ?? ""));
        setCategory(data.category || "");
        setGender(data.gender || "");
        setDescription(data.description || "");
        setStock(String(data.stock ?? 0));
        setSizes(data.sizes || []);
        setColors(data.colors || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Main image change
  const handleMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Main image must be 5 MB or smaller");
      e.target.value = "";
      return;
    }

    setError("");
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  // Additional images change
  const handleAdditionalImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 3) {
      setError("Maximum 3 additional images allowed");
      e.target.value = "";
      return;
    }

    if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
      setError("Each image must be 5 MB or smaller");
      e.target.value = "";
      return;
    }

    setError("");
    setAdditionalImages(files);
    setAdditionalPreviews(
      files.map((file) => URL.createObjectURL(file))
    );
  };

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  // Update product
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!product) return;

  const formData = new FormData(e.currentTarget);

  try {
    setUpdating(true);
    setError("");
    setMessage("");

    await updateProduct(id, formData);

    setMessage("Product updated successfully!");

    router.push("/");
    router.refresh();

  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Product update failed"
    );
  } finally {
    setUpdating(false);
  }
};

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E8]">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F0E8]">
        <p>{error || "Product not found"}</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  const shownImage = mainPreview || product.mainImage?.url;

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#292521]">
              Edit Product
            </h1>
            <p className="text-sm text-[#77716A]">
              Update your product information
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-lg border px-4 py-2"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">

          {/* Image section */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Product Images</h2>

            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100">
              {shownImage && (
                <Image
                  src={shownImage}
                  alt={name}
                  fill
                  unoptimized={mainPreview !== ""}
                  className="object-cover"
                />
              )}
            </div>

            <label className="mt-4 block text-sm font-medium">
              Main Image
            </label>

            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleMainImage}
              className="mt-2 w-full text-sm"
            />

            <p className="mt-4 text-sm font-medium">
              Additional Images (Maximum 3)
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {product.additionalImages?.map((image) => (
                <div key={image.public_id} className="relative h-20 w-20">
                  <Image
                    src={image.url}
                    alt={name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}

              {additionalPreviews.map((src, index) => (
                <div key={index} className="relative h-20 w-20">
                  <Image
                    src={src}
                    alt={`New image ${index + 1}`}
                    fill
                    unoptimized
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImages}
              className="mt-3 w-full text-sm"
            />

            <p className="mt-2 text-xs text-neutral-500">
              Selecting new additional images replaces the existing set.
              Leave empty to keep existing images.
            </p>
          </section>

          {/* Details section */}
          <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Product Details</h2>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Price</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                {GENDERS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                {[...new Set([...CATEGORIES, category])].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Stock</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Sizes */}
            <div>
              <p className="mb-2 text-sm font-medium">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...SIZE_PRESETS, ...sizes])].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`rounded-lg border px-4 py-2 ${
                      sizes.includes(size)
                        ? "bg-[#292521] text-white"
                        : "bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <p className="mb-2 text-sm font-medium">Colors</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...COLOR_PRESETS, ...colors])].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={`rounded-lg border px-4 py-2 ${
                      colors.includes(color)
                        ? "bg-[#292521] text-white"
                        : "bg-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-lg border px-5 py-3"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="flex-1 rounded-lg bg-[#292521] px-5 py-3 text-white disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Product"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <EditProductForm />
    </Suspense>
  );
}
