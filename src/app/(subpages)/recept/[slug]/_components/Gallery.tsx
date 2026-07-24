"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import type { StrapiImage } from "@/types/strapi-image";

type GalleryProps = {
  images: StrapiImage[];
  title: string;
};

export function Gallery({ images, title }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images?.length) return null;

  const getAlt = (image: StrapiImage, index: number) =>
    image.alternativeText || image.name || `${title} — slika ${index + 1}`;

  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <Image
          src={images[0].url}
          alt={getAlt(images[0], 0)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 768px"
          className="object-cover"
        />
      </div>
    );
  }

  const goTo = (index: number) => {
    setSelectedIndex(
      ((index % images.length) + images.length) % images.length,
    );
  };

  return (
    <div>
      {/* Desktop: dominant image + thumbnail strip */}
      <div
        className="hidden md:block"
        role="group"
        aria-label="Galerija slika recepta"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") goTo(selectedIndex - 1);
          if (event.key === "ArrowRight") goTo(selectedIndex + 1);
        }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={images[selectedIndex].url}
            alt={getAlt(images[selectedIndex], selectedIndex)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
        </div>
        <div className="mt-3 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.id ?? index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Prikaži sliku ${index + 1} od ${images.length}`}
              aria-current={index === selectedIndex}
              className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                index === selectedIndex
                  ? "border-2 border-terracotta"
                  : "border border-line opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: swipeable single-image carousel */}
      <div className="md:hidden">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="recipe-gallery-swiper overflow-hidden rounded-lg"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id ?? index}>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image.url}
                  alt={getAlt(image, index)}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
