"use client"

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, Gift, ShoppingBag, Menu, X } from "lucide-react";


interface NavType {
  label: string, href: string
}

const links:NavType[] = [
  { label: "Gifts", href: "/gifts" },
  { label: "Special Birthday Gifts", href: "/birthday-gifts" },
  { label: "Home Favourites", href: "/home-favourites" },
  { label: "Fashion Finds", href: "/fashion-finds" },
  { label: "Registry", href: "/registry" },
];

const categories:NavType[] = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
];



export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
    
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 md:flex-nowrap md:gap-4">
        
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a href="/" className="text-2xl font-bold text-orange-500 sm:text-3xl">TM</a>




      <div className="group relative hidden md:block">
  <button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium hover:bg-gray-100">
    <Menu size={16} /> Categories
  </button>


  
  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
    <ul className="w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
      {categories.map((c) => (
        <li key={c.href}>
          <a href={c.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
            {c.label}
          </a>
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
        

<Link href="/login" className="hidden text-sm font-medium hover:underline sm:block">
  Sign in
</Link>
          <Heart size={20} className="cursor-pointer" />
          <Gift size={20} className="hidden cursor-pointer sm:block" />
          <ShoppingBag size={20} className="cursor-pointer" />
        </div>
      </div>

    
      <nav className="hidden justify-center gap-8 pb-2 md:flex">
        {links.map((I) => (
          <a key={I.href} href={I.href} className="text-xs font-medium hover:underline">{I.label}</a>
        ))}
      </nav>

      
      {open && (
        <nav className="flex flex-col border-t border-gray-200 px-4 py-2 md:hidden">
          <a href="#" className="py-2 text-sm font-medium">Categories</a>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="py-2 text-sm hover:bg-gray-50">{l.label}</a>
          ))}
          <a href="#" className="py-2 text-sm font-medium sm:hidden">Sign in</a>
        </nav>
      )}
    </header>
  );
}