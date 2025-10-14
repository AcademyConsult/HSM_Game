'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

import { CustomPagination } from '@/components/ui/SwiperEventCarousel';

const imageBaseUrl = '';

export type CoffeeProfile = {
  displayName: string;
  degreeProgram: string;
  stage?: string;
  university?: string;
  currentSemester?: number;
  imageLink: string;
  calendarLink?: string;
  linkedinLink?: string;
};

const resolveImageSrc = (imagePath: string) => {
  if (!imagePath) return `${imageBaseUrl}/placeholder.svg`;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${imageBaseUrl}/${normalizedPath}`;
};

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export default function CoffeeChatCarousel({
  profiles,
}: {
  profiles: CoffeeProfile[];
}) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      if (swiperInstance) {
        swiperInstance.slideToLoop(index);
      }
    },
    [swiperInstance]
  );

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + profiles.length) % profiles.length;
    goToSlide(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % profiles.length;
    goToSlide(nextIndex);
  };

  const handlePaginationClick = (index: number) => {
    goToSlide(index);
  };

  useEffect(() => {
    if (!swiperInstance) return;

    const annalenaIndex = profiles.findIndex(
      (profile) => profile.displayName.toLowerCase() === 'annalena'
    );
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 639px)').matches;
    const targetIndex =
      isMobile && annalenaIndex >= 0 ? annalenaIndex : 0;

    swiperInstance.slideToLoop(targetIndex, 0);
  }, [profiles, swiperInstance]);

  if (!profiles?.length) {
    return null;
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Vorheriger Coffee Chat"
        className="absolute left-0 top-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#993333] h-10 w-10 md:h-12 md:w-12"
        style={{ transform: 'translate(-50%, -50%)', top: '210px' }}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.5 1L1.91421 4.58578C1.24755 5.25245 0.914213 5.58579 0.914213 6C0.914213 6.41421 1.24755 6.74755 1.91421 7.41421L5.5 11"
            stroke="#993333"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Nächster Coffee Chat"
        className="absolute right-0 top-1/2 z-20 flex translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#993333] h-10 w-10 md:h-12 md:w-12"
        style={{ transform: 'translate(50%, -50%)', top: '210px' }}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.5 11L5.08578 7.41421C5.75245 6.74755 6.08579 6.41421 6.08579 6C6.08579 5.58579 5.75245 5.25245 5.08579 4.58579L1.5 1"
            stroke="#993333"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides={false}
        loop
        pagination={false}
        breakpoints={{
          640: {
            slidesPerView: 'auto' as const,
            centeredSlides: true,
          },
          1024: {
            spaceBetween: 24,
            slidesPerView: 'auto' as const,
            centeredSlides: true,
          },
        }}
        modules={[Navigation]}
        className="centered-slide-carousel"
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {profiles.map((profile) => {
          const detailParts = [
            profile.degreeProgram,
            profile.stage,
            profile.university,
          ]
            .filter(Boolean)
            .map((part) => part as string);
          if (profile.currentSemester) {
            detailParts.push(`${profile.currentSemester}. Semester`);
          }

          return (
            <SwiperSlide
              key={profile.displayName}
              className="pb-4 flex justify-center px-4 !w-full sm:!w-auto"
            >
              <div className="group/card flex w-full flex-col items-stretch sm:w-72">
                <div className="relative h-[420px] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10 transition-transform duration-500 group-hover/card:scale-[1.02]">
                  <Image
                    src={resolveImageSrc(profile.imageLink)}
                    alt={profile.displayName}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                    <h3 className="text-2xl font-semibold drop-shadow-sm">
                      {profile.displayName}
                    </h3>
                    {detailParts.length > 0 ? (
                      <p className="mt-2 text-sm text-white/80">
                        {detailParts.join(' • ')}
                      </p>
                    ) : null}
                  </div>
                </div>

                {profile.calendarLink ? (
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-full border-gray-200 bg-white/90 text-neutral-900 shadow-md transition-transform duration-300 hover:scale-[1.02] hover:bg-white"
                    asChild
                  >
                    <Link
                      href={profile.calendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Coffee Chat buchen
                    </Link>
                  </Button>
                ) : null}
                {profile.linkedinLink ? (
                  <Button
                    variant="outline"
                    className={`w-full rounded-full border-gray-200 bg-white/90 text-neutral-900 shadow-md transition-transform duration-300 hover:scale-[1.02] hover:bg-white ${profile.calendarLink ? 'mt-2' : 'mt-4'}`}
                    asChild
                  >
                    <Link
                      href={profile.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Link>
                  </Button>
                ) : null}
              </div>
            </SwiperSlide>
          );
        })}
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
