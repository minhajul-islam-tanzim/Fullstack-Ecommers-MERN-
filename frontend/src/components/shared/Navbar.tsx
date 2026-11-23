"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, Gift, ShoppingBag, ChevronDown, X, User } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";

import NavLink from "./ActiveNavLink";
import type { NavType } from "@/types/types";
import { getMe } from "@/services/authService";

import { usePathname } from "next/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

const links: NavType[] = [
  { label: "Home", href: "/" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Gifts", href: "/home-favourites" },
  { label: "Birthday Gifts", href: "/birthday-gift" },
  { label: "Home & Living", href: "/home-living" },
];

const categories: NavType[] = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
];

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const fly: Variants = {
  hidden: { opacity: 0, y: -28, scale: 0.9, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease },
  },
};

const iconProps = {
  whileHover: { scale: 1.2, y: -2 },
  whileTap: { scale: 0.88 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15 },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);
    setHidden(latest > prev && latest > 150 && !open);
  });

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease }}
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-gray-200/70 bg-white/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Scroll progress line */}
      <motion.span
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-orange-500"
      />

      <motion.div
        variants={group}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 md:flex-nowrap md:gap-4"
      >
        {/* Mobile toggle */}
        <motion.button
          variants={fly}
          whileTap={{ scale: 0.85 }}
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "chev"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {open ? <X size={20} /> : <ChevronDown size={20} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Logo */}
        <motion.div variants={fly}>
          <Link href="/" className="text-2xl font-bold sm:text-2xl">
            <span className="text-gray-500">A</span>
            <span className="text-gray-400">N</span>
            <span className="text-gray-300">Y</span>
            <span className="text-3xl font-bold">W</span>
            <span className="text-sky-300">A</span>
            <span className="text-sky-200">R</span>
            <span>E</span>
          </Link>
        </motion.div>

        {/* Categories dropdown */}
        <motion.div variants={fly} className="group relative hidden md:block">
          <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium hover:bg-gray-100">
            <ChevronDown
              size={16}
              className="transition-transform duration-300 group-hover:rotate-180"
            />
            Categories
          </button>

          <div className="invisible absolute left-0 top-full z-50 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <ul className="w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="block px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-100 hover:pl-6"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          variants={fly}
          className="order-last flex w-full items-center rounded-full border-2 border-black px-4 py-1 transition-shadow duration-300 focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.2)] md:order-0 md:w-auto md:flex-1"
        >
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full bg-transparent py-1 text-sm outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.12, rotate: 8 }}
            whileTap={{ scale: 0.88 }}
            className="rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600"
            aria-label="Search"
          >
            <Search size={16} />
          </motion.button>
        </motion.div>

        {/* Right part */}
        <motion.div
          variants={group}
          className="ml-auto flex items-center gap-3 sm:gap-4 md:ml-0"
        >
          <motion.span variants={fly} className="block">
            <motion.span {...iconProps} className="block cursor-pointer">
              <Heart size={20} />
            </motion.span>
          </motion.span>

          <motion.span variants={fly} className="hidden sm:block">
            <motion.span {...iconProps} className="block cursor-pointer">
              <Gift size={20} />
            </motion.span>
          </motion.span>

          <motion.span variants={fly} className="block">
            <motion.span {...iconProps} className="block cursor-pointer">
              <ShoppingBag size={20} />
            </motion.span>
          </motion.span>

          {user?.role === "admin" && (
            <motion.div variants={fly} className="hidden sm:block">
              <Link
                href="/admin/add-product"
                className="inline-block rounded-full bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
              >
                Add Product
              </Link>
            </motion.div>
          )}

          <motion.div variants={fly} className="hidden sm:block">
            {user ? (
              <Link
                href="/profile"
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-300 px-4 py-1 transition-all hover:bg-blue-200"
              >
                <span className="rounded-full bg-gray-100 p-2" aria-label="Profile">
                  <User size={20} />
                </span>
                <span className="text-xs font-semibold text-black">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-block rounded-full bg-orange-500 px-4 py-2 text-sm text-white transition-colors hover:bg-orange-600"
              >
                Sign in
              </Link>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Desktop nav links */}
      <motion.nav
        variants={group}
        initial="hidden"
        animate="show"
        className="hidden items-center justify-center gap-2 pb-2 md:flex md:gap-6"
      >
        {links.map((link) => (
          <motion.div key={link.href} variants={fly} whileHover={{ y: -2 }}>
            <NavLink link={link} />
          </motion.div>
        ))}
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden border-t border-gray-200 md:hidden"
          >
            <motion.div
              variants={group}
              initial="hidden"
              animate="show"
              className="flex flex-col px-4 py-2"
            >
              <motion.div variants={fly}>
                <Link href="#" className="block py-2 text-sm font-medium">
                  Categories
                </Link>
              </motion.div>

              {categories.map((c) => (
                <motion.div key={c.href} variants={fly}>
                  <Link
                    href={c.href}
                    className="block py-2 pl-4 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    {c.label}
                  </Link>
                </motion.div>
              ))}

              {links.map((l) => (
                <motion.div key={l.href} variants={fly}>
                  <Link href={l.href} className="block py-2 text-sm hover:bg-gray-50">
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={fly} className="py-2">
                {user ? (
                  <Link href="/profile" className="text-sm font-semibold">
                    {user.name}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-block rounded-full bg-orange-500 px-4 py-2 text-sm text-white"
                  >
                    Sign in
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}