"use client"

import { useState, useMemo } from "react"
import { Calendar, MapPin, Clock, Share2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
}

interface EventCardProps {
  event: Event
  isActive?: boolean
}

export function EventCard({ event, isActive = false }: EventCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const handleExportToCalendar = (type: "ical" | "google") => {
    const { title, date, time, location, description } = event
    const startDate = new Date(`${date}T${time}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // Assuming 2-hour duration

    if (type === "ical") {
      const icalContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DTSTART:${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n")

      const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${title.replace(/\s+/g, "_")}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (type === "google") {
      const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, "")}/${endDate.toISOString().replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
      window.open(googleCalendarUrl, "_blank")
    }
  }

  const shareText = useMemo(() => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : ""
    return `
${event.title}

Datum: ${new Date(event.date).toLocaleDateString("de-DE")}
Uhrzeit: ${event.time} Uhr
Ort: ${event.location}

${event.description}

Mehr Infos: ${currentUrl}
    `.trim()
  }, [event])

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch (error) {
      console.error("Fehler beim Kopieren:", error)
    }
  }

  return (
    <div className="p-2">
      <Card
        className={`overflow-hidden h-full flex flex-col relative transition-shadow ${
          isActive ? "ring-2 ring-primary shadow-lg" : ""
        }`}
      >
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={() => setIsShareDialogOpen(true)}>
          <Share2 className="h-4 w-4" />
        </Button>
        <div className="w-full h-40">
        <iframe
          src={event.embedUrl}
          width="640"
          height="360"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title={event.title}
          className="w-full h-full"
        />
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString("de-DE")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{event.time} Uhr</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleExportToCalendar("ical")}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple Kalender" className="h-4 w-4 mr-2" />
              Apple Kalender
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => handleExportToCalendar("google")}
            >
              <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Calendar" className="h-4 w-4 mr-2" />
              Google Calendar
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event teilen</DialogTitle>
            <DialogDescription>Kopieren Sie den Text unten oder nutzen Sie die Teilen-Optionen.</DialogDescription>
          </DialogHeader>
          <Textarea value={shareText} readOnly onClick={(e) => e.currentTarget.select()} className="h-[200px]" />
          <div className="flex justify-between">
            <Button onClick={copyShareText}>Text kopieren</Button>
            {navigator.share && <Button onClick={() => navigator.share({ text: shareText })}>Teilen</Button>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

