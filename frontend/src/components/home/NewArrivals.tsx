"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { getAllProducts } from "@/services/productService";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products.slice(0, 8));
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);

    const card = el.firstElementChild as HTMLElement | null;
    if (card) {
      const step = card.offsetWidth + 16;
      setCurrent(Math.round(el.scrollLeft / step) + 1);
    }
  };

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const atStart = progress <= 0.01;
  const atEnd = progress >= 0.99;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      {/* Heading */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-(family-name:--font-playfair) text-4xl font-bold leading-tight tracking-tight text-[#292521] md:text-5xl">
            New arrivals
          </h2>
          <p className="font-(family-name:--font-lato) mt-2 text-sm text-[#292521]/70 md:text-base">
            Discover our latest fashion collection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#292521]/30 text-[#292521] transition-colors hover:bg-[#292521] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <FiArrowLeft size={18} />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#292521]/30 text-[#292521] transition-colors hover:bg-[#292521] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="mt-8 flex gap-4 overflow-hidden md:mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[70%] shrink-0 animate-pulse sm:w-[40%] md:w-[28%] lg:w-[23.5%]"
            >
              <div className="aspect-4/5 rounded-2xl bg-[#EEF3F5]" />
              <div className="mt-4 h-4 w-3/4 rounded bg-[#EEF3F5]" />
              <div className="mt-2 h-4 w-1/3 rounded bg-[#EEF3F5]" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-14 text-center text-[#292521]/60">
          No products available.
        </p>
      ) : (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:mt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => {
              const isLiked = liked.includes(product._id);

              return (
                <div
                  key={product._id}
                  className="group w-[70%] shrink-0 snap-start sm:w-[40%] md:w-[28%] lg:w-[23.5%]"
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-[#EEF3F5]">
                    <Link
                      href={`/products/${product._id}`}
                      className="absolute inset-0"
                      aria-label={product.name}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* New tag */}
                    <span className="font-(family-name:--font-lato) pointer-events-none absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                      New
                    </span>

                    {/* Heart */}
                    <button
                      onClick={() => toggleLike(product._id)}
                      aria-label="Add to wishlist"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#292521] backdrop-blur-md transition-transform hover:scale-110"
                    >
                      {isLiked ? (
                        <FaHeart size={15} className="text-orange-500" />
                      ) : (
                        <FaRegHeart size={15} />
                      )}
                    </button>

                    {/* Slide-up button */}
                    <Link
                      href={`/products/${product._id}`}
                      className="font-(family-name:--font-lato) absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-between rounded-full bg-white/90 py-1.5 pl-5 pr-1.5 text-sm font-medium text-[#292521] opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      View details
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                        <FiArrowUpRight size={16} />
                      </span>
                    </Link>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-3">
                    <h3 className="font-(family-name:--font-playfair) text-base font-semibold leading-snug text-[#292521] md:text-lg">
                      {product.name}
                    </h3>
                    <p className="font-(family-name:--font-lato) shrink-0 pt-0.5 text-sm font-medium text-[#292521]/80 md:text-base">
                      ৳ {product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom: counter + progress + view all */}
          <div className="mt-6 flex items-center gap-4 md:gap-6">
            <p className="font-(family-name:--font-playfair) text-lg tabular-nums text-[#292521]">
              {pad(Math.min(current, products.length))}
              <span className="text-[#292521]/40">
                {" "}
                / {pad(products.length)}
              </span>
            </p>

            <div className="h-0.5 flex-1 overflow-hidden bg-[#292521]/15">
              <div
                className="h-full bg-[#292521] transition-all duration-200"
                style={{ width: `${25 + progress * 75}%` }}
              />
            </div>

            <Link
              href="/new-arrivals"
              className="font-(family-name:--font-lato) group/all inline-flex shrink-0 items-center gap-2 rounded-full bg-[#292521] py-1.5 pl-5 pr-1.5 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              View all
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 transition-transform group-hover/all:rotate-45">
                <FiArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default NewArrivals;