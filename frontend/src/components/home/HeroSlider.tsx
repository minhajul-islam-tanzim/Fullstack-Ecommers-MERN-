"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { banners } from "@/data/banners";

const ease = [0.22, 1, 0.36, 1] as const;
const curtain = [0.76, 0, 0.24, 1] as const;
const DELAY = 9000;
const pad = (n: number) => String(n).padStart(2, "0");

const bgVariants = {
  enter: (d: number) => ({
    clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
  }),
  center: {
    clipPath: "inset(0 0 0 0%)",
    transition: { duration: 1.8, ease: curtain },
  },
  exit: { opacity: 0.4, transition: { duration: 1.8, ease: curtain } },
};

/* প্রতিটা item নিচ থেকে ওপরে উঠে আসে */
const riseProps = (delay: number) => ({
  initial: { opacity: 0, y: 70, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease, delay },
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: "blur(6px)",
    transition: { duration: 0.5, ease },
  },
});

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const n = banners.length;
  const current = banners[active];

  const go = (d: number) => {
    setDir(d);
    setActive((a) => (a + d + n) % n);
  };
  const goTo = (i: number) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  useEffect(() => {
    const t = setTimeout(() => go(1), DELAY);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const bgX = useTransform(sx, [-0.5, 0.5], [20, -20]);
  const bgY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const numX = useTransform(sx, [-0.5, 0.5], [-40, 40]);

  return (
    <motion.section
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPanEnd={(_, info) => {
        if (info.offset.x < -80) go(1);
        else if (info.offset.x > 80) go(-1);
      }}
      className="relative h-svh min-h-[40rem] overflow-hidden bg-black text-white"
    >
      {/* Background image */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-6">
        <AnimatePresence custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={bgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* ধীরে zoom-out (Ken Burns) */}
            <motion.div
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3, ease }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Shades */}
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/50" />

      {/* Giant outline number */}
      <motion.div
        aria-hidden
        style={{ x: numX }}
        className="font-(family-name:--font-playfair) pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none md:block"
      >
        <div className="overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={active}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 1.4, ease }}
              className="block text-[22rem] font-bold leading-[0.9] text-transparent [-webkit-text-stroke:1.5px_rgba(245,193,108,0.45)] xl:text-[30rem]"
            >
              {pad(active + 1)}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-5 py-8 md:px-10 md:py-10">
        {/* Top bar */}
        <div className="font-(family-name:--font-lato) flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-white/70">
          <motion.span
            {...riseProps(0.2)}
            className="flex items-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease, delay: 0.6 }}
              className="h-px w-10 origin-left bg-[#f5c16c]"
            />
            New Collection
          </motion.span>

          <motion.span {...riseProps(0.35)} className="flex items-center gap-1">
            <span className="relative inline-block h-4 w-5 overflow-hidden text-[#f5c16c]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={active}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease }}
                  className="absolute inset-0 leading-4"
                >
                  {pad(active + 1)}
                </motion.span>
              </AnimatePresence>
            </span>
            / {pad(n)}
          </motion.span>
        </div>

        {/* Title */}
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.h1
              key={active}
              className="font-(family-name:--font-playfair) text-5xl font-bold leading-[1.02] tracking-tight md:text-8xl"
            >
              {current.title.split(" ").map((w, i) => (
                <span
                  key={i}
                  className="mr-[0.22em] inline-block overflow-hidden pb-2 align-bottom"
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: "120%", rotate: 6, opacity: 0 }}
                    animate={{
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                      transition: { duration: 1.2, ease, delay: 0.5 + i * 0.12 },
                    }}
                    exit={{
                      y: "-120%",
                      rotate: -6,
                      opacity: 0,
                      transition: { duration: 0.6, ease, delay: i * 0.04 },
                    }}
                  >
                    {i % 2 === 1 ? <em className="text-[#f5c16c]">{w}</em> : w}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          {/* Description + CTA */}
          <div className="max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div key={active}>
                <motion.p
                  {...riseProps(0.9)}
                  className="font-(family-name:--font-lato) line-clamp-3 text-sm leading-7 text-white/70 md:text-base"
                >
                  {current.description}
                </motion.p>

                <motion.div {...riseProps(1.1)}>
                  <Link
                    href={current.buttonLink}
                    className="group font-(family-name:--font-lato) relative mt-7 inline-flex items-center gap-5 overflow-hidden rounded-full border border-white/30 py-2 pl-7 pr-2 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md transition-colors duration-700 hover:border-[#f5c16c]"
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#f5c16c] transition-transform duration-700 ease-out group-hover:scale-y-100" />
                    <span className="relative transition-colors duration-700 group-hover:text-black">
                      {current.buttonText}
                    </span>
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#f5c16c] text-black transition-all duration-700 group-hover:rotate-45 group-hover:bg-black group-hover:text-[#f5c16c]">
                      <FiArrowUpRight size={18} />
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails + arrows */}
          <div className="flex items-end gap-4">
            <div className="flex items-end gap-2.5">
              {banners.map((b, i) => (
                <motion.div
                  key={b.id ?? i}
                  initial={{ opacity: 0, y: 90, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.2, ease, delay: 1.2 + i * 0.12 }}
                >
                  <motion.button
                    layout
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    animate={{ width: active === i ? 120 : 56 }}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    className="relative block h-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/20"
                  >
                    <Image src={b.image} alt={b.title} fill sizes="120px" className="object-cover" />
                    <span
                      className={`absolute inset-0 bg-black transition-opacity duration-700 ${
                        active === i ? "opacity-0" : "opacity-60 hover:opacity-30"
                      }`}
                    />
                    <span className="font-(family-name:--font-lato) absolute left-2 top-1.5 text-[10px] font-semibold text-white/90">
                      {pad(i + 1)}
                    </span>
                    {active === i && (
                      <span className="absolute inset-x-0 bottom-0 h-0.75 bg-white/25">
                        <motion.span
                          key={active}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: DELAY / 1000, ease: "linear" }}
                          className="absolute inset-0 origin-left bg-[#f5c16c]"
                        />
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <div className="hidden flex-col gap-2 sm:flex">
              {[
                { label: "Previous slide", d: -1, icon: <FiArrowLeft /> },
                { label: "Next slide", d: 1, icon: <FiArrowRight /> },
              ].map((b, i) => (
                <motion.button
                  key={b.label}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease, delay: 1.6 + i * 0.12 }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => go(b.d)}
                  aria-label={b.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                >
                  {b.icon}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSlider;