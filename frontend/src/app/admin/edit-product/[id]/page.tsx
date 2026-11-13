"use client";

import { Suspense, useEffect, useState, FormEvent, ChangeEvent } from "react";import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/services/productService";

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
const colorHex = (n: string) => COLOR_PRESETS.find((c) => c.name === n)?.hex ?? "#999";

/* ---------- small reusable piece ---------- */

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

/* ---------- page ---------- */

const EditProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [imageError, setImageError] = useState("");
  const [preview, setPreview] = useState<string | null>(null); // new image only

  // form state (also drives the live preview card)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // Fetch product and fill the form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setName(data.name ?? "");
        setPrice(String(data.price ?? ""));
        setCategory(data.category ?? "");
        setGender(data.gender ?? "");
        setSizes(Array.isArray(data.sizes) ? data.sizes : []);
        setColors(Array.isArray(data.colors) ? data.colors : []);
      } catch (error) {
        setIsError(true);
        setMessage(error instanceof Error ? error.message : "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 5 MB or smaller");
      setPreview(null);
      e.target.value = "";
      return;
    }

    setImageError("");
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleColor = (c: string) =>
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  // Update product
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setUpdating(true);
      setMessage("");
      setIsError(false);

      await updateProduct(id, formData);

      setMessage("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Product update failed");
    } finally {
      setUpdating(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-100">
        <p className="text-sm text-neutral-600">{message || "Product not found."}</p>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Back to products
        </button>
      </div>
    );
  }

  // keep old values that are not in the presets, so they are not lost
  const categoryOptions = category && !CATEGORIES.includes(category) ? [...CATEGORIES, category] : CATEGORIES;
  const sizeOptions = [...SIZE_PRESETS, ...sizes.filter((s) => !SIZE_PRESETS.includes(s))];
  const colorOptions = [
    ...COLOR_PRESETS,
    ...colors
      .filter((c) => !COLOR_PRESETS.some((p) => p.name === c))
      .map((c) => ({ name: c, hex: "#999" })),
  ];

  const shownImage = preview ?? product.image;

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* top bar */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-neutral-900">Edit product</h1>
            <p className="text-sm text-neutral-500">
              The card on the left shows how it will look in your store.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 sm:block"
          >
            Back to products
          </button>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[380px_1fr]"
      >
        {/* ===== LEFT: live product card ===== */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
            <label
              htmlFor="image"
              className={`group relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden ${
                imageError ? "bg-red-50" : "bg-neutral-200"
              }`}
            >
              {shownImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shownImage} alt={name || "Product"} className="h-full w-full object-cover" />
              ) : (
                <div className="px-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-neutral-500 shadow-sm">
                    +
                  </div>
                  <p className="text-sm font-semibold text-neutral-800">Upload product photo</p>
                  <p className="mt-1 text-xs text-neutral-500">Up to 5 MB.</p>
                </div>
              )}

              {gender && (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 backdrop-blur">
                  {gender}
                </span>
              )}

              {preview && (
                <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                  New photo
                </span>
              )}

              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900/80 px-4 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                Change photo
              </span>
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />

            <div className="space-y-3 p-5">
              {imageError && <p className="text-xs font-medium text-red-600">{imageError}</p>}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">{category || "Category"}</p>
                  <h2
                    className={`truncate font-serif text-xl ${
                      name ? "text-neutral-900" : "text-neutral-300"
                    }`}
                  >
                    {name || "Product name"}
                  </h2>
                </div>
                <p className="shrink-0 text-lg font-semibold text-neutral-900">
                  {price ? `৳${Number(price).toLocaleString()}` : "৳0"}
                </p>
              </div>

              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {colors.length > 0 && (
                <div className="flex gap-1.5">
                  {colors.map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="h-4 w-4 rounded-full border border-black/20"
                      style={{ backgroundColor: colorHex(c) }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ===== RIGHT: form ===== */}
        <div className="space-y-6">
          {/* Details */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">Product details</h2>

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

              <Field label="Who is it for?">
                <div className="grid grid-cols-3 gap-2">
                  {GENDERS.map((g, i) => (
                    <label key={g} className="cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        required={i === 0}
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

              <Field label="Category">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {categoryOptions.map((c, i) => (
                    <label key={c} className="cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={c}
                        required={i === 0}
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

              <Field label="Description" htmlFor="description">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={product.description}
                  placeholder="Fabric, fit, care instructions..."
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          {/* Price & stock */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">Price and stock</h2>

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
                  defaultValue={product.stock}
                  required
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">Sizes and colors</h2>

            <div className="space-y-6">
              <Field label="Available sizes" hint="Tap to select. You can pick more than one.">
                <input type="hidden" name="sizes" value={sizes.join(", ")} />
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => {
                    const on = sizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleSize(s)}
                        className={`h-11 min-w-[3.25rem] rounded-lg border px-3 text-sm font-medium transition ${
                          on
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Available colors" hint="Tap to select. You can pick more than one.">
                <input type="hidden" name="colors" value={colors.join(", ")} />
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => {
                    const on = colors.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleColor(c.name)}
                        className={`flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition ${
                          on
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </section>

          {message && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || !!imageError}
              className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// export default EditProductForm;


const EditProductPage = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-500">Loading product...</p>
      </div>
    }
  >
    <EditProductForm />
  </Suspense>
);

export default EditProductPage;