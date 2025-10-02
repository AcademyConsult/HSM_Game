'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionDivider } from '@/components/ui/SectionDivider';

interface TeamMember {
  id: number;
  name: string;
  study: string;
  semester: string;
  image: string;
  calendlyLink: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Müller',
    study: 'Betriebswirtschaftslehre',
    semester: '6',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=720&q=80',
    calendlyLink: 'https://calendly.com/sarah-mueller',
  },
  {
    id: 2,
    name: 'Max Weber',
    study: 'Wirtschaftsingenieurwesen',
    semester: '4',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&q=80',
    calendlyLink: 'https://calendly.com/max-weber',
  },
  {
    id: 3,
    name: 'Tom Schmidt',
    study: 'Management & Technology',
    semester: '8',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=720&q=80',
    calendlyLink: 'https://calendly.com/tom-schmidt',
  },
  {
    id: 4,
    name: 'Lisa Johnson',
    study: 'International Business',
    semester: '2',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=720&q=80',
    calendlyLink: 'https://calendly.com/lisa-johnson',
  },
];

interface TeamMemberCardProps extends TeamMember {}

const TeamMemberCard = ({ name, study, semester, image, calendlyLink }: TeamMemberCardProps) => {
  return (
    <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-500 group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={`Portrait von ${name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:from-neutral-900/90" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-6">
          <h3 className="text-2xl font-semibold text-white">{name}</h3>
          <p className="mt-2 text-sm text-white/80">
            {study} <span className="text-white/60">• {semester}. Semester</span>
          </p>
        </div>
      </div>
      <div className="p-5">
        <Button
          variant="outline"
          className="w-full rounded-full bg-gray-50 border-gray-200 text-neutral-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          asChild
        >
          <a href={calendlyLink} target="_blank" rel="noopener noreferrer">
            <Calendar className="mr-2 h-4 w-4" />
            Coffee Chat buchen
          </a>
        </Button>
      </div>
    </div>
  );
};

export const TeamSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);

    return () => {
      window.removeEventListener('resize', updateItemsPerView);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, teamMembers.length - itemsPerView);
      return Math.min(prev, maxIndex);
    });
  }, [itemsPerView]);

  const maxIndex = Math.max(0, teamMembers.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <SectionDivider title="Triff uns, wir laden dich auf einen Kaffe ein!" />
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-lg text-neutral-600">
            Unsere Beraterinnen und Berater freuen sich darauf, dich kennenzulernen. Buche dir direkt einen Coffee Chat und stelle deine Fragen.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevSlide}
              className="hidden h-12 w-12 rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-colors duration-300 hover:bg-neutral-100 lg:flex"
              aria-label="Vorherige Teammitglieder"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-900" />
            </Button>
          </div>

          <div className="absolute right-0 top-1/2 z-20 -translate-y-1/2">
            <Button
              variant="secondary"
              size="icon"
              onClick={nextSlide}
              className="hidden h-12 w-12 rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-colors duration-300 hover:bg-neutral-100 lg:flex"
              aria-label="Nächste Teammitglieder"
            >
              <ChevronRight className="h-6 w-6 text-neutral-900" />
            </Button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white/60 shadow-inner">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="w-full flex-shrink-0 px-4 py-6"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <TeamMemberCard {...member} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <nav className="mt-10 flex items-center justify-center gap-x-2">
          <button
            type="button"
            className="text-gray-500 p-2 inline-flex items-center md:mr-4 mr-1 hover:text-[#993333]"
            onClick={prevSlide}
            aria-label="Vorherige Teammitglieder"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 hover:border hover:border-[#993333]">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 1L1.91421 4.58578C1.24755 5.25245 0.914213 5.58579 0.914213 6C0.914213 6.41421 1.24755 6.74755 1.91421 7.41421L5.5 11" stroke="#993333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          <div className="flex gap-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`h-4 w-4 rounded-full transition-all duration-200 ${
                  currentIndex === index ? 'bg-[#993333]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Team-Slider Position ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="text-gray-500 p-2 inline-flex items-center md:ml-4 ml-1 hover:text-[#993333]"
            onClick={nextSlide}
            aria-label="Nächste Teammitglieder"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 hover:border hover:border-[#993333]">
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 11L5.08578 7.41421C5.75245 6.74755 6.08579 6.41421 6.08579 6C6.08579 5.58579 5.75245 5.25245 5.08579 4.58579L1.5 1" stroke="#993333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </nav>
      </div>
    </section>
  );
};
