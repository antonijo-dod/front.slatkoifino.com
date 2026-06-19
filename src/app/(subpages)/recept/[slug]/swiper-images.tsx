"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import { StrapiImage } from "@/types/strapi-image";
import { cloudinaryUrl } from "@/lib/cloudinaryUrl";

const SwiperImages = ({ images }: { images: StrapiImage[] }) => {
  if (!images?.length) {
    return null;
  }

  return (
    <>
      <Swiper
        slidesPerView={images.length === 1 ? 1 : 1.5}
        spaceBetween={16}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={image.id || index}
            className="rounded-lg overflow-hidden"
          >
            <div className="aspect-4/3 relative">
              <Image
                src={cloudinaryUrl(image.url)}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 67vw, (max-width: 1024px) 47vw, 467px"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperImages;
