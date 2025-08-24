"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { StrapiImage } from "@/types/strapi-image";

const SwiperImages = ({ images }: { images: StrapiImage[] }) => {
  if (!images?.length) {
    return null;
  }

  return (
    <>
      <Swiper
        slidesPerView={1.5}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.url}
              alt={image.name}
              className="object-cover aspect-4/3"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperImages;
