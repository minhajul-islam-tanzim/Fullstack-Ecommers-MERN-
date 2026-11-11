"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiMinus,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTruck,
  FiRefreshCcw,
} from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { deleteProduct, getProductById } from "@/services/productService";
import { getMe } from "@/services/authService";

interface Product {
  _id: string;
  name: string;
  gender: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Skeleton = () => (
  <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 py-10 md:grid-cols-2 md:gap-14 md:px-8 md:py-14">
    <div className="aspect-4/5 rounded-3xl bg-[#EEF3F5]" />
    <div className="space-y-5 py-4">
      <div className="h-4 w-32 rounded bg-[#EEF3F5]" />
      <div className="h-12 w-3/4 rounded bg-[#EEF3F5]" />
      <div className="h-8 w-28 rounded bg-[#EEF3F5]" />
      <div className="h-24 w-full rounded bg-[#EEF3F5]" />
      <div className="h-12 w-full rounded-full bg-[#EEF3F5]" />
    </div>
  </div>
);

const Message = ({ text }: { text: string }) => (
  <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
    <p className="font-(family-name:--font-playfair) text-3xl font-bold text-[#292521] md:text-4xl">
      {text}
    </p>
    <Link
      href="/"
      className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#292521] py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors hover:bg-black"
    >
      Back to home
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 transition-transform group-hover:rotate-45">
        <FiArrowUpRight size={18} />
      </span>
    </Link>
  </div>
);

const ProductDetailsContent = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [productData, userData] = await Promise.all([
          getProductById(id),
          getMe().catch(() => null),
        ]);

        setProduct(productData.product ?? productData);

        const user = userData.user;

        setIsAdmin(user.role === "admin");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

const handleDelete = async () => {
  try {
    await deleteProduct(id);

    alert("Product deleted successfully");

    router.push("/");

  } catch (error) {
    alert(error instanceof Error ? error.message : "Delete failed");
  }
};

  if (loading) return <Skeleton />;
  if (error) return <Message text={error} />;
  if (!product) return <Message text="Product not found" />;

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="font-(family-name:--font-lato) inline-flex items-center gap-2 text-sm text-[#292521]/70 transition-colors hover:text-orange-500"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
        {/* Image */}
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-[#EEF3F5] md:sticky md:top-6 md:self-start">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />

          <button
            onClick={() => setLiked(!liked)}
            aria-label="Add to wishlist"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#292521] backdrop-blur-md transition-transform hover:scale-110"
          >
            {liked ? (
              <FaHeart size={17} className="text-orange-500" />
            ) : (
              <FaRegHeart size={17} />
            )}
          </button>
        </div>

        {/* Details */}
        <div className="py-2">
          {/* Tags */}
          <div className="font-(family-name:--font-lato) flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[#EEF3F5] px-3 py-1 font-medium text-[#292521]">
              {product.gender}
            </span>
            <span className="rounded-full bg-[#EEF3F5] px-3 py-1 font-medium text-[#292521]">
              {product.category}
            </span>
          </div>

          <h1 className="font-(family-name:--font-playfair) mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-[#292521] md:text-5xl">
            {product.name}
          </h1>

          <p className="font-(family-name:--font-playfair) mt-4 text-3xl font-semibold text-orange-500">
            ৳ {product.price}
          </p>

          <p className="font-(family-name:--font-lato) mt-5 max-w-xl text-base leading-7 text-[#292521]/75">
            {product.description}
          </p>

          <div className="my-7 h-px w-full bg-[#292521]/15" />

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <p className="font-(family-name:--font-lato) text-sm font-medium text-[#292521]">
                Size
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`font-(family-name:--font-lato) min-w-12 rounded-full border px-4 py-2 text-sm transition-colors ${
                      size === s
                        ? "border-[#292521] bg-[#292521] text-white"
                        : "border-[#292521]/30 text-[#292521] hover:border-[#292521]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="font-(family-name:--font-lato) text-sm font-medium text-[#292521]">
                Color
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`font-(family-name:--font-lato) rounded-full border px-4 py-2 text-sm transition-colors ${
                      color === c
                        ? "border-[#292521] bg-[#292521] text-white"
                        : "border-[#292521]/30 text-[#292521] hover:border-[#292521]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + stock */}
          <div className="mt-6 flex items-center gap-5">
            <div className="flex items-center gap-1 rounded-full border border-[#292521]/30 p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                aria-label="Decrease"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#292521] transition-colors hover:bg-[#EEF3F5] disabled:opacity-30"
              >
                <FiMinus size={16} />
              </button>
              <span className="font-(family-name:--font-lato) w-8 text-center text-sm font-medium tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
                aria-label="Increase"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#292521] transition-colors hover:bg-[#EEF3F5] disabled:opacity-30"
              >
                <FiPlus size={16} />
              </button>
            </div>

            <p
              className={`font-(family-name:--font-lato) flex items-center gap-2 text-sm ${
                inStock ? "text-[#292521]/70" : "text-red-500"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </p>
          </div>

          {/* Add to cart */}
          <button
            disabled={!inStock}
            className="group mt-8 inline-flex w-full items-center justify-between rounded-full bg-[#292521] py-2 pl-7 pr-2 text-base font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-80"
          >
            {inStock ? "Add to cart" : "Out of stock"}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 transition-transform group-hover:rotate-45 group-disabled:rotate-0">
              <FiArrowUpRight size={20} />
            </span>
          </button>

          {/* Perks */}
          <div className="font-(family-name:--font-lato) mt-8 grid gap-3 text-sm text-[#292521]/70 sm:grid-cols-2">
            <p className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <FiTruck size={16} />
              </span>
              Free delivery over $50
            </p>
            <p className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <FiRefreshCcw size={16} />
              </span>
              30 days easy returns
            </p>
          </div>

          {/* Admin */}
          {isAdmin && (
            <div className="mt-10 rounded-2xl border border-dashed border-[#292521]/25 bg-[#EEF3F5] p-4">
              <p className="font-(family-name:--font-lato) text-xs text-[#292521]/60">
                Admin controls
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => router.push(`/admin/products/edit/${id}`)}
                  className="font-(family-name:--font-lato) inline-flex items-center gap-2 rounded-full border border-[#292521] px-5 py-2 text-sm font-medium text-[#292521] transition-colors hover:bg-[#292521] hover:text-white"
                >
                  <FiEdit2 size={15} />
                  Edit product
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="font-(family-name:--font-lato) inline-flex items-center gap-2 rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  <FiTrash2 size={15} />
                  {deleting ? "Deleting..." : "Delete product"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <ProductDetailsContent />
    </Suspense>
  );
};

export default ProductDetailsPage;
