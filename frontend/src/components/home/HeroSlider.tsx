"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { banners } from "@/data/banners";

import "swiper/css";
import "swiper/css/effect-fade";

const pad = (n: number) => String(n).padStart(2, "0");

const HeroSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#dde9ecfb]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop
        speed={900}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex)}
        onAutoplayTimeLeft={(_, __, progress) => {
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${1 - progress})`;
          }
        }}
      >
        {banners.map((banner, i) => {
          const next = banners[(i + 1) % banners.length];

          return (
            <SwiperSlide key={banner.id}>
              <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-4 pt-8 md:grid-cols-12 md:px-8 md:pt-35  md:pb-35">
                {/* Giant faded number */}
                <span
                  aria-hidden
                  className="font-(family-name:--font-playfair) pointer-events-none absolute -top-2 left-2 select-none text-[7rem] font-bold leading-none text-[#292521]/[0.06] md:-top-4 md:left-4 md:text-[12rem]"
                >
                  {pad(i + 1)}
                </span>

                {/* Text */}
                <div className="relative z-10 md:col-span-5 md:pr-6">
                  <h1 className="font-(family-name:--font-playfair) text-4xl font-bold leading-[1.05] tracking-tight text-[#292521] md:text-6xl">
                    {banner.title}
                  </h1>

                  <p className="font-(family-name:--font-lato) mt-5 max-w-md text-base leading-7 text-[#292521]/70 md:text-lg">
                    {banner.description}
                  </p>

                  <Link
                    href={banner.buttonLink}
                    className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#292521] py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors hover:bg-black"
                  >
                    {banner.buttonText}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 transition-transform group-hover:rotate-45">
                      <FiArrowUpRight size={18} />
                    </span>
                  </Link>
                </div>

                {/* Images */}
                <div className="relative mx-auto h-[42vh] min-h-72 w-[88%] md:col-span-7 md:h-110 md:w-full">
                  {/* Back card = next slide */}
                  <div className="absolute inset-0 origin-bottom-left translate-x-6 rotate-6 overflow-hidden rounded-3xl md:translate-x-10">
                    <Image
                      src={next.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 55vw, 90vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#EEF3F5]/60" />
                  </div>

                  {/* Front card */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl shadow-black/20">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 768px) 55vw, 90vw"
                      className="object-contain"
                    />
                  </div>

                  {/* Rotating badge */}
                  <div
                    aria-hidden
                    className="absolute -left-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg md:-left-10 md:-top-8 md:h-28 md:w-28"
                  >
                    <svg
                      viewBox="0 0 120 120"
                      className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]"
                    >
                      <defs>
                        <path
                          id={`badge-${i}`}
                          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                        />
                      </defs>
                      <text
                        className="fill-[#292521]"
                        style={{ fontSize: 10.5, letterSpacing: "0.12em" }}
                      >
                        <textPath
                          href={`#badge-${i}`}
                          textLength="268"
                          lengthAdjust="spacing"
                        >
                          Anyware · New season · Shop now ·
                        </textPath>
                      </text>
                    </svg>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white md:h-12 md:w-12">
                      <FiArrowUpRight size={20} />
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Controls */}
      <div className="mx-auto max-w-7xl px-4 pb-5 md:px-8">
        <div className="flex items-end justify-between gap-4">
          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`relative h-12 w-9 overflow-hidden rounded-lg transition-all duration-300 md:h-14 md:w-10 ${
                  active === i
                    ? "ring-2 ring-[#292521] ring-offset-2 ring-offset-[#EEF3F5]"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={b.image}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#292521]/30 text-[#292521] transition-colors hover:bg-[#292521] hover:text-white"
            >
              <FiArrowLeft size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#292521]/30 text-[#292521] transition-colors hover:bg-[#292521] hover:text-white"
            >
              <FiArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Autoplay line */}
        <div className="mt-4 h-0.5 w-full overflow-hidden bg-[#292521]/15">
          <div
            ref={barRef}
            className="h-full origin-left bg-[#292521]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;