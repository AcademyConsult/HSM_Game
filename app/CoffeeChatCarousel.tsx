'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CustomPagination } from '@/components/ui/SwiperEventCarousel';

type CoffeeProfile = {
  displayName: string;
  degreeProgram: string;
  currentSemester: number;
  imageLink: string;
  calendarLink: string;
};

const resolveImageSrc = (imagePath: string) => {
  if (!imagePath) {
    return '/placeholder.svg';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const normalizedPath = imagePath.replace(/^\/+/, '');
  return `/imagesForChats/${normalizedPath}`;
};

export default function CoffeeChatCarousel({
  profiles,
}: {
  profiles: CoffeeProfile[];
}) {
  const [swiperInstance, setSwiperInstance] =
    useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePaginationClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  if (!profiles?.length) {
    return null;
  }

  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        centeredSlides
        loop
        pagination={false}
        breakpoints={{
          640: {
            centeredSlides: true,
          },
          1024: {
            spaceBetween: 24,
            centeredSlides: true,
          },
        }}
        modules={[Navigation]}
        className="centered-slide-carousel"
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {profiles.map((profile) => (
          <SwiperSlide
            key={profile.displayName}
            className="pb-4 flex justify-center px-2 !w-auto"
          >
            <div className="relative rounded-xl overflow-hidden h-[420px] w-72 flex flex-col justify-end shadow-md hover:shadow-lg transition-shadow border border-gray-100 mx-auto">
              <div className="absolute inset-0">
                <Image
                  src={resolveImageSrc(profile.imageLink)}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="relative mt-auto w-full p-3 text-white">
                <h3 className="text-xl font-semibold">
                  {profile.displayName}
                </h3>
                <p className="text-sm font-light">
                  {profile.degreeProgram} - {profile.currentSemester}.
                  Semester
                </p>
                {profile.calendarLink && (
                  <Link
                    href={profile.calendarLink}
                    className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-md bg-white hover:bg-neutral-100 active:bg-neutral-200 py-2 text-sm text-black"
                  >
                    <Image
                      src={'/icons/calendar-icon.png'}
                      alt="Calendar"
                      width={16}
                      height={16}
                    />
                    Coffee Chat buchen
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <CustomPagination
        totalSlides={profiles.length}
        activeIndex={activeIndex}
        onSlideChange={handlePaginationClick}
        swiperInstance={swiperInstance}
      />
    </div>
  );
}
