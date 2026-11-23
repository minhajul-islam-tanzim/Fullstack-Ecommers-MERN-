"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const categories = [
  { name: "Women", image: "/images/women.jpg", link: "/categories/women", count: "320+ products", tag: "Up to 40% off" },
  { name: "Men", image: "/images/men.jpg", link: "/categories/men", count: "240+ products", tag: "New arrivals" },
  { name: "Kids", image: "/images/kids.jpg", link: "/categories/kids", count: "180+ products", tag: "Flat 25% off" },
];

const ShopByCategory = () => {
  return (
    <section className="bg-[#faf8f4] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-xl text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="font-(family-name:--font-lato) text-xs font-semibold uppercase tracking-[0.35em] text-orange-600"
          >
            Shop by category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: 0.1 }}
            className="font-(family-name:--font-playfair) mt-3 text-4xl font-bold text-neutral-900 md:text-5xl"
          >
            Find something you'll love
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.25 }}
            className="font-(family-name:--font-lato) mt-3 text-sm text-neutral-500 md:text-base"
          >
            Fresh styles for everyone, picked with care.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease, delay: i * 0.15 }}
            >
              <Link href={c.link} className="group block">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />

                  {/* Tag */}
                  <span className="font-(family-name:--font-lato) absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 backdrop-blur-md">
                    {c.tag}
                  </span>

                  {/* Hover arrow */}
                  <span className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-white text-neutral-900 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <FiArrowUpRight size={22} />
                  </span>
                </div>

                {/* Info */}
                <div className="mt-5 flex items-end justify-between px-1">
                  <div>
                    <h3 className="font-(family-name:--font-playfair) text-2xl font-bold text-neutral-900 md:text-3xl">
                      {c.name}
                    </h3>
                    <p className="font-(family-name:--font-lato) mt-1 text-sm text-neutral-500">
                      {c.count}
                    </p>
                  </div>

                  <span className="font-(family-name:--font-lato) relative pb-1 text-sm font-semibold text-neutral-900">
                    Shop now
                    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-30 bg-neutral-900 transition-transform duration-500 group-hover:scale-x-100" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;