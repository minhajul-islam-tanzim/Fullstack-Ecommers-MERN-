import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const categories = [
  { name: "Men", image: "/images/men.jpg", link: "/categories/men" },
  { name: "Women", image: "/images/women.jpg", link: "/categories/women" },
  { name: "Kids", image: "/images/kids.jpg", link: "/categories/kids" },
];

const ShopByCategory = () => {
  return (
    <section className="bg-white px-4 py-16 md:py-4">
      <div className="mx-auto max-w-7xl">
  
        {/* Panels */}
        <div className=" flex flex-col gap-3 md:h-156 md:flex-row">
          {categories.map((category, i) => (
            <Link
              href={category.link}
              key={category.name}
              className="group relative block h-72 overflow-hidden rounded-[2rem] bg-[#EEF3F5] md:h-full md:flex-1 md:transition-[flex-grow] md:duration-700 md:ease-out md:hover:grow-[3] md:focus-visible:grow-[3]"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* shade */}
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-black/10 transition-colors duration-500 md:group-hover:from-black/65" />

              {/* Index */}
              <span className="font-(family-name:--font-playfair) absolute left-6 top-5 text-sm tabular-nums text-white/80">
                0{i + 1}
              </span>

              <span className="font-(family-name:--font-playfair) absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-3xl font-semibold tracking-wide text-white transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180 md:block md:group-hover:opacity-0">
                {category.name}
              </span>

              {/* Open state: full content */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 transition-all duration-500 md:translate-y-4 md:p-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-hover:delay-200">
                <div>
                  <h3 className="font-(family-name:--font-playfair) text-4xl font-bold text-white md:text-6xl">
                    {category.name}
                  </h3>
                  <p className="font-(family-name:--font-lato) mt-2 text-sm text-white/80">
                    Shop now
                  </p>
                </div>

                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition-transform duration-500 group-hover:rotate-45 md:h-14 md:w-14">
                  <FiArrowUpRight size={24} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;