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
import { FaApple, FaGoogle, FaSignOutAlt } from 'react-icons/fa'; // Exit-Icon hinzugefügt

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  eventbride: string;
  image: string;
}

interface SwiperEventCarouselProps {
  events: Event[];
}

// Funktion um Kalendar-Links für Google und iCal zu erstellen
const createCalendarLinks = (event: Event) => {
  // Datum und Zeit korrekt extrahieren
  const [startTime, endTime] = event.time.split("-");
  
  // Startdatum und -zeit
  const startDate = new Date(`${event.date}T${startTime}:00`);
  
  // Enddatum und -zeit
  const endDate = new Date(`${event.date}T${endTime}:00`);
  
  // Beschreibung mit Anmeldelink ergänzen, wenn verfügbar
  let description = event.description;
  if (event.eventbride && event.eventbride !== "none") {
    description += `\n\nZur Anmeldung: ${event.eventbride}`;
  }
  
  // Formate für Google Kalender und iCal
  const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');
  
  // Stelle sicher, dass der vollständige Ort korrekt kodiert wird
  const locationParam = encodeURIComponent(event.location);
  
  // Google Kalender Link
  const googleURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDateStr}/${endDateStr}&details=${encodeURIComponent(description)}&location=${locationParam}`;
  
  // iCal Format - Location mit speziellem Escape für Kommas und Umlaute
  const safeLocation = event.location
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
  
  const iCalData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${safeLocation}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  
  // Erstellen eines Blob für iCal
  const iCalBlob = new Blob([iCalData], { type: 'text/calendar;charset=utf-8' });
  const iCalURL = URL.createObjectURL(iCalBlob);
  
  return { googleURL, iCalURL };
};

// Benutzerdefinierte Paginierung als separate Komponente
export function CustomPagination({ totalSlides, activeIndex, onSlideChange, swiperInstance }: {
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
          <SwiperSlide key={event.id} className="pb-4"> {/* Padding unten hinzufügen */}
            <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-shadow rounded-2xl h-[420px] flex flex-col overflow-hidden border border-gray-100">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="p-4 h-[120px] overflow-hidden"> {/* Feste Höhe hinzugefügt */}
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold text-gray-800">{event.title}</CardTitle>
                  
                  {/* Container mit fester Position für den Button */}
                  <div className="min-w-[120px] flex justify-end">
                    {/* Anmeldungs-Button nur anzeigen, wenn eventbride nicht "none" ist */}
                    {event.eventbride && event.eventbride !== "none" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#993333] hover:bg-[#99333315] p-1"
                        onClick={() => window.open(event.eventbride, "_blank")}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">Zur Anmeldung!</span>
                          <FaSignOutAlt className="h-4 w-4" />
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-2 gap-1 text-sm text-gray-600">
                  <p>{formatDate(event.date)} • {event.time}</p>
                  <p>{event.location}</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 mt-auto">
                <div className="w-full flex gap-2">
                  {/* Apple Kalender Button */}
                  <Button 
                    variant="outline"
                    className="flex-1 bg-gray-50 border-gray-200 text-black hover:bg-gray-100 transition-colors rounded-full flex items-center justify-center gap-2"
                    onClick={() => {
                      const { iCalURL } = createCalendarLinks(event);
                      // Download starten
                      const link = document.createElement('a');
                      link.href = iCalURL;
                      link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      // Blob URL freigeben
                      URL.revokeObjectURL(iCalURL);
                    }}
                  >
                    <FaApple className="text-gray-600" />
                    <span>iCal</span>
                  </Button>
                  
                  {/* Google Kalender Button mit gleichem grauen Design */}
                  <Button 
                    variant="outline"
                    className="flex-1 bg-gray-50 border-gray-200 text-black hover:bg-gray-100 transition-colors rounded-full flex items-center justify-center gap-2"
                    onClick={() => {
                      const { googleURL } = createCalendarLinks(event);
                      window.open(googleURL, '_blank');
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-black">Google</span> {/* Textfarbe zu "text-black" geändert */}
                    </div>
                  </Button>
                </div>
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