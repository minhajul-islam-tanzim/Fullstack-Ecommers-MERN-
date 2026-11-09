"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { banners } from "@/data/banners";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 2000 }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full [--swiper-navigation-color:#fff] [--swiper-pagination-color:#fff] "
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
  <div className="relative h-[60vh] min-h-55 w-full md:h-[75vh] lg:h-200 rounded-2xl">
    <Image
      src={banner.image}
      alt={banner.title}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="font-(family-name:--font-playfair) text-4xl md:text-6xl font-bold tracking-wide drop-shadow-lg">
  {banner.title}
</h1>                                                      

              <p className="font-(--font-body) mt-4 text-lg max-w-2xl opacity-90  font-(family-name:--font-lato)">
                {banner.description}
              </p>

              <Link
                href={banner.buttonLink}
                className="font-[var(--font-body)] font-medium mt-6 bg-orange-500 hover:bg-orange-600 transition px-8 py-3 rounded-md"
              >
                {banner.buttonText}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;