
"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import type { ReactNode } from "react";
import { createProduct } from "@/services/productService";
import { useRouter } from "next/navigation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];

const GENDERS = ["Men", "Women", "Kids"];

const CATEGORIES = ["T-shirt", "Shirt", "Pant", "Shoes", "Top"];

const COLOR_PRESETS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Black", hex: "#171717" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Green", hex: "#16A34A" },
];

const colorHex = (name: string) =>
  COLOR_PRESETS.find((color) => color.name === name)?.hex ?? "#999";

// Reusable form field component
function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-neutral-800"
      >
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

// Main page
export default function AddProductPage() {
  const router = useRouter();

  // Form states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Main image states
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  // Additional image states
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [additionalImageError, setAdditionalImageError] = useState("");

  // Product information states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // Main image preview URL cleanup
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Additional image preview URL cleanup
  useEffect(() => {
    return () => {
      additionalPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [additionalPreviews]);

  // Main image selection handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Check image size
    if (file && file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 5 MB or smaller");
      setPreview(null);
      e.target.value = "";
      return;
    }

    setImageError("");

    // Create image preview
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Additional images selection handler
  const handleAdditionalImagesChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    // Maximum 3 additional images
    if (files.length > 3) {
      setAdditionalImageError("Maximum 3 additional images allowed");
      setAdditionalPreviews([]);
      e.target.value = "";
      return;
    }

    // Check each image size
    const hasLargeFile = files.some(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (hasLargeFile) {
      setAdditionalImageError(
        "Each image must be 5 MB or smaller"
      );
      setAdditionalPreviews([]);
      e.target.value = "";
      return;
    }

    setAdditionalImageError("");

    // Create previews for selected images
    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setAdditionalPreviews(previews);
  };

  // Toggle product sizes
  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  // Toggle product colors
  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  // Submit product form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Collect all form fields and selected files
    const formData = new FormData(form);

    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      await createProduct(formData);

      setMessage("Product created successfully!");

      // Reset form
      form.reset();

      setPreview(null);
      setImageError("");

      setAdditionalPreviews([]);
      setAdditionalImageError("");

      setName("");
      setPrice("");
      setCategory("");
      setGender("");
      setSizes([]);
      setColors([]);

      router.push("/");
    } catch (error) {
      setIsError(true);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Common input styling
  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15";

  return (
    <div className="min-h-screen bg-neutral-100">

      {/* Top bar */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-neutral-900">
              Add a new product
            </h1>

            <p className="text-sm text-neutral-500">
              The card on the left shows how it will look in your store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 sm:block"
          >
            Back to store
          </button>
        </div>
      </header>

      {/* Main form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[380px_1fr]"
      >

        {/* LEFT: Live product preview */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">

            {/* Main image preview */}
            <label
              htmlFor="mainImage"
              className={`group relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden ${
                imageError ? "bg-red-50" : "bg-neutral-200"
              }`}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="px-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-neutral-500 shadow-sm">
                    +
                  </div>

                  <p className="text-sm font-semibold text-neutral-800">
                    Upload product photo
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Up to 5 MB. Portrait photos look best.
                  </p>
                </div>
              )}

              {gender && (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 backdrop-blur">
                  {gender}
                </span>
              )}

              {preview && (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900/80 px-4 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                  Change photo
                </span>
              )}
            </label>

            {/* Main image input */}
            <input
              id="mainImage"
              name="mainImage"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="sr-only"
            />

            {/* Main image error */}
            {imageError && (
              <p className="px-5 pt-3 text-xs font-medium text-red-600">
                {imageError}
              </p>
            )}

            {/* Additional image selection */}
            <div className="space-y-3 p-5">
              <label
                htmlFor="additionalImages"
                className="block cursor-pointer rounded-lg border border-dashed border-neutral-400 p-4 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                + Add additional images
                <span className="mt-1 block text-xs font-normal text-neutral-500">
                  Maximum 3 images · 5 MB each
                </span>
              </label>

              <input
                id="additionalImages"
                name="additionalImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="sr-only"
              />

              {/* Additional image error */}
              {additionalImageError && (
                <p className="text-xs font-medium text-red-600">
                  {additionalImageError}
                </p>
              )}

              {/* Additional image previews */}
              {additionalPreviews.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {additionalPreviews.map((image, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={image}
                      src={image}
                      alt={`Additional image ${index + 1}`}
                      className="h-20 w-20 rounded-lg border border-neutral-200 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product information preview */}
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">
                    {category || "Category"}
                  </p>

                  <h2
                    className={`truncate font-serif text-xl ${
                      name ? "text-neutral-900" : "text-neutral-300"
                    }`}
                  >
                    {name || "Product name"}
                  </h2>
                </div>

                <p className="shrink-0 text-lg font-semibold text-neutral-900">
                  {price
                    ? `৳${Number(price).toLocaleString()}`
                    : "৳0"}
                </p>
              </div>

              {/* Selected sizes */}
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}

              {/* Selected colors */}
              {colors.length > 0 && (
                <div className="flex gap-1.5">
                  {colors.map((color) => (
                    <span
                      key={color}
                      title={color}
                      className="h-4 w-4 rounded-full border border-black/20"
                      style={{
                        backgroundColor: colorHex(color),
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT: Product form */}
        <div className="space-y-6">

          {/* Product details */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              Product details
            </h2>

            <div className="space-y-6">

              <Field label="Product name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oversized cotton shirt"
                  className={inputClass}
                />
              </Field>

              {/* Gender */}
              <Field label="Who is it for?">
                <div className="grid grid-cols-3 gap-2">
                  {GENDERS.map((g, index) => (
                    <label key={g} className="cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        required={index === 0}
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="peer sr-only"
                      />

                      <span className="block rounded-lg border border-neutral-300 py-3 text-center text-sm font-medium text-neutral-700 transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-600/25">
                        {g}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Category */}
              <Field label="Category">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {CATEGORIES.map((c, index) => (
                    <label key={c} className="cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={c}
                        required={index === 0}
                        checked={category === c}
                        onChange={() => setCategory(c)}
                        className="peer sr-only"
                      />

                      <span className="block rounded-lg border border-neutral-300 py-3 text-center text-sm font-medium text-neutral-700 transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-600/25">
                        {c}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Description */}
              <Field label="Description" htmlFor="description">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  placeholder="Fabric, fit, care instructions..."
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          {/* Price and stock */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              Price and stock
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">

              <Field label="Price" htmlFor="price">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    ৳
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Items in stock" htmlFor="stock">
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue="0"
                  required
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* Sizes and colors */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              Sizes and colors
            </h2>

            <div className="space-y-6">

              {/* Sizes */}
              <Field
                label="Available sizes"
                hint="Tap to select. You can pick more than one."
              >
                <input
                  type="hidden"
                  name="sizes"
                  value={sizes.join(", ")}
                />

                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map((size) => {
                    const isSelected = sizes.includes(size);

                    return (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleSize(size)}
                        className={`h-11 min-w-[3.25rem] rounded-lg border px-3 text-sm font-medium transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Colors */}
              <Field
                label="Available colors"
                hint="Tap to select. You can pick more than one."
              >
                <input
                  type="hidden"
                  name="colors"
                  value={colors.join(", ")}
                />

                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((color) => {
                    const isSelected = colors.includes(color.name);

                    return (
                      <button
                        key={color.name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleColor(color.name)}
                        className={`flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        />

                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </section>

          {/* Success or error message */}
          {message && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {message}
            </p>
          )}

          {/* Form buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !!imageError ||
                !!additionalImageError
              }
              className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving product..." : "Add product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
