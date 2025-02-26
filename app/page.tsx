"use client"

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Linkedin, Youtube, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventCarousel } from "@/components/ui/event-carousel";
import { motion, HTMLMotionProps } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SwiperEventCarousel } from "@/components/ui/SwiperEventCarousel";

// Typdefinition für AccordionRenderProps
type AccordionRenderProps = {
  open: boolean;
};

type MotionSpanProps = {
  className: string;
  animate: {
    rotate: number;
    y: number;
  };
  transition: {
    duration: number;
  };
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [openItems, setOpenItems] = useState<{[key: string]: boolean}>({});

  const prizes = [
    {
      position: "1",
      title: "Hauptpreis",
      description: "X-Box One",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Microsoft-Xbox-One-X-Console.png/800px-Microsoft-Xbox-One-X-Console.png?20230905163012",
    },
    {
      position: "2",
      title: "Zweiter Preis",
      description: "Nintendo Switch",
      image:
        "https://e7.pngegg.com/pngimages/349/579/png-clipart-nintendo-switch-splatoon-2-nintendo-64-super-mario-odyssey-nintendo-electronics-gadget.png",
    },
    {
      position: "3",
      title: "Dritter Preis",
      description: "800 Liter RedBull",
      image:
        "https://dosenmatrosen.imgbolt.de/media/c9/5a/63/1694594528/GL007311-24-1-Red-Bull-Summer-Edition-Juneberry.png?ts=1694594528",
    },
  ];

  const events = [
    {
      id: 1,
      title: "AC Networking Night",
      date: "2025-03-15",
      time: "19:00",
      location: "RWTH Aachen, Templergraben 55",
      description: "Netzwerken Sie mit Studenten und Alumnis von Academy Consult.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
    },
    {
      id: 2,
      title: "Fallstudienwettbewerb",
      date: "2025-04-02",
      time: "14:00",
      location: "Coworking Space, Pontstraße 41",
      description: "Lösen Sie spannende Fallstudien und gewinnen Sie attraktive Preise.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
      },
    {
      id: 3,
      title: "AC Sommerfest",
      date: "2025-07-10",
      time: "16:00",
      location: "Westpark, Aachen",
      description: "Feiern Sie den Sommer mit uns bei Grill und Getränken.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
      },
    {
      id: 4,
      title: "Unternehmensvorstellung: Tech AG",
      date: "2025-09-05",
      time: "18:00",
      location: "Online (Zoom)",
      description: "Lernen Sie einen führenden Tech-Arbeitgeber kennen.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
      },
    {
      id: 5,
      title: "Workshop: Projektmanagement",
      date: "2025-10-20",
      time: "10:00",
      location: "RWTH Aachen, Kackertstraße 7",
      description: "Praxisnaher Workshop zu agilen Projektmanagement-Methoden.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
      },
    {
      id: 6,
      title: "AC Weihnachtsfeier",
      date: "2025-12-18",
      time: "20:00",
      location: "Pontstraße 141-149, 52062 Aachen",
      description: "Jahresabschluss und gemütliches Beisammensein.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
      },
    {
      id: 7,
      title: "AC Weihnachtsfeier",
      date: "2025-12-18",
      time: "20:00",
      location: "Pontstraße 141-149, 52062 Aachen",
      description: "Jahresabschluss und gemütliches Beisammensein.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png",
      },
  ];

  const [games, setGames] = useState([
    {
      id: 1,
      title: "Wimmelbild: Finde Leo der Löwe (einfach)",
      completed: false,
    },
    {
      id: 2,
      title: "Kreuzworträtsel (medium)",
      completed: false,
    },
    {
      id: 3,
      title: "Estimation Case (hard)",
      completed: false,
    }
  ]);
  
  const allGamesCompleted = games.every(game => game.completed);
  
  const markGameAsCompleted = (gameId: number) => {
    setGames(games.map(game => 
      game.id === gameId ? { ...game, completed: true } : game
    ));
  };

  // Berechnung der Anzahl an Platzhaltern, sodass (events.length + Platzhalter) ein Vielfaches von 3 ist
  const eventPlaceholders = events.length % 3 === 0 ? 0 : 3 - (events.length % 3);

  // Innerhalb deiner Komponente
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Scroll-Listener für Events
  useEffect(() => {
    const container = eventsContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.clientWidth / 3;
      const index = Math.floor(scrollLeft / itemWidth);
      setActiveEventIndex(Math.min(Math.floor(index / 3), Math.ceil(events.length / 3) - 1));
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [events.length]);
  
  return (
    <main className="min-h-screen">
      {/* Landing Section (behält individuellen Hintergrund) */}
      <section
        className="min-h-[600px] relative flex items-center"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 py-24 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Willkommen bei dem AC Game Gewinnspiel
            </h1>
            <p className="text-lg md:text-xl">
              Tauchen Sie ein in unsere spannende Spielewelt und gewinnen Sie tolle Preise! Testen Sie Ihr Geschick in drei verschiedenen Herausforderungen.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {prizes.map((prize, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md text-white border-none">
                <CardHeader>
                  <CardTitle className="text-center">
                    {prize.position}. {prize.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={prize.image || "/placeholder.svg"}
                      alt={prize.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-center">{prize.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Card className="bg-white/10 backdrop-blur-md text-white border-none">
              <CardHeader>
                <CardTitle className="text-center">
                   4. Trostpreis
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-full h-16 mb-4 overflow-hidden rounded-lg">
                  <img
                    src="https://example.com/trostpreis.png"
                    alt="Trostpreis"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center">Ein Trostpreis für alle Teilnehmer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsoren Sektion */}
      <section className="bg-white py-6 w-screen overflow-hidden relative">
        <SectionDivider title="Sponsoren" />
        
        <div className="ticker-container w-screen mt-16">
          <div className="ticker-track animate-ticker">
            {/* Erster Satz Logos */}
            <div className="ticker-content">
              {Array(10).fill(null).map((_, i) => (
                <img
                  key={`sponsor-1-${i}`}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Celonis_Logo.png/1280px-Celonis_Logo.png"
                  alt="Celonis Logo"
                  className="mx-8"
                  style={{ height: "50px", width: "auto" }}
                />
              ))}
            </div>
            
            {/* Zweiter identischer Satz für nahtlose Schleife */}
            <div className="ticker-content">
              {Array(10).fill(null).map((_, i) => (
                <img
                  key={`sponsor-2-${i}`}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Celonis_Logo.png/1280px-Celonis_Logo.png"
                  alt="Celonis Logo"
                  className="mx-8"
                  style={{ height: "50px", width: "auto" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games-section" className="bg-white pt-14 pb-6 w-screen overflow-hidden relative">
        <SectionDivider title="Unsere Spiele Challenge" />
        <div className="container mx-auto px-4">
          <p className="text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto">
            Löse die folgenden Spiele und reiche deine Ergebnisse ein, um am Gewinnspiel teilzunehmen.
            Basierend auf deinen Ergebnissen erhöht sich deine Gewinnwahrscheinlichkeit.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Spiele Cards mit Accordion */}
            <div className="lg:col-span-2 space-y-6">
              <Accordion 
                type="single" 
                collapsible 
                className="space-y-6"
                onValueChange={(value) => {
                  const newOpenItems: {[key: string]: boolean} = {};
                  games.forEach((_, idx) => {
                    newOpenItems[`game${idx+1}`] = `game${idx+1}` === value;
                  });
                  setOpenItems(newOpenItems);
                }}
              >
                {games.map((game, index) => (
                  <Card key={index} className="overflow-hidden accordion-card">
                    <div 
                      className={`border-l-4 ${game.completed ? 'border-green-500' : 'border-[#993333]'}`}
                    >
                      <AccordionItem value={`game${index+1}`} className="border-none">
                        <div className="flex items-center p-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 
                            ${game.completed ? "bg-green-500 text-white" : "border-2 border-[#993333]"}`}
                          >
                            {game.completed ? <Check className="h-5 w-5" /> : null}
                          </div>
                          
                          <CardHeader className="p-0 flex-1">
                            <CardTitle className="text-2xl">{game.title}</CardTitle>
                          </CardHeader>
                          
                          <AccordionTrigger className="accordion-trigger px-2">
                            {/* Benutzerdefiniertes animiertes Icon */}
                            <div className="h-8 w-8 flex items-center justify-center relative custom-accordion-icon">
                              <motion.span 
                                className="absolute h-0.5 w-5 bg-black"
                                initial={{ y: -2.5 }}
                                animate={{ 
                                  rotate: openItems[`game${index+1}`] ? 45 : 0, 
                                  y: openItems[`game${index+1}`] ? 0 : -2.5
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              />
                              <motion.span 
                                className="absolute h-0.5 w-5 bg-black"
                                initial={{ y: 2.5 }}
                                animate={{ 
                                  rotate: openItems[`game${index+1}`] ? -45 : 0, 
                                  y: openItems[`game${index+1}`] ? 0 : 2.5
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              />
                            </div>
                          </AccordionTrigger>
                        </div>
                        
                        <AccordionContent className="pt-0 px-4 pb-6">
                          <CardContent className="p-0">
                            {/* Spielinhalt */}
                            {game.id === 1 && (
                              <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                                <img
                                  src="/placeholder.svg?height=400&width=800"
                                  alt="Wimmelbild"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            
                            {game.id === 2 && (
                              <div className="flex justify-center">
                                <iframe
                                  width="100%"
                                  height="600"
                                  style={{ border: "none", maxWidth: "800px" }}
                                  frameBorder="0"
                                  src="https://crosswordlabs.com/embed/2025-02-24-879"
                                ></iframe>
                              </div>
                            )}
                            
                            {game.id === 3 && (
                              <div className="space-y-4">
                                <p className="text-lg">
                                  Wie viele Studierende gibt es aktuell an der RWTH Aachen?
                                </p>
                                <Input type="number" placeholder="Ihre Schätzung" className="max-w-xs" />
                              </div>
                            )}
                          </CardContent>
                          
                          <CardFooter className="pt-4 px-0 pb-0">
                            <Button 
                              onClick={() => markGameAsCompleted(game.id)} 
                              className="bg-[#993333] hover:bg-[#993333]/90"
                            >
                              Spiel abschließen
                            </Button>
                          </CardFooter>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  </Card>
                ))}
              </Accordion>
            </div>

            {/* Einreichung und Timeline */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Teilnahme einreichen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="Vorname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <Input placeholder="Nachname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <Input
                      type="email"
                      placeholder="E-Mail Adresse"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Mit dem Einreichen meiner Lösungen bestätige ich, dass mich Academy Consult mit einer
                      Rückmeldung zum Gewinnspiel benachrichtigen darf.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-[#993333] hover:bg-[#993333]/90"
                    disabled={!allGamesCompleted}
                  >
                    Lösungen einreichen
                  </Button>
                </CardFooter>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Fortschritt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {games.map((game, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center 
                          ${game.completed ? "bg-green-500 text-white" : "border border-gray-300 bg-gray-100"}`}>
                          {game.completed ? (
                            <ArrowRight className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <p className={game.completed ? "text-green-500" : "text-gray-500"}>
                          {game.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Event-Sektion – Hintergrund weiß */}
      <section id="events-section" className="bg-white py-12 md:py-24">
        <SectionDivider title="Deine Next Steps" />
        <div className="container mx-auto px-4 mt-12">
          <SwiperEventCarousel events={events} />
        </div>
      </section>

      {/* Footer mit Header-Hintergrundbild */}
      <footer className="text-white py-12"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-80 transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="text-center">
              <p>© 2024 AC Game Gewinnspiel. Alle Rechte vorbehalten.</p>
              <p className="mt-2">Ein Projekt der Academy Consult</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
