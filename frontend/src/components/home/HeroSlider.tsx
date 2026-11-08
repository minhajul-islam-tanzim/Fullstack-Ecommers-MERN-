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
      autoplay={{ delay: 4000 }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div className="relative h-112.5 w-full">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                {banner.title}
              </h1>

              <p className="mt-4 text-lg">
                {banner.description}
              </p>

              <Link
                href={banner.buttonLink}
                className="mt-6 bg-orange-500 px-6 py-3 rounded-md"
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