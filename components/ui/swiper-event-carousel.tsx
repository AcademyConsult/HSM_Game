"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// ...andere Imports...

export function SwiperEventCarousel({ events }: SwiperEventCarouselProps) {
  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          // Hier direktes Styling der Pagination-Elemente
          el: '.swiper-pagination-custom',
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom'
        }}
        breakpoints={{
          640: { slidesPerView: 2, centeredSlides: false },
          1024: { slidesPerView: 3, centeredSlides: false },
        }}
        modules={[Pagination, Navigation]}
        className="centered-slide-carousel"
      >
        {/* Event-Slides */}
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            {/* Slide-Inhalt */}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Benutzerdefinierte Pagination */}
      <div className="swiper-pagination-custom" style={{ marginTop: '60px' }}></div>
    </div>
  );
}