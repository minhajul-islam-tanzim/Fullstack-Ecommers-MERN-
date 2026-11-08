"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, Gift, ShoppingBag, ChevronDown, X, User } from "lucide-react";

import NavLink from "./ActiveNavLink";
import type { NavType } from "@/types/types";
import { getMe } from "@/services/authService";

import { usePathname } from "next/navigation";

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

export default function Navbar() {
  const [open, setOpen] = useState(false);
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

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 md:flex-nowrap md:gap-4">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <ChevronDown size={20} />}
        </button>

        <Link
          href="/"
          className="text-2xl font-bold sm:text-2xl"
        >
          <span className="text-gray-500">A</span><span className="text-gray-400">N</span><span className="text-gray-300">Y</span>W<span className="text-sky-300">A</span><span className="text-sky-200">R</span><span>E</span>
        </Link>

        <div className="group relative hidden md:block">
          <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium hover:bg-gray-100">
            <ChevronDown size={16} /> Categories
          </button>

          <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <ul className="w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="order-last flex w-full items-center rounded-full border-2 border-black px-4 py-1 md:order-0 md:w-auto md:flex-1">
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full bg-transparent py-1 text-sm outline-none"
          />
          <button className="rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600">
            <Search size={16} />
          </button>
        </div>

        {/* Right part  */}
        <div className="ml-auto flex items-center gap-3 sm:gap-4 md:ml-0">
          <Heart size={20} className="cursor-pointer" />
          <Gift size={20} className="hidden cursor-pointer sm:block" />
          <ShoppingBag size={20} className="cursor-pointer" />
          {user?.role === "admin" && (
            <Link
              href="/admin/add-product"
              className="hidden rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 sm:inline-block"
            >
              Add Product
            </Link>
          )}

          {user ? (
            <Link
              href="/profile"
              className="hidden items-center gap-3 sm:flex bg-blue-300 py-1 px-4 rounded-2xl hover:bg-blue-200 cursor-pointer transition-all"
            >
              <button
                className="rounded-full bg-gray-100 p-2"
                aria-label="Profile"
              >
                <User size={20} />
              </button>
              <span className="text-xs font-semibold text-black ">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-block rounded-full bg-orange-500 px-4 py-2 text-sm text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <nav className="hidden justify-center items-center gap-2 pb-2 md:flex md:gap-6">
        {links.map((link) => (
          <NavLink key={link.href} link={link} />
        ))}
      </nav>

      {open && (
        <nav className="flex flex-col border-t border-gray-200 px-4 py-2 md:hidden">
          <Link href="#" className="py-2 text-sm font-medium">
            Categories
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-sm hover:bg-gray-50"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-block">
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
