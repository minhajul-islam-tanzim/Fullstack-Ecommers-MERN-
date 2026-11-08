import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Men", image: "/images/men.jpg", link: "/categories/men" },
  { name: "Women", image: "/images/women.jpg", link: "/categories/women" },
  { name: "Kids", image: "/images/kids.jpg", link: "/categories/kids" },
];

const ShopByCategory = () => {
  return (
    <section className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">
        Shop By Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => (
          <Link
            href={category.link}
            key={category.name}
            className="group relative h-80 overflow-hidden rounded-xl"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-bold">{category.name}</h3>
              <span className="mt-3 underline">Shop Now</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;