'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavType } from '@/types/types'

const ActiveNavLink = ({ link }: { link: NavType }) => {
  const pathName = usePathname();
  const isActive = pathName === link.href;

  return (
    <div>
      <Link
        href={link.href}
        aria-current={isActive ? "page" : undefined}
        className={`inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-orange-500 text-white shadow-sm"
            : "text-gray-700 hover:bg-orange-400 hover:text-orange-950"
        }`}
      >
        {link.label}
      </Link>
    </div>
  );
}

export default ActiveNavLink;