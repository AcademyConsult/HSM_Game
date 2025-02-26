"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { EventCard } from "./event-card"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
}

export function EventCarousel({ events }: { events: Event[] }) {
  // Gruppiere Events in Seiten zu je 3 Items
  const pages = []
  for (let i = 0; i < events.length; i += 3) {
    pages.push(events.slice(i, i + 3))
  }
  const pageCount = pages.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (_event: any, info: any) => {
    const containerWidth = constraintsRef.current?.offsetWidth || 0
    const draggedPercent = (info.offset.x / containerWidth) * 100
    const newIndex = Math.round(currentIndex - draggedPercent / 100)
    setCurrentIndex(Math.max(0, Math.min(newIndex, pageCount - 1)))
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative overflow-hidden bg-white" ref={constraintsRef}>
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        style={{ display: "flex", width: `${pageCount * 100}%` }}
        animate={{ x: `${-currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} style={{ width: `${100 / pageCount}%` }} className="flex gap-4">
            {page.map((event: Event) => (
              <div key={event.id} style={{ flex: 1 }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-4 w-4 rounded-full mx-1 focus:outline-none ${
              index === currentIndex ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}