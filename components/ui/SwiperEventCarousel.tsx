"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

interface SwiperEventCarouselProps {
  events: Event[];
}

// Benutzerdefinierte Paginierung als separate Komponente
function CustomPagination({ totalSlides, activeIndex, onSlideChange, swiperInstance }: {
  totalSlides: number, 
  activeIndex: number, 
  onSlideChange: (index: number) => void,
  swiperInstance: SwiperType | null
}) {
  return (
    <nav className="flex items-center gap-x-2 justify-center mt-12">
      {/* Zurück-Pfeil */}
      <a 
        className="text-gray-500 p-2 inline-flex items-center md:mr-4 mr-1 cursor-pointer hover:text-[#993333]"
        onClick={() => {
          if (swiperInstance) {
            // Nutze Swiper-eigene Methode zum Zurückgehen
            swiperInstance.slidePrev();
          }
        }}
      >
        <span className="w-10 h-10 rounded-full transition-all duration-150 flex justify-center items-center hover:border hover:border-[#993333]">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 1L1.91421 4.58578C1.24755 5.25245 0.914213 5.58579 0.914213 6C0.914213 6.41421 1.24755 6.74755 1.91421 7.41421L5.5 11" stroke="#993333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
      
      {/* Pagination Dots */}
      <div className="flex gap-x-2">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              activeIndex === i 
                ? 'bg-[#993333]' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => onSlideChange(i)}
            aria-label={`Gehe zu Slide ${i + 1}`}
          />
        ))}
      </div>
      
      {/* Vorwärts-Pfeil */}
      <a 
        className="text-gray-500 p-2 inline-flex items-center md:ml-4 ml-1 cursor-pointer hover:text-[#993333]"
        onClick={() => {
          if (swiperInstance) {
            // Nutze Swiper-eigene Methode zum Weitergehen
            swiperInstance.slideNext();
          }
        }}
      >
        <span className="w-10 h-10 rounded-full transition-all duration-150 flex justify-center items-center hover:border hover:border-[#993333]">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 11L5.08578 7.41421C5.75245 6.74755 6.08579 6.41421 6.08579 6C6.08579 5.58579 5.75245 5.25245 5.08579 4.58579L1.5 1" stroke="#993333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </nav>
  );
}

export function SwiperEventCarousel({ events }: SwiperEventCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handler für die Paginierung
  const handlePaginationClick = (index: number) => {
    if (swiperInstance) {
      // Zum angegebenen Index navigieren - für Loop-Konfiguration
      // Wenn wir direkt slideToLoop verwenden, behandelt Swiper den Loop korrekt
      swiperInstance.slideToLoop(index);
    }
  };

  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        pagination={false}
        breakpoints={{
          640: {
            slidesPerView: 2,
            centeredSlides: false,
          },
          1024: {
            slidesPerView: 3,
            centeredSlides: false,
          },
        }}
        modules={[Navigation]}
        className="centered-slide-carousel"
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => {
          // realIndex wird korrekt im Loop-Modus gehandhabt
          setActiveIndex(swiper.realIndex);
        }}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <Card className="bg-white/5 shadow-md hover:shadow-lg transition-shadow rounded-2xl h-96 flex flex-col overflow-hidden border border-gray-100">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold text-gray-800">{event.title}</CardTitle>
                <div className="flex flex-col mt-2 gap-1 text-sm text-gray-600">
                  <p>{formatDate(event.date)} • {event.time}</p>
                  <p>{event.location}</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="outline"
                  className="w-full border-[#993333] text-[#993333] hover:bg-[#993333] hover:text-white transition-colors"
                >
                  Mehr erfahren
                </Button>
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Benutzerdefinierte Paginierung mit Swiper-Instance übergeben */}
      <CustomPagination 
        totalSlides={events.length}
        activeIndex={activeIndex}
        onSlideChange={handlePaginationClick}
        swiperInstance={swiperInstance}
      />
    </div>
  );
}