"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { banners } from "@/data/banners";

import "swiper/css";
import "swiper/css/effect-coverflow";

const copies = Math.ceil(8 / banners.length);
const slides = Array.from(
  { length: copies * banners.length },
  (_, i) => banners[i % banners.length],
);

const HeroSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  const current = banners[active];

  return (
    <section className="relative overflow-hidden bg-[#292521] pb-10 pt-10 md:pb-12 md:pt-14 shadow-2xl">
      {/* Orange glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/30 blur-3xl md:h-105 md:w-105"
      />

      {/* Carousel */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-[#292521] to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-[#292521] to-transparent md:w-40" />

        <Swiper
          modules={[Autoplay, EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 180,
            modifier: 1,
            slideShadows: false,
          }}
          centeredSlides
          slidesPerView="auto"
          slideToClickedSlide
          grabCursor
          loop
          speed={800}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.realIndex % banners.length)}
          className="py-4"
        >
          {slides.map((banner, i) => (
            <SwiperSlide
              key={i}
              className="group/s w-64! sm:w-72! md:w-80! lg:w-96!"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-[#EEF3F5] shadow-2xl shadow-black/40">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={i < 3}
                  sizes="384px"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[#292521]/55 transition-opacity duration-500 group-[.swiper-slide-active]/s:opacity-0"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Arrows (desktop) */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
          className="absolute left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-[#292521] md:flex"
        >
          <FiArrowLeft size={20} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
          className="absolute right-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-[#292521] md:flex"
        >
          <FiArrowRight size={20} />
        </button>
      </div>

      {/* Text */}
      <div
        key={current.id}
        className="relative z-10 mx-auto mt-8 flex max-w-2xl flex-col items-center px-4 text-center transition-all duration-700 starting:translate-y-4 starting:opacity-0"
      >
        <h1 className="font-(family-name:--font-playfair) text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {current.title}
        </h1>

        <p className="font-(family-name:--font-lato) mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/70 md:text-base">
          {current.description}
        </p>

        <Link
          href={current.buttonLink}
          className="group mt-6 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-medium text-[#292521] transition-colors hover:bg-[#EEF3F5]"
        >
          {current.buttonText}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:rotate-45">
            <FiArrowUpRight size={18} />
          </span>
        </Link>
      </div>

      {/* Dots */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-2">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => swiperRef.current?.slideToLoop(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i
                ? "w-8 bg-orange-500"
                : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Tilted number */}
      <div
        key={active}
        aria-hidden
        className="font-(family-name:--font-playfair) pointer-events-none absolute bottom-10 z-10 hidden -rotate-12 select-none leading-none transition-all duration-700 starting:translate-y-6 starting:opacity-0 lg:left-[20%] lg:block xl:left-94"
      >
        <span className="text-[10rem] font-bold text-transparent [-webkit-text-stroke:1.5px_rgba(249,115,22,0.9)] xl:text-[16rem]">
          {active + 1}
        </span>
        <span className="ml-2 text-2xl text-white/50 xl:text-4xl">
          / {banners.length}
        </span>
      </div>
    </section>
  );
};

export default HeroSlider;
