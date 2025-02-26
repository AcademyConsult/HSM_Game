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
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://spreadly.app/storage/view/-/984a834393716c80e787b227b43cfbe2/avatars/28/TiugXb12LRXMJmTEvyHSDxOH09U0rK0wv3D1OEPB.png" 
              alt="Academy Consult Logo" 
              className="h-24 w-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-center">Willkommen</h1>
          </div>
          <div className="mt-6">
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
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <img 
                src="https://spreadly.app/storage/view/-/984a834393716c80e787b227b43cfbe2/avatars/28/TiugXb12LRXMJmTEvyHSDxOH09U0rK0wv3D1OEPB.png" 
                alt="Academy Consult Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            <div className="text-center mb-8">
              <p className="text-lg font-medium mb-2">Folge uns auf:</p>
              <div className="flex space-x-6 justify-center">
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/academy-consult/mycompany/" target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                
                {/* YouTube */}
                <a href="https://www.youtube.com/channel/UCCJetCDqnmoOtOuE5hv0Z1Q" target="_blank" rel="noopener noreferrer" 
                  className="hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                  </svg>
                </a>
                
                {/* Facebook */}
                <a href="https://de-de.facebook.com/AcademyConsult" target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
                  </svg>
                </a>
                
                {/* Instagram */}
                <a href="https://instagram.com/academy.consult" target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                  </svg>
                </a>
                
                {/* Website */}
                <a href="https://academyconsult.de/" target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="text-sm opacity-80">
              © {new Date().getFullYear()} Academy Consult. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
