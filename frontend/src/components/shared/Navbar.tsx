"use client";


import { useState } from "react";

import { Menu, X, Search, Heart, ShoppingBag, User } from "lucide-react";

type NavbarProps = {
  activeItem?: string;
  cartCount?: number;
};

const links = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "New Arrivals", href: "/new" },
  { label: "Sale", href: "/sale" },
];

const Navbar = ({ activeItem = "Home", cartCount = 0 }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold tracking-widest text-gray-900"
        >
          STYLE<span className="text-rose-500">...</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`group relative py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                    isActive
                      ? "text-rose-500"
                      : "text-gray-700 hover:text-rose-500"
                  } ${item.label === "Sale" && !isActive ? "text-red-600" : ""}`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 bg-rose-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-rose-500"
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-rose-500 sm:block"
          >
            <Heart size={20} />
          </button>
          <button
            aria-label="Account"
            className="hidden rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-rose-500 sm:block"
          >
            <User size={20} />
          </button>
          <button
            aria-label="Cart"
            className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-rose-500"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>


      

      {/* Mobile Menu */}




      <div
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-4 py-3">
          {links.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide transition ${
                    isActive
                      ? "bg-rose-50 text-rose-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-rose-500"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
