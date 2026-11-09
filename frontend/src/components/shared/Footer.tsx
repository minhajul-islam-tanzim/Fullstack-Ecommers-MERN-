"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiRefreshCcw,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const perks = [
  { icon: FiTruck, title: "Free delivery", text: "On orders over $50" },
  { icon: FiRefreshCcw, title: "Easy returns", text: "30 days, no questions" },
  { icon: FiShield, title: "Secure payment", text: "Your data stays safe" },
  { icon: FiHeadphones, title: "Real support", text: "Chat with us daily" },
];

const shop = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Home & Living", href: "/home-living" },
];

const gifts = [
  { label: "Gifts", href: "/home-favourites" },
  { label: "Birthday Gifts", href: "/birthday-gift" },
];

const help = [
  { label: "Contact us", href: "/contact" },
  { label: "Shipping info", href: "/shipping" },
  { label: "Returns & refunds", href: "/returns" },
  { label: "Track my order", href: "/track-order" },
  { label: "FAQ", href: "/faq" },
];

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaXTwitter, label: "X", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
];

const legal = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-(family-name:--font-playfair) text-lg font-semibold text-[#292521]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-gray-600 transition-colors hover:text-orange-500"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.includes("@")) return;
    // TODO: call your newsletter API here
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      {/* Perks */}
      <div className="border-b border-gray-200">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#292521]">{title}</p>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand + newsletter */}
        <div className="lg:col-span-4">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-500">A</span>
            <span className="text-gray-400">N</span>
            <span className="text-gray-300">Y</span>
            <span className="text-3xl font-bold">W</span>
            <span className="text-sky-300">A</span>
            <span className="text-sky-200">R</span>
            <span>E</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
            Clothes and gifts for everyone in the family. Pick what you love,
            and we will bring it to your door.
          </p>

          <p className="mt-6 text-sm font-semibold text-[#292521]">
            Get 10% off your first order
          </p>

          {subscribed ? (
            <p className="mt-3 rounded-full bg-green-50 px-4 py-2.5 text-sm text-green-700">
              You are in. Check your inbox for your code.
            </p>
          ) : (
            <div className="mt-3 flex max-w-sm items-center rounded-full border-2 border-black py-1 pl-4 pr-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-transparent py-1 text-sm outline-none"
              />
              <button
                onClick={handleSubscribe}
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Join
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="rounded-full bg-gray-100 p-2.5 text-gray-700 transition-colors hover:bg-orange-500 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2 lg:col-span-5 lg:pl-8">
          <FooterColumn title="Shop" items={shop} />
          <FooterColumn title="Gifts" items={gifts} />
          <div className="col-span-2 sm:col-span-1">
            <FooterColumn title="Help" items={help} />
          </div>
        </div>

        {/* Contact */}
        <div className="md:col-span-2 lg:col-span-3">
          <h3 className="font-(family-name:--font-playfair) text-lg font-semibold text-[#292521]">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <FiMapPin size={18} className="mt-0.5 shrink-0 text-orange-500" />
              <span>Khulna, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone size={18} className="shrink-0 text-orange-500" />
              <a href="tel:+8801000000000" className="hover:text-orange-500">
                +880 1811639306
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail size={18} className="shrink-0 text-orange-500" />
              <a
                href="mailto:tanzimminhaj.com"
                className="hover:text-orange-500"
              >
                tanzimminhaj@gmail.com
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Support hours: Sat to Thu, 10am to 8pm
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 Anyware. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-orange-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}