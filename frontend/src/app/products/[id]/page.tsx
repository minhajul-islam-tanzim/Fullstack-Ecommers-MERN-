"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiX,
  FiHeart,
  FiShoppingBag,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

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

interface User {
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Fetch product and current user
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productRequest = axios.get(`${API_URL}/products/${id}`);

        const userRequest = axios
          .get(`${API_URL}/auth/me`, { withCredentials: true })
          .catch(() => null);

        const [productResponse, userResponse] = await Promise.all([
          productRequest,
          userRequest,
        ]);

        setProduct(productResponse.data.product);
        setActiveImageIndex(0);

        if (userResponse) {
          const user: User | undefined = userResponse.data.user;
          setIsAdmin(user?.role === "admin");
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E8]">
        <p className="text-lg text-[#292521]">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F5F0E8]">
        <p className="text-lg text-red-500">{error || "Product not found"}</p>

        <button
          onClick={() => router.back()}
          className="rounded-xl bg-[#292521] px-6 py-3 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 1 main image + max 3 additional images
  const allImages: ProductImage[] = [
    product.mainImage,
    ...(product.additionalImages || []).slice(0, 3),
  ];

  const previousImage = () => {
    setActiveImageIndex(
      (current) => (current - 1 + allImages.length) % allImages.length
    );
  };

  const nextImage = () => {
    setActiveImageIndex((current) => (current + 1) % allImages.length);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/products/${product._id}`, {
        withCredentials: true,
      });

      alert("Product deleted successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-8 md:px-10 lg:px-16">
      {/* Back button */}
      <div className="mx-auto mb-8 max-w-7xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#77716A] transition hover:text-[#292521]"
        >
          <FiArrowLeft />
          Back
        </button>
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: Image gallery */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Thumbnails */}
          <div className="order-2 flex gap-3 overflow-x-auto pb-2 sm:order-1 sm:w-24 sm:shrink-0 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:pb-0">
            {allImages.map((image, index) => (
              <button
                key={image.public_id || index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 sm:h-28 sm:w-full ${
                  activeImageIndex === index
                    ? "border-[#B58A62] opacity-100"
                    : "border-transparent opacity-60 hover:border-[#B58A62] hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white sm:order-2 sm:flex-1">
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              aria-label="Open product image"
              className="absolute inset-0 z-0 cursor-zoom-in"
            >
              <Image
                src={allImages[activeImageIndex].url}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              aria-label="Add to wishlist"
              className="absolute right-5 top-5 z-10 rounded-full bg-white p-3 text-[#292521] shadow-md transition hover:bg-[#B58A62] hover:text-white"
            >
              <FiHeart size={20} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-5 right-5 z-10 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
              {activeImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>

        {/* RIGHT: Product info */}
        <div className="flex flex-col justify-center py-4">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#B58A62]">
            {product.category}
          </p>

          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[#292521] md:text-5xl">
            {product.name}
          </h1>

          <p className="mb-6 text-2xl font-medium text-[#292521]">
            ৳ {product.price}
          </p>

          <div className="mb-6 h-px bg-[#D9D0C5]" />

          <p className="mb-8 leading-7 text-[#77716A]">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-[#292521]">Select Size</h3>
                <span className="text-sm text-[#77716A]">
                  {selectedSize || "Choose your size"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 rounded-lg border px-4 py-3 text-sm transition ${
                      selectedSize === size
                        ? "border-[#292521] bg-[#292521] text-white"
                        : "border-[#D9D0C5] text-[#292521] hover:border-[#B58A62]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-7">
              <h3 className="mb-3 font-semibold text-[#292521]">
                Available Colors
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                      selectedColor === color
                        ? "border-[#B58A62] bg-[#B58A62]/10 text-[#292521]"
                        : "border-[#D9D0C5] text-[#77716A]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p
            className={`mb-7 text-sm ${
              product.stock > 0 ? "text-green-700" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          {/* Add to cart */}
          <button
            type="button"
            disabled={
              product.stock <= 0 ||
              (product.sizes?.length > 0 && !selectedSize) ||
              (product.colors?.length > 0 && !selectedColor)
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#292521] px-6 py-4 font-medium text-white transition hover:bg-[#B58A62] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiShoppingBag size={20} />
            Add to Cart
          </button>

          {/* Admin controls */}
          {isAdmin && (
            <div className="mt-5 flex gap-3">
              <button
                onClick={() =>
                  router.push(`/admin/products/edit/${product._id}`)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D9D0C5] py-3 text-[#292521] transition hover:bg-white"
              >
                <FiEdit />
                Edit Product
              </button>

              <button
                onClick={handleDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-red-500 transition hover:bg-red-50"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen lightbox */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsImageOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            aria-label="Close image"
            className="absolute right-5 top-5 z-50 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <FiX size={25} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Previous image"
            className="absolute left-3 z-50 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30 md:left-8"
          >
            <FiArrowLeft size={25} />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={allImages[activeImageIndex].url}
              alt={product.name}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
            className="absolute right-3 z-50 rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30 md:right-8"
          >
            <FiArrowRight size={25} />
          </button>

          <p className="absolute bottom-5 text-sm text-white">
            {activeImageIndex + 1} / {allImages.length}
          </p>
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProductDetailsPage />
    </Suspense>
  );
}