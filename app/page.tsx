'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { SwiperEventCarousel } from '@/components/ui/SwiperEventCarousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Terminal } from 'lucide-react';
import CoffeeChats from './CoffeeChats';
import type { CoffeeProfile } from './CoffeeChatCarousel';
import type { Swiper as SwiperType } from 'swiper';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

// Typdefinition für AccordionRenderProps
type AccordionRenderProps = {
  open: boolean;
};

type MotionSpanProps = HTMLMotionProps<'span'> & {
  className: string;
  animate: {
    rotate: number;
    y: number;
  };
  transition: {
    duration: number;
  };
};

// Wrapper-Komponente für reCAPTCHA v3
function ChallengeApp() {
  const [mobileSwiper, setMobileSwiper] = useState<SwiperType | null>(
    null
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [openItems, setOpenItems] = useState<{
    [key: string]: boolean;
  }>({ game1: true });
  const [consentGiven, setConsentGiven] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [estimationFeedback, setEstimationFeedback] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [estimationValue, setEstimationValue] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    left: string;
    top: string;
  } | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [wimmelbildAlert, setWimmelbildAlert] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [estimationError, setEstimationError] = useState<
    string | null
  >(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const imageBaseUrl = '';
  const placeholderImage = `${imageBaseUrl}/placeholder.svg`;

  const prizes = [
    {
      position: '1',
      title: 'Hauptpreis',
      description: 'Tiny House Trip von Raus.Life',
      image: '/221102_Raus_Cabins_Alt_Kentzlin_0003_HDR_HiRes.jpg',
      image2: '/230912_RAUS_Lenzen_1584.jpg',
    },
    {
      position: '2',
      title: 'Zweiter Preis',
      description: '2 × 100 € Amazon Gutschein',
      image: '/Amazon gutschein.png',
    },
    {
      position: '3',
      title: 'Dritter Preis',
      description: 'Semesterticket für die Boulderwelt',
      image: '/Boulderwelt Bild.jpg',
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Case Workshop',
      date: '2026-04-15',
      time: '20:00-21:00',
      location: 'AC Büro, Leopoldstraße 62',
      description:
        'Lerne im Case Workshop, wie du knifflige Business Cases strukturiert und überzeugend löst.',
      eventbride: 'https://luma.com/gggo9w72',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/m7/cc904003-e5aa-4a5a-9e96-87a70d6f36b9.png',
    },
    {
      id: 2,
      title: 'Digitaler Infoabend',
      date: '2026-04-16',
      time: '18:00-19:00',
      location: 'Online',
      description:
        'Lerne Academy Consult bequem von zu Hause aus kennen und stelle deine Fragen im digitalen Infoabend.',
      eventbride: 'https://luma.com/7hur5ig6',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/x4/232b7986-33f1-4753-928d-84910cd55dd8.png',
    },
    {
      id: 3,
      title: 'AC Run Club',
      date: '2026-04-17',
      time: '11:00-12:30',
      location: 'München',
      description:
        'Lauf mit uns! Beim AC Run Club lernst du das Team kennen und startest sportlich in den Tag.',
      eventbride: 'https://luma.com/bv25uxay',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/y7/c0802c16-d438-4337-906f-70e71f2506d1',
    },
    {
      id: 4,
      title: 'Open Büro Day',
      date: '2026-04-18',
      time: '13:00-17:00',
      location: 'AC Büro, Leopoldstraße 62',
      description:
        'Schau bei uns im Büro vorbei, lerne das Team kennen und erhalte einen Eindruck von unserer Arbeitsweise.',
      eventbride: 'https://luma.com/axdrxl30',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/0j/d8aeea63-be66-4dff-afc5-216fa740189f',
    },
    {
      id: 5,
      title: 'Yoga',
      date: '2026-04-19',
      time: '11:00-12:00',
      location: 'München',
      description:
        'Entspann dich mit uns bei einer gemeinsamen Yoga-Session und lerne das AC-Team auf andere Art kennen.',
      eventbride: 'https://luma.com/8ykfr9n1',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/v3/4a4a9c1b-eba8-4447-be65-f6b3c4b0a97c.png',
    },
    {
      id: 6,
      title: 'Reformer Pilates – Female Only',
      date: '2026-04-20',
      time: '10:00-11:00',
      location: 'Reformer For Her, Augustenstraße 102',
      description:
        'Beweg dich mit uns und lerne das AC-Team bei einer gemeinsamen Pilates-Session kennen.',
      eventbride: 'https://luma.com/irfwinah',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/z1/d80a77db-201a-496f-8be5-be23a61cd7a8.png',
    },
    {
      id: 7,
      title: 'TUM Infoabend',
      date: '2026-04-21',
      time: '19:00-20:00',
      location: 'TUM, Arcisstraße 21, Raum 0601',
      description:
        'Erfahre alles über Academy Consult direkt an der TUM. Wir stellen uns vor und beantworten deine Fragen.',
      eventbride: 'https://luma.com/lxruosv1',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/ve/ab94b70b-d954-410a-b686-1a32c74a4d75.png',
    },
    {
      id: 8,
      title: 'Bewerbertraining',
      date: '2026-04-22',
      time: '16:00-17:00',
      location: 'AC Büro, Leopoldstraße 62',
      description:
        'Wir zeigen dir, wie der Bewerbungsprozess bei uns läuft und wie du ihn rockst!',
      eventbride: 'https://luma.com/f8fq8pat',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/yd/c8ded50f-24e7-4af0-aeb2-9bac97712e4c.png',
    },
    {
      id: 9,
      title: 'Digitaler Infoabend',
      date: '2026-04-22',
      time: '18:00-19:00',
      location: 'Online',
      description:
        'Lerne Academy Consult bequem von zu Hause aus kennen und stelle deine Fragen im digitalen Infoabend.',
      eventbride: 'https://luma.com/n91do9ao',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/x4/232b7986-33f1-4753-928d-84910cd55dd8.png',
    },
    {
      id: 10,
      title: 'LMU Infoabend',
      date: '2026-04-23',
      time: '18:00-19:00',
      location: 'LMU, Hörsaal A 119, Geschwister-Scholl-Platz 1',
      description:
        'Erfahre alles über Academy Consult direkt an der LMU. Wir stellen uns vor und beantworten deine Fragen.',
      eventbride: 'https://luma.com/d3jacmr3',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/ve/ab94b70b-d954-410a-b686-1a32c74a4d75.png',
    },
    {
      id: 11,
      title: 'Barhopping',
      date: '2026-04-24',
      time: '21:00-00:00',
      location: 'München',
      description:
        'Lerne uns bei einem kalten Getränk kennen! Barhopping durch München mit dem AC-Team.',
      eventbride: 'https://luma.com/2bhttjz9',
      image: 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/gallery-images/0o/62834236-cf11-42a2-9144-5af45da3348b',
    },
  ];

  const coffeeProfiles: CoffeeProfile[] = [
    {
      displayName: 'Katharina',
      degreeProgram: 'BWL',
      stage: 'Bachelor',
      university: 'HM',
      currentSemester: 2,
      imageLink: '/KatharinaBildLAP.jpg',
      calendarLink: 'https://calendly.com/katharina-barr17/30min',
      linkedinLink: 'https://www.linkedin.com/in/katharina-barr',
    },
    {
      displayName: 'Fabian',
      degreeProgram: 'TUM-BWL',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 4,
      imageLink: '/FabianBildLAP.jpg',
      calendarLink: 'https://calendly.com/fabian-kienreich/30min',
      linkedinLink: 'https://www.linkedin.com/in/fabian-kienreich/',
    },
    {
      displayName: 'Paul',
      degreeProgram: 'Robotics, Cognition, Intelligence',
      stage: 'Master',
      university: 'TUM',
      currentSemester: 1,
      imageLink: '/PaulBildLAP.jpg',
      calendarLink: 'https://calendly.com/paul-wirth-luzc/30min',
      linkedinLink: 'https://www.linkedin.com/in/paul-wirth',
    },
    {
      displayName: 'Linus',
      degreeProgram: 'Management & Technology',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 4,
      imageLink: '/LinusBildLAP.jpg',
      calendarLink: 'https://calendly.com/linus-j-klett/30min',
      linkedinLink: 'https://www.linkedin.com/in/linusjklett',
    },
    {
      displayName: 'Philipp',
      degreeProgram: 'Management & Technology',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 4,
      imageLink: `${imageBaseUrl}/Philipp.jpeg`,
      calendarLink: 'https://calendly.com/philipp-liebold/ac',
      linkedinLink: 'https://www.linkedin.com/in/philipp-liebold/',
    },
    {
      displayName: 'Lorenz',
      degreeProgram: 'B.Sc. Engineering Science',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 4,
      imageLink: '/LorenzBildLAP.jpg',
      calendarLink: 'https://calendly.com/lorenz-thieroff/30min',
      linkedinLink: 'https://www.linkedin.com/in/lorenz-thieroff',
    },
    // {
    //   displayName: 'Annalena',
    //   degreeProgram: 'Management & Technology',
    //   stage: 'Bachelor',
    //   university: 'TUM',
    //   currentSemester: 6,
    //   imageLink: `${imageBaseUrl}/Annalena.jpg`,
    //   calendarLink: 'https://calendly.com/annalena-pellkofer-academyconsult/30min',
    //   linkedinLink: 'https://www.linkedin.com/in/annalena-plk/',
    // },
    {
      displayName: 'Anna',
      degreeProgram: 'Rechtswissenschaften',
      stage: 'Bachelor',
      university: 'LMU',
      currentSemester: 4,
      imageLink: '/AnnaKKBildLAP.jpg',
      calendarLink: 'https://calendly.com/anna-kahlert-academyconsult/30min',
      linkedinLink: 'https://www.linkedin.com/in/anna-katharina-kahlert-07046a29b',
    },
    {
      displayName: 'Leon',
      degreeProgram: 'Management & Technology',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 6,
      imageLink: '/LeonBildLAP.jpg',
      calendarLink: 'https://calendly.com/thumm-leon/30min',
      linkedinLink: 'https://www.linkedin.com/in/leon-thumm/',
    },
    {
      displayName: 'Anna',
      degreeProgram: 'Management & Technology',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 4,
      imageLink: '/AnnaBildLAP.jpg',
      calendarLink: 'https://calendly.com/anna-krieger-academyconsult/30min',
      linkedinLink: 'https://www.linkedin.com/in/anna-krieger-45128830b',
    },
    {
      displayName: 'Johannes',
      degreeProgram: 'Management and Technology',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 4,
      imageLink: `${imageBaseUrl}/Johannes.jpg`,
      calendarLink: 'https://calendly.com/johannes-kask-academyconsult/30min',
      linkedinLink: 'https://www.linkedin.com/in/jkask',
    },
    {
      displayName: 'Valentin',
      degreeProgram: 'Wirtschaftsinformatik',
      stage: 'Bachelor',
      university: 'TUM',
      currentSemester: 7,
      imageLink: '/ValentinBildLap.jpg',
      //calendarLink: 'https://calendly.com/academy-consult-munich/coffee-chat',
      linkedinLink: 'https://www.linkedin.com/in/valentin-gr%C3%BCner',
    },
    {
      displayName: 'Noah',
      degreeProgram: 'Wirtschaftsinformatik',
      stage: 'Master',
      university: 'TUM',
      currentSemester: 1,
      imageLink: '/Noah_Straube.jpg',
      calendarLink: 'https://calendly.com/noahstraube/30min',
      linkedinLink: 'https://www.linkedin.com/in/noah-straube-b2356326b',
    },
  ];

  const [games, setGames] = useState([
    {
      id: 1,
      title: 'Wimmelbild: Finde Leo den Löwen (einfach)',
      completed: false,
    },
    {
      id: 2,
      title: 'Multiple Choice Quiz (medium)',
      completed: false,
    },
    {
      id: 3,
      title: 'Estimation Case (hard)',
      completed: false,
    },
  ]);

  // Neue State-Variablen für das Multiple-Choice-Quiz
  const [quizAnswers, setQuizAnswers] = useState<{
    question1: string | null;
    question2: string | null;
  }>({
    question1: null,
    question2: null,
  });
  const [quizFeedback, setQuizFeedback] = useState<{
    title: string;
    description: string;
    type: 'warning' | 'success' | 'error';
  } | null>(null);

  const allGamesCompleted = games.every((game) => game.completed);

  const markGameAsCompleted = (gameId: number) => {
    setGames(
      games.map((game) =>
        game.id === gameId ? { ...game, completed: true } : game
      )
    );
  };

  // Berechnung der Anzahl an Platzhaltern, sodass (events.length + Platzhalter) ein Vielfaches von 3 ist
  const eventPlaceholders =
    events.length % 3 === 0 ? 0 : 3 - (events.length % 3);

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
      setActiveEventIndex(
        Math.min(
          Math.floor(index / 3),
          Math.ceil(events.length / 3) - 1
        )
      );
    };

    container.addEventListener('scroll', handleScroll);
    return () =>
      container.removeEventListener('scroll', handleScroll);
  }, [events.length]);

  // Überprüfung für beide Bedingungen (Spiele abgeschlossen und Einwilligung gegeben)
  const canSubmit = allGamesCompleted && consentGiven;

  // Funktion zum Verarbeiten der Einreichung
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    if (!executeRecaptcha) {
      setSubmitError(
        'reCAPTCHA konnte nicht geladen werden. Bitte laden Sie die Seite neu.'
      );
      return;
    }

    // Validieren, dass alle erforderlichen Felder ausgefüllt sind
    if (
      !firstName ||
      !lastName ||
      !email ||
      estimationValue === null
    ) {
      setSubmitError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    // Einreichung starten
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // reCAPTCHA v3 Token im Hintergrund abrufen
      const captchaToken = await executeRecaptcha('form_submit');

      // Submission Payload erstellen
      const payload = {
        email: email,
        vorname: firstName,
        nachname: lastName,
        schaetzwert: estimationValue,
        captchaToken: captchaToken, // Token zum Payload hinzufügen
        HatWerbungAboniert: newsletterOptIn,
      };
      const response = await fetch('/api/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Erfolgreiche Einreichung
        setSubmitSuccess(true);

        // Formular zurücksetzen
        setFirstName('');
        setLastName('');
        setEmail('');
        setConsentGiven(false);
        setNewsletterOptIn(false);
        setQuizAnswers({ question1: null, question2: null });
        setQuizFeedback(null);
        setGames((prevGames) =>
          prevGames.map((game) => ({ ...game, completed: false }))
        );
        setOpenItems({ game1: true });
        setMarkerPosition(null);
        setSelectedCoordinates(null);
        setIncorrectAttempts(0);
        setWimmelbildAlert(null);
        setEstimationValue(null);
        setEstimationFeedback(null);
        setEstimationError(null);
      } else {
        // Fehler bei der Einreichung
        const errorData = await response.text();

        // Spezifische Fehlermeldung für bereits teilgenommene E-Mail
        if (
          errorData.includes('This email has already taken part.')
        ) {
          setSubmitError(
            'Diese E-Mail hat bereits an der Challenge teilgenommen.'
          );
        } else {
          setSubmitError(
            `Fehler beim Einreichen, überprüfe deine Daten und versuche es erneut.`
          );
          //setSubmitError(`Fehler beim Einreichen: ${errorData || response.statusText}`);
        }
      }
    } catch (error) {
      setSubmitError(
        `Netzwerkfehler: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aktualisiere den Schätzwert, nur für numerische Eingaben
  const handleEstimationChange = (value: string) => {
    // Wenn leer, auf null setzen
    if (value === '') {
      setEstimationValue(null);
      return;
    }

    // Nur gültige Zahlen akzeptieren
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setEstimationValue(numValue);
    }
  };

  const wimmelbildRef = useRef<HTMLDivElement>(null);

  const handleWimmelbildClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!wimmelbildRef.current) return;

    const rect = wimmelbildRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    setMarkerPosition({
      left: `${clickX * 100}%`,
      top: `${clickY * 100}%`,
    });

    setSelectedCoordinates({ x: clickX, y: clickY }); // Speichere die tatsächlichen Klickkoordinaten
  };

  // Funktion zum Überprüfen, ob die ausgewählte Position korrekt ist
  const checkWimmelbildSolution = () => {
    if (!selectedCoordinates) {
      setWimmelbildAlert({
        title: 'Bitte wählen Sie einen Punkt',
        description:
          'Bitte wähle zuerst einen Punkt auf dem Bild aus.',
      });
      return false;
    }

    // Leo ist ca. 6.5% von rechts und 38% von unten
    const targetX = 1 - 0.055; // 0.945 von links
    const targetY = 1 - 0.333;  // 0.667 von oben

    console.log('Klickposition:', {
      x: selectedCoordinates.x.toFixed(4),
      y: selectedCoordinates.y.toFixed(4),
    });
    console.log('Zielposition:', {
      x: targetX.toFixed(4),
      y: targetY.toFixed(4),
    });

    // Toleranzbereich für höhere Genauigkeit
    const tolerance = 0.04; // ~4 % Toleranz pro Achse

    // Berechne den Abstand für bessere Diagnose
    const distanceX = Math.abs(selectedCoordinates.x - targetX);
    const distanceY = Math.abs(selectedCoordinates.y - targetY);
    console.log('Abstand:', {
      x: distanceX.toFixed(4),
      y: distanceY.toFixed(4),
      tolerance: tolerance.toFixed(4),
    });

    const isCorrectX = distanceX <= tolerance;
    const isCorrectY = distanceY <= tolerance;
    const isCorrect = isCorrectX && isCorrectY;

    console.log('Treffer X:', isCorrectX, 'Treffer Y:', isCorrectY);
    console.log('Ist korrekt:', isCorrect);

    if (isCorrect) {
      markGameAsCompleted(1);
      return true;
    } else {
      // Falsche Antwort
      setIncorrectAttempts((prev) => prev + 1);

      // Feedback anzeigen
      setWimmelbildAlert({
        title: 'Leider nicht richtig',
        description:
          'Versuche es noch einmal! Der Löwe ist gut versteckt.',
      });
      return false;
    }
  };

  // Modifizierte Version der markGameAsCompleted für Spiel 1 mit Überprüfung
  const handleGameCompletion = (gameId: number) => {
    if (gameId === 1) {
      const isCorrect = checkWimmelbildSolution();

      // Wenn die Lösung korrekt ist, zeige einen Erfolgs-Alert an
      if (isCorrect) {
        setWimmelbildAlert({
          title: 'Super! Lösung gefunden',
          description: 'Du hast Leo den Löwen gefunden!',
        });
        markGameAsCompleted(1);
      }
    } else if (gameId === 2) {
      // Quiz überprüfen statt direkt markieren
      checkQuizAnswers();
    } else if (gameId === 3) {
      // Für Spiel 3 prüfen, ob eine Schätzung eingegeben wurde
      if (estimationValue === null) {
        // Zeige Warnung nur bei Game 3
        setEstimationError('Bitte gib eine Schätzung ein!');
        return;
      }

      // Schätzung wurde eingegeben, markiere Spiel als abgeschlossen
      markGameAsCompleted(3);

      // Wenn das Spiel bereits abgeschlossen ist, zeige Feedback zum aktuellen Schätzwert
      if (games.find((g) => g.id === 3)?.completed) {
        setEstimationFeedback({
          title: 'Schätzwert aktualisiert',
          description: `Dein aktueller Schätzwert: ${estimationValue} Start-ups`,
        });
      } else {
        setEstimationFeedback({
          title: 'Schätzwert gespeichert',
          description: `Dein Schätzwert: ${estimationValue} Start-ups`,
        });
      }

      // Fehler zurücksetzen, wenn die Schätzung erfolgreich war
      setEstimationError(null);
    }
  };

  // Funktion zum Überprüfen der Quiz-Antworten
  const checkQuizAnswers = () => {
    // Richtige Antworten: 1. Frage: C, 2. Frage: C, 3. Frage: A
    const correctAnswers = {
      question1: 'C',
      question2: 'B',
    };

    // Prüfen, ob alle Fragen beantwortet wurden
    if (!quizAnswers.question1 || !quizAnswers.question2) {
      setQuizFeedback({
        title: 'Bitte beantworten Sie alle Fragen',
        description: 'Beide Fragen müssen beantwortet werden.',
        type: 'warning',
      });
      return false;
    }

    // Prüfen, ob die Antworten richtig sind
    const question1Correct =
      quizAnswers.question1 === correctAnswers.question1;
    const question2Correct =
      quizAnswers.question2 === correctAnswers.question2;
    const allCorrect = question1Correct && question2Correct;

    if (allCorrect) {
      setQuizFeedback({
        title: 'Super! Lösung gefunden',
        description: 'Alle Antworten sind richtig!',
        type: 'success',
      });
      markGameAsCompleted(2);
      return true;
    } else {
      const incorrectQuestions: string[] = [];
      if (!question1Correct) incorrectQuestions.push('Frage 1');
      if (!question2Correct) incorrectQuestions.push('Frage 2');

      setQuizFeedback({
        title: 'Leider nicht richtig',
        description: `Folgende Fragen sind nicht richtig beantwortet: ${incorrectQuestions.join(
          ', '
        )}`,
        type: 'error',
      });
      return false;
    }
  };

  // Füge diese Scroll-Funktion zu den anderen Funktionen hinzu
  const scrollToFooter = () => {
    document
      .querySelector('footer')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation für Sponsorensektion - optimierte Version
  useEffect(() => {
    const tickerTrack = document.querySelector(
      '[data-mobile-animation]'
    );

    if (!tickerTrack) return;

    // Bestehende Animationen entfernen
    tickerTrack.classList.remove(
      'animate-ticker',
      'animate-ticker-fast'
    );

    // Animation basierend auf Gerät setzen
    const setAnimation = () => {
      const isMobile = window.innerWidth < 768;

      // Sanfter Wechsel durch Entfernen der alten Animation
      tickerTrack.classList.remove(
        'animate-ticker',
        'animate-ticker-fast'
      );

      // Kurze Verzögerung für flüssigeren Übergang
      requestAnimationFrame(() => {
        tickerTrack.classList.add(
          isMobile ? 'animate-ticker-fast' : 'animate-ticker'
        );
      });
    };

    // Initiale Einstellung
    setAnimation();

    // Debounced Resize-Event
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setAnimation, 250);
    };

    window.addEventListener('resize', handleResize);

    // Browser Visibility API nutzen, um Animation zu pausieren/fortzusetzen
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tickerTrack.classList.add('paused');
      } else {
        tickerTrack.classList.remove('paused');
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  // Berechnung der bisher gesammelten Tickets
  const completedTickets =
    (games[0].completed ? 20 : 0) +
    (games[1].completed ? 20 : 0) +
    (games[2].completed ? Math.min(60, estimationValue || 0) : 0);

  return (
    <main className="min-h-screen">
      {/* Landing Section (behält individuellen Hintergrund) */}
      <section
        className="min-h-[600px] relative flex items-center"
        style={{
          backgroundImage:
            'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-24 text-white">
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://spreadly.app/storage/view/-/984a834393716c80e787b227b43cfbe2/avatars/28/TiugXb12LRXMJmTEvyHSDxOH09U0rK0wv3D1OEPB.png"
              alt="Academy Consult Logo"
              className="h-32 md:h-48 w-auto mb-6"
            />
          </div>
          <div className="mt-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                Willkommen zur
                <br />
                Academy Consult Challenge
              </h1>
              <p className="text-lg md:text-xl">
                Denkst du du hast das Zeug zum Gewinner? Beweise es!
                <br /> Löse die Spiele und gewinne tolle Preise zum
                Semesterstart.
              </p>
            </div>
            <div className="mt-20">
              {/* Desktop-Ansicht: Preise nebeneinander */}
              <div className="hidden md:flex flex-row items-center justify-center gap-4 md:gap-8 px-4">
                {/* 2. Preis - links */}
                <Card
                  key="prize-2"
                  className="bg-white/10 backdrop-blur-md text-white border-none shadow-[4px_6px_10px_rgba(0,0,0,0.15)] w-full sm:w-1/2 md:w-1/4 h-auto md:h-[380px] transform transition-transform hover:scale-105 duration-300"
                >
                  <CardHeader className="relative pb-0 pt-6">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r bg-gradient-to-r from-[#C0C0C0] to-[#E8E8E8] text-gray-800 px-4 py-1 rounded-full shadow-md">
                      <span className="font-bold">2. Preis</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center pt-4">
                    <h3 className="text-xl font-semibold text-center mb-3">
                      {prizes[1].description}
                    </h3>
                    <p className="text-center text-white/80 mb-4">
                      Exklusiv von E-Fellows für deinen nächsten
                      Amazon-Einkauf 🛒
                    </p>
                    <div className="w-full relative mt-6" style={{ minHeight: '160px' }}>
                      <img
                        src={prizes[1].image}
                        alt={prizes[1].title}
                        className="absolute left-2 top-0 w-2/3 h-auto max-h-40 object-contain rounded-xl shadow-lg"
                        style={{ transform: 'rotate(-4deg)' }}
                      />
                      <img
                        src={prizes[1].image}
                        alt={`${prizes[1].title} 2`}
                        className="absolute right-2 top-4 w-2/3 h-auto max-h-40 object-contain rounded-xl shadow-lg"
                        style={{ transform: 'rotate(3deg)' }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 1. Preis - mitte (größer) */}
                <Card
                  key="prize-1"
                  className="bg-white/15 backdrop-blur-md text-white border-none shadow-[4px_6px_15px_rgba(0,0,0,0.2)] w-full sm:w-11/12 md:w-1/3 h-auto md:h-[480px] transform transition-transform hover:scale-105 duration-300 z-10"
                >
                  <CardHeader className="relative pb-0 pt-8">
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#ffd700] to-[#ffec8b] text-gray-800 px-6 py-2 rounded-full shadow-md">
                      <span className="font-bold text-lg">
                        1. Preis
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-6 h-full">
                    <h3 className="text-2xl font-bold text-center mb-3">
                      {prizes[0].description}
                    </h3>
                    <p className="text-center text-white/80 mb-6">
                      2 Nächte für 2 Personen in einer Cabin nach Wahl, einlösbar bis 31.12.2026 🏡
                    </p>
                    <div className="flex-1 w-full relative mt-4" style={{ minHeight: '220px' }}>
                      <img
                        src={prizes[0].image}
                        alt={prizes[0].title}
                        className="absolute left-2 top-0 w-2/3 h-auto max-h-56 object-cover rounded-xl shadow-lg"
                        style={{ transform: 'rotate(-4deg)' }}
                      />
                      <img
                        src={(prizes[0] as any).image2}
                        alt={`${prizes[0].title} 2`}
                        className="absolute right-2 top-8 w-2/3 h-auto max-h-56 object-cover rounded-xl shadow-lg"
                        style={{ transform: 'rotate(3deg)' }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 3. Preis - rechts */}
                <Card
                  key="prize-3"
                  className="bg-white/10 backdrop-blur-md text-white border-none shadow-[4px_6px_10px_rgba(0,0,0,0.15)] w-full sm:w-1/2 md:w-1/4 h-auto md:h-[380px] transform transition-transform hover:scale-105 duration-300"
                >
                  <CardHeader className="relative pb-0 pt-6">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#cd7f32] to-[#dea47e] text-white px-4 py-1 rounded-full shadow-md">
                      <span className="font-bold">3. Preis</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center pt-4">
                    <h3 className="text-xl font-semibold text-center mb-3">
                      {prizes[2].description}
                    </h3>
                    <p className="text-center text-white/80 mb-4">
                      Die perfekte Möglichkeit einfach mal Bouldern zu gehen 🧗
                    </p>
                    <div className="w-full mt-2 flex items-center justify-center">
                      <img
                        src={prizes[2].image || placeholderImage}
                        alt={prizes[2].title}
                        className="w-auto max-w-[90%] max-h-36 object-contain rounded-xl mx-auto"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Weitere Preise */}
              {/* Weitere Preise - ohne Ranking */}
              <div className="hidden md:block mt-14 px-4 container mx-auto max-w-5xl">
                <h3 className="text-2xl font-bold text-white text-center mb-6">... und noch viele weitere Preise</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-[4px_6px_10px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-colors duration-200">
                    <img src="/HerSpaceStudio_cropped.png" alt="Reformer for Her" className="w-full h-24 object-cover" />
                    <div className="px-4 pb-4 text-center">
                      <p className="font-semibold text-sm">10 × 100 % Gutschein Reformer Pilates</p>
                      <p className="text-xs text-white/70 mt-1">Reformer for Her</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-[4px_6px_10px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-colors duration-200">
                    <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                      <img src="/6_Redbull.png" alt="Red Bull" className="h-20 w-auto object-contain" />
                    </div>
                    <div className="px-4 pb-4 text-center">
                      <p className="font-semibold text-sm">14 × 1 Tray Red Bull</p>
                      <p className="text-xs text-white/70 mt-1">Für den Extra-Boost</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-[4px_6px_10px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-colors duration-200">
                    <img src="/HabitusHeaderBild.webp" alt="Habitus" className="w-full h-24 object-cover" />
                    <div className="px-4 pb-4 text-center">
                      <p className="font-semibold text-sm">3 × Malen nach Zahlen Bild</p>
                      <p className="text-xs text-white/70 mt-1">Habitus</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-[4px_6px_10px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-colors duration-200">
                    <img src="/kunsthalle-munchen.jpg" alt="Kunsthalle München" className="w-full h-24 object-cover" />
                    <div className="px-4 pb-4 text-center">
                      <p className="font-semibold text-sm">15 × Gutschein Kunsthalle München</p>
                      <p className="text-xs text-white/70 mt-1">Kunst & Kultur</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-Ansicht: Preise im Carousel */}

              <div className="md:hidden px-4">
                {/* Fixer Container für konsistente Höhe, sodass alle Preise vertikal zentriert angezeigt werden */}
                <Swiper
                  initialSlide={0}
                  spaceBetween={20}
                  slidesPerView={1}
                  centeredSlides
                  onSwiper={setMobileSwiper}
                  onSlideChange={(swiper) =>
                    setActiveSlide(swiper.activeIndex)
                  }
                  style={{ height: '500px' }}
                >
                  {/* Navigationspfeile für mobile Ansicht - nur anzeigen wenn nötig */}
                  <div
                    className={`absolute top-1/2 left-2 z-10 transform -translate-y-1/2 ${
                      activeSlide === 0 ? 'hidden' : ''
                    }`}
                  >
                    <Button
                      className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
                      onClick={() => mobileSwiper?.slidePrev()}
                    >
                      <span className="text-2xl text-white">
                        &lt;
                      </span>
                    </Button>
                  </div>

                  <div
                    className={`absolute top-1/2 right-2 z-10 transform -translate-y-1/2 ${
                      mobileSwiper &&
                      activeSlide === mobileSwiper.slides.length - 1
                        ? 'hidden'
                        : ''
                    }`}
                  >
                    <Button
                      className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
                      onClick={() => mobileSwiper?.slideNext()}
                    >
                      <span className="text-2xl text-white">
                        &gt;
                      </span>
                    </Button>
                  </div>

                  <SwiperSlide>
                    <div className="flex items-center justify-center h-full">
                      <Card
                        key="prize-1"
                        className="overflow-visible bg-white/15 backdrop-blur-md text-white border-none shadow-[4px_6px_15px_rgba(0,0,0,0.2)] w-full h-[480px]"
                      >
                        <CardHeader className="relative pb-0 pt-8">
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#ffd700] to-[#ffec8b] text-gray-800 px-6 py-2 rounded-full shadow-md">
                            <span className="font-bold text-lg">
                              1. Preis
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-6">
                          <h3 className="text-xl font-semibold text-center mb-6">
                            {prizes[0].description}
                          </h3>
                          <p className="text-center text-white/80 mb-6">
                            2 Nächte für 2 Personen in einer Cabin nach Wahl, einlösbar bis 31.12.2026 🏡
                          </p>
                          <div className="w-full relative" style={{ height: '140px' }}>
                            <img
                              src={prizes[0].image}
                              alt={prizes[0].title}
                              className="absolute left-2 top-0 w-3/5 h-auto max-h-32 object-cover rounded-lg shadow-lg"
                              style={{ transform: 'rotate(-4deg)' }}
                            />
                            <img
                              src={(prizes[0] as any).image2}
                              alt={`${prizes[0].title} 2`}
                              className="absolute right-2 top-4 w-3/5 h-auto max-h-32 object-cover rounded-lg shadow-lg"
                              style={{ transform: 'rotate(3deg)' }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div className="flex items-center justify-center h-full">
                      <Card
                        key="prize-2"
                        className="overflow-visible bg-white/15 backdrop-blur-md text-white border-none shadow-[4px_6px_15px_rgba(0,0,0,0.2)] w-full h-[480px]"
                      >
                        <CardHeader className="relative pb-0 pt-8">
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#C0C0C0] to-[#E8E8E8] text-gray-800 px-6 py-2 rounded-full shadow-md">
                            <span className="font-bold text-lg">
                              2. Preis
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-6">
                          <h3 className="text-xl font-semibold text-center mb-6">
                            {prizes[1].description}
                          </h3>
                          <p className="text-center text-white/80 mb-6">
                            Exklusiv von E-Fellows – je 100 € für deinen nächsten Amazon-Einkauf 🛒
                          </p>
                          <div className="w-full relative" style={{ height: '140px' }}>
                            <img
                              src={prizes[1].image}
                              alt={prizes[1].title}
                              className="absolute left-2 top-0 w-3/5 h-auto max-h-32 object-contain rounded-lg shadow-lg"
                              style={{ transform: 'rotate(-4deg)' }}
                            />
                            <img
                              src={prizes[1].image}
                              alt={`${prizes[1].title} 2`}
                              className="absolute right-2 top-4 w-3/5 h-auto max-h-32 object-contain rounded-lg shadow-lg"
                              style={{ transform: 'rotate(3deg)' }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div className="flex items-center justify-center h-full">
                      <Card
                        key="prize-3"
                        className="overflow-visible bg-white/15 backdrop-blur-md text-white border-none shadow-[4px_6px_15px_rgba(0,0,0,0.2)] w-full h-[480px]"
                      >
                        <CardHeader className="relative pb-0 pt-8">
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#cd7f32] to-[#dea47e] text-white px-6 py-2 rounded-full shadow-md">
                            <span className="font-bold text-lg">
                              3. Preis
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-6">
                          <h3 className="text-xl font-semibold text-center mb-6">
                            {prizes[2].description}
                          </h3>
                          <p className="text-center text-white/80 mb-6">
                            Semesterticket oder Einzeltickets zum Klettern 🧗
                          </p>
                          <div className="w-full mt-5 mb-6 flex items-center justify-center">
                            <img
                              src={prizes[2].image}
                              alt={prizes[2].title}
                              className="w-auto max-w-[90%] max-h-36 object-cover rounded-xl mx-auto"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </SwiperSlide>

                </Swiper>
                <h3 className="text-xl font-bold text-white text-center mt-8 mb-4">... und noch viele weitere Preise</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center bg-white/15 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-lg">
                    <img src="/HerSpaceStudio_cropped.png" alt="Reformer for Her" className="w-full h-20 object-cover" />
                    <div className="px-3 py-3 text-center">
                      <p className="font-semibold text-xs">10 × Reformer Pilates</p>
                      <p className="text-xs text-white/70 mt-1">Reformer for Her</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center bg-white/15 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-lg">
                    <div className="w-full h-20 bg-gray-200 flex items-center justify-center">
                      <img src="/6_Redbull.png" alt="Red Bull" className="h-16 w-auto object-contain" />
                    </div>
                    <div className="px-3 py-3 text-center">
                      <p className="font-semibold text-xs">14 × 1 Tray Red Bull</p>
                      <p className="text-xs text-white/70 mt-1">Extra-Boost</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center bg-white/15 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-lg">
                    <img src="/HabitusHeaderBild.webp" alt="Habitus" className="w-full h-20 object-cover" />
                    <div className="px-3 py-3 text-center">
                      <p className="font-semibold text-xs">3 × Malen nach Zahlen</p>
                      <p className="text-xs text-white/70 mt-1">Habitus</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center bg-white/15 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-lg">
                    <img src="/kunsthalle-munchen.jpg" alt="Kunsthalle München" className="w-full h-20 object-cover" />
                    <div className="px-3 py-3 text-center">
                      <p className="font-semibold text-xs">15 × Gutschein Kunsthalle</p>
                      <p className="text-xs text-white/70 mt-1">Kunst & Kultur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsoren Sektion */}
      <section className="bg-white py-10 w-screen overflow-hidden relative">
        <SectionDivider title="Unsere Sponsoren" />

        {(() => {
          const sponsors = [
            { name: 'LAP Coffee', logo: '/LAP_Logo.png', hasLogo: true },
            { name: 'Red Bull', logo: '/redbull.svg', hasLogo: true },
            { name: 'Habitus', logo: '/230913_habitus_logo_orange.png', hasLogo: true },
            { name: 'e-fellows.net', logo: '/efellowslogoneu.png', hasLogo: true },
            { name: 'Raus.Life', logo: '/raus_logo_green.png', hasLogo: true },
            { name: 'Boulderwelt', logo: '/BW_logo_button.png', hasLogo: true },
            { name: 'Reformer for Her', logo: '/herspace-logo_hoch-earth.jpg', hasLogo: true },
            { name: 'Kunsthalle München', logo: '/KH_Logo_Master_1909_pos.png', hasLogo: true },
          ];

          const SponsorItem = ({ sponsor, keyPrefix }: { sponsor: typeof sponsors[0]; keyPrefix: string }) => (
            <div
              key={`${keyPrefix}-${sponsor.name}`}
              className="mx-8 flex-shrink-0 flex items-center justify-center"
              style={{ minWidth: '140px', transform: 'translateZ(0)' }}
            >
              {sponsor.hasLogo ? (
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} Logo`}
                  loading="eager"
                  className="object-contain"
                  style={{ height: sponsor.logoHeight || '60px', width: 'auto', maxWidth: '180px' }}
                />
              ) : (
                <div className="px-5 py-2 rounded-full border-2 border-[#993333]/30 text-[#993333] font-semibold text-sm whitespace-nowrap">
                  {sponsor.name}
                </div>
              )}
            </div>
          );

          return (
            <>
              {/* Mobile: Grid */}
              <div className="md:hidden container mx-auto mt-8 px-4">
                <div className="flex flex-wrap justify-center gap-4">
                  {sponsors.map((s) => (
                    <SponsorItem key={s.name} sponsor={s} keyPrefix="mobile" />
                  ))}
                </div>
              </div>

              {/* Desktop: Ticker */}
              <div className="hidden md:block ticker-container w-screen mt-12">
                <div className="ticker-track" data-mobile-animation>
                  <div className="ticker-content">
                    {[...sponsors, ...sponsors].map((s, i) => (
                      <SponsorItem key={`tick-a-${i}`} sponsor={s} keyPrefix={`tick-a-${i}`} />
                    ))}
                  </div>
                  <div className="ticker-content">
                    {[...sponsors, ...sponsors].map((s, i) => (
                      <SponsorItem key={`tick-b-${i}`} sponsor={s} keyPrefix={`tick-b-${i}`} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </section>
      {/* Games Section */}
      <section
        id="games-section"
        className="bg-white pt-14 pb-6 w-screen overflow-hidden relative"
      >
        <SectionDivider title="Die Challenge" />
        <div className="container mx-auto px-4">
          <p className="text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto">
            Löse{' '}
            <span className="text-[#993333] font-bold">
              bis zum 29.04.
            </span>{' '}
            die folgenden Spiele und reiche deine Ergebnisse ein, um
            am Gewinnspiel teilzunehmen. Basierend auf deinen
            Ergebnissen erhöht sich deine Gewinnwahrscheinlichkeit.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Spiele Cards mit Accordion */}
            <div className="lg:col-span-2 space-y-6">
              <Accordion
                type="single"
                collapsible
                className="space-y-6"
                defaultValue="game1"
                onValueChange={(value) => {
                  const newOpenItems: { [key: string]: boolean } = {};
                  games.forEach((_, idx) => {
                    newOpenItems[`game${idx + 1}`] =
                      `game${idx + 1}` === value;
                  });
                  setOpenItems(newOpenItems);
                }}
              >
                {games.map((game, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden accordion-card"
                  >
                    <div
                      className={`border-l-4 ${
                        game.completed
                          ? 'border-green-500'
                          : 'border-[#993333]'
                      }`}
                    >
                      <AccordionItem
                        value={`game${index + 1}`}
                        className="border-none"
                      >
                        <AccordionTrigger className="w-full p-0 hover:no-underline">
                          <div className="flex items-center p-4 w-full">
                            <CardHeader className="p-0 flex-1">
                              <div className="flex items-center">
                                <CardTitle className="text-2xl text-left">
                                  {game.title.replace(
                                    /\s*\([^)]*\)\s*/,
                                    ''
                                  )}
                                </CardTitle>

                                {/* Sterne rechts neben dem Titel */}
                                <div className="flex items-center ml-3">
                                  {/* Erster Stern für alle Schwierigkeitsgrade */}
                                  <svg
                                    className="w-5 h-5 text-yellow-300"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                  >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                  </svg>

                                  {/* Zweiter Stern für mittlere und schwere Schwierigkeit */}
                                  <svg
                                    className={`w-5 h-5 ms-1 ${
                                      game.id >= 2
                                        ? 'text-yellow-300'
                                        : 'text-gray-300'
                                    }`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                  >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                  </svg>

                                  {/* Dritter Stern nur für schwere Schwierigkeit */}
                                  <svg
                                    className={`w-5 h-5 ms-1 ${
                                      game.id >= 3
                                        ? 'text-yellow-300'
                                        : 'text-gray-300'
                                    }`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                  >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                  </svg>
                                </div>
                              </div>
                            </CardHeader>

                            <div className="h-8 w-8 flex items-center justify-center relative custom-accordion-icon accordion-trigger-icon">
                              {/* Obere Linie des Pfeils (wird zur oberen Linie des X) */}
                              <motion.span
                                className="absolute bg-black"
                                initial={{
                                  width: '12px',
                                  height: '2px',
                                  rotate: 45,
                                  y: -4,
                                  x: 2,
                                }}
                                animate={{
                                  rotate: openItems[
                                    `game${index + 1}`
                                  ]
                                    ? 45
                                    : 45,
                                  width: openItems[`game${index + 1}`]
                                    ? '20px'
                                    : '12px',
                                  y: openItems[`game${index + 1}`]
                                    ? 0
                                    : -4,
                                  x: openItems[`game${index + 1}`]
                                    ? 0
                                    : 2,
                                }}
                                transition={{
                                  duration: 0.3,
                                  ease: 'easeInOut',
                                }}
                              />

                              {/* Untere Linie des Pfeils (wird zur unteren Linie des X) */}
                              <motion.span
                                className="absolute bg-black"
                                initial={{
                                  width: '12px',
                                  height: '2px',
                                  rotate: -45,
                                  y: 4,
                                  x: 2,
                                }}
                                animate={{
                                  rotate: openItems[
                                    `game${index + 1}`
                                  ]
                                    ? -45
                                    : -45,
                                  width: openItems[`game${index + 1}`]
                                    ? '20px'
                                    : '12px',
                                  y: openItems[`game${index + 1}`]
                                    ? 0
                                    : 4,
                                  x: openItems[`game${index + 1}`]
                                    ? 0
                                    : 2,
                                }}
                                transition={{
                                  duration: 0.3,
                                  ease: 'easeInOut',
                                }}
                              />
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pt-0 px-4 pb-6">
                          <CardContent className="p-0">
                            {/* Spielinhalt */}
                            {game.id === 1 && (
                              <div className="space-y-4">
                                <p className="text-lg">
                                  Klicke auf die Stelle, wo unser
                                  Maskottchen Leo zu sehen ist.{' '}
                                  <img
                                    src={`${imageBaseUrl}/leoKopf.png`}
                                    alt="Leo der Löwe"
                                    className="inline-block ml-2 h-8 w-auto align-middle drop-shadow-md"
                                  />{' '}
                                </p>
                                <div
                                  ref={wimmelbildRef}
                                  className="relative bg-muted rounded-lg overflow-hidden cursor-crosshair aspect-[1280/853]"
                                  onClick={handleWimmelbildClick}
                                >
                                  <picture>
                                    <source
                                      media="(max-width: 767px)"
                                      srcSet={`${imageBaseUrl}/AC_Gewinnspiel_Wimmelbild_1.2.jpg`}
                                    />
                                    <img
                                      src={`${imageBaseUrl}/AC_Gewinnspiel_Wimmelbild_1.2.jpg`}
                                      alt="Wimmelbild"
                                      className="w-full h-full object-cover"
                                    />
                                  </picture>

                                  {/* Marker für ausgewählte Position */}
                                  {markerPosition && (
                                    <div
                                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                      style={{
                                        left: markerPosition.left,
                                        top: markerPosition.top,
                                        width:
                                          'clamp(60px, 15%, 100px)', // Min 60px, Max 100px, ideal 15% der Container-Breite
                                        height:
                                          'clamp(60px, 15%, 100px)', // Min 60px, Max 100px, ideal 15% der Container-Breite
                                      }}
                                    >
                                      <img
                                        src={`${imageBaseUrl}/lupe_better_centered.png`}
                                        alt="Lupe"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Alert für Wimmelbild-Feedback */}
                                {wimmelbildAlert && (
                                  <Alert
                                    className={`mt-4 border-l-4 ${
                                      wimmelbildAlert.title
                                        .toLowerCase()
                                        .includes('nicht') ||
                                      wimmelbildAlert.title
                                        .toLowerCase()
                                        .includes('bitte')
                                        ? 'border-amber-500 bg-amber-50'
                                        : wimmelbildAlert.title
                                            .toLowerCase()
                                            .includes('super')
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-[#993333] bg-red-50'
                                    } shadow-sm`}
                                    variant="default"
                                  >
                                    <div className="flex">
                                      {wimmelbildAlert.title
                                        .toLowerCase()
                                        .includes('nicht') ||
                                      wimmelbildAlert.title
                                        .toLowerCase()
                                        .includes('bitte') ? (
                                        <svg
                                          className="h-5 w-5 text-amber-600 mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 0 0-16 0 8 8 0 0 0 16 0zm-7-4a1 1 0 0 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 8a3.001 3.001 0 0 1-2 2.83V11a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : wimmelbildAlert.title
                                          .toLowerCase()
                                          .includes('super') ? (
                                        <svg
                                          className="h-5 w-5 text-green-600 mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 1 0-16 0 8 8 0 0 0 16 0zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="h-5 w-5 text-[#993333] mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-8a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                      <div>
                                        <AlertTitle
                                          className={`font-semibold ${
                                            wimmelbildAlert.title
                                              .toLowerCase()
                                              .includes('nicht') ||
                                            wimmelbildAlert.title
                                              .toLowerCase()
                                              .includes('bitte')
                                              ? 'text-amber-900'
                                              : wimmelbildAlert.title
                                                  .toLowerCase()
                                                  .includes('super')
                                              ? 'text-green-900'
                                              : 'text-[#993333]'
                                          }`}
                                        >
                                          {wimmelbildAlert.title}
                                        </AlertTitle>
                                        <AlertDescription
                                          className={
                                            wimmelbildAlert.title
                                              .toLowerCase()
                                              .includes('nicht') ||
                                            wimmelbildAlert.title
                                              .toLowerCase()
                                              .includes('bitte')
                                              ? 'text-amber-800'
                                              : wimmelbildAlert.title
                                                  .toLowerCase()
                                                  .includes('super')
                                              ? 'text-green-800'
                                              : 'text-[#7a2828]'
                                          }
                                        >
                                          {
                                            wimmelbildAlert.description
                                          }
                                        </AlertDescription>
                                      </div>
                                    </div>
                                  </Alert>
                                )}
                              </div>
                            )}

                            {game.id === 2 && (
                              <div className="space-y-6">
                                {/* Frage 1 */}
                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg">
                                    1. Wie lautet unsere Vision?
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q1-a"
                                        name="question1"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question1 ===
                                          'A'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question1: 'A',
                                          })
                                        }
                                      />
                                      <label htmlFor="q1-a">
                                        A: Aus Studierenden werden
                                        Fachkräfte für das mittlere
                                        Management.
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q1-b"
                                        name="question1"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question1 ===
                                          'B'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question1: 'B',
                                          })
                                        }
                                      />
                                      <label htmlFor="q1-b">
                                        B: Aus Studierenden werden
                                        Visionär:innen, die ständig
                                        neue Start-up-Ideen pitchen.
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q1-c"
                                        name="question1"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question1 ===
                                          'C'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question1: 'C',
                                          })
                                        }
                                      />
                                      <label htmlFor="q1-c">
                                        C: Aus Studierenden werden
                                        unternehmerische
                                        Persönlichkeiten.
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Frage 2 */}
                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg">
                                    2. Das Online-Stipendium von
                                    e-fellows.net bietet über 50
                                    geldwerte Leistungen – darunter
                                    kostenlose Print- und
                                    Digital-Abos. Wie viele
                                    renommierte Zeitungen und
                                    Zeitschriften kannst du als
                                    e-fellows.net-Stipendiat:in
                                    kostenlos abonnieren?
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q2-a"
                                        name="question2"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question2 ===
                                          'A'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question2: 'A',
                                          })
                                        }
                                      />
                                      <label htmlFor="q2-a">
                                        A: 27
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q2-b"
                                        name="question2"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question2 ===
                                          'B'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question2: 'B',
                                          })
                                        }
                                      />
                                      <label htmlFor="q2-b">
                                        B: 16
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q2-c"
                                        name="question2"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question2 ===
                                          'C'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question2: 'C',
                                          })
                                        }
                                      />
                                      <label htmlFor="q2-c">
                                        C: 10
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        id="q2-d"
                                        name="question2"
                                        className="mr-2 h-4 w-4 accent-[#993333]"
                                        checked={
                                          quizAnswers.question2 ===
                                          'D'
                                        }
                                        onChange={() =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            question2: 'D',
                                          })
                                        }
                                      />
                                      <label htmlFor="q2-d">
                                        D: Keine
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* Feedback-Alert für das Quiz */}
                                {quizFeedback && (
                                  <Alert
                                    className={`mt-4 border-l-4 ${
                                      quizFeedback.type === 'warning'
                                        ? 'border-amber-500 bg-amber-50'
                                        : quizFeedback.type ===
                                          'success'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-[#993333] bg-red-50'
                                    } shadow-sm`}
                                    variant="default"
                                  >
                                    <div className="flex">
                                      {quizFeedback.type ===
                                      'warning' ? (
                                        <svg
                                          className="h-5 w-5 text-amber-600 mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0zm-7-4a1 1 0 1 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 8a3.001 3.001 0 0 1-2 2.83V11a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : quizFeedback.type ===
                                        'success' ? (
                                        <svg
                                          className="h-5 w-5 text-green-600 mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 1 0-16 0 8 8 0 0 0 16 0zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="h-5 w-5 text-[#993333] mr-2"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-8a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                      <div>
                                        <AlertTitle
                                          className={`font-semibold ${
                                            quizFeedback.type ===
                                            'warning'
                                              ? 'text-amber-900'
                                              : quizFeedback.type ===
                                                'success'
                                              ? 'text-green-900'
                                              : 'text-[#993333]'
                                          }`}
                                        >
                                          {quizFeedback.title}
                                        </AlertTitle>
                                        <AlertDescription
                                          className={
                                            quizFeedback.type ===
                                            'warning'
                                              ? 'text-amber-800'
                                              : quizFeedback.type ===
                                                'success'
                                              ? 'text-green-800'
                                              : 'text-[#7a2828]'
                                          }
                                        >
                                          {quizFeedback.description}
                                        </AlertDescription>
                                      </div>
                                    </div>
                                  </Alert>
                                )}
                              </div>
                            )}

                            {game.id === 3 && (
                              <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                  <div className="aspect-video relative overflow-hidden">
                                    <img
                                      src={`${imageBaseUrl}/mitgliederfoto.jpg`}
                                      alt="Academy Consult"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                      <div className="p-4 text-white">
                                        <h3 className="text-xl font-bold">
                                          Academy Consult
                                        </h3>
                                        <p className="text-sm opacity-90">
                                          Eine starke Gemeinschaft
                                          kann alles erreichen!
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-5 space-y-4">
                                    <p className="text-sm text-gray-600">
                                      Mit einer genauen Schätzung
                                      kannst du deine Gewinnchancen
                                      deutlich erhöhen! Recherchiere
                                      und nutze die{' '}
                                      <span
                                        className="text-[#993333] font-medium underline cursor-pointer"
                                        onClick={scrollToFooter}
                                      >
                                        bereitgestellten Informationen
                                      </span>{' '}
                                      unserer Websites im Footer.
                                    </p>

                                    <div
                                      className="rounded-lg border border-gray-200 overflow-hidden shadow-md"
                                      style={{
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '0.5rem',
                                      }}
                                    >
                                      <div className="p-6 rounded-lg">
                                        <p className="font-medium text-xl mb-4 text-black">
                                          Wie viele Start-ups wurden
                                          von Mitgliedern von Academy
                                          Consult gegründet?
                                        </p>
                                        <div className="relative mb-4">
                                          <Input
                                            type="number"
                                            placeholder="Deine Schätzung"
                                            className="pl-2 md:pl-2 pr-10 md:pr-20 py-2 md:py-6 text-base md:text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white/95 backdrop-blur-sm rounded-md border border-gray-200 shadow-md"
                                            value={
                                              estimationValue || ''
                                            }
                                            onChange={(e) =>
                                              handleEstimationChange(
                                                e.target.value
                                              )
                                            }
                                            min="0"
                                            step="1"
                                          />
                                          <span className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-600">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                              <circle
                                                cx="9"
                                                cy="7"
                                                r="4"
                                              ></circle>
                                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                          </span>
                                          <span className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-600">
                                            Start-ups
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Feedback zum Schätzwert anzeigen */}
                                    {estimationFeedback && (
                                      <Alert
                                        className="border-l-4 border-amber-500 bg-amber-50 shadow-sm mt-3"
                                        variant="default"
                                      >
                                        <div className="flex">
                                          <svg
                                            className="h-5 w-5 text-amber-600 mr-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                          <div>
                                            <AlertTitle className="font-semibold text-amber-900">
                                              {
                                                estimationFeedback.title
                                              }
                                            </AlertTitle>
                                            <AlertDescription className="text-amber-800">
                                              {
                                                estimationFeedback.description
                                              }
                                            </AlertDescription>
                                          </div>
                                        </div>
                                      </Alert>
                                    )}

                                    {/* Fehlermeldung anzeigen */}
                                    {estimationError && (
                                      <Alert
                                        className="border-l-4 border-amber-500 bg-amber-50 shadow-sm mt-3"
                                        variant="default"
                                      >
                                        <div className="flex">
                                          <div>
                                            <AlertTitle className="font-semibold text-amber-900">
                                              Achtung
                                            </AlertTitle>
                                            <AlertDescription className="text-amber-800">
                                              {estimationError}
                                            </AlertDescription>
                                          </div>
                                        </div>
                                      </Alert>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>

                          {/* CardFooter mit korrektem Button-Text und Farbe */}
                          <CardFooter className="pt-4 px-0 pb-0">
                            <Button
                              onClick={() =>
                                handleGameCompletion(game.id)
                              }
                              className={`${
                                game.id === 1 || game.id === 2
                                  ? game.completed
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-[#993333] hover:bg-[#993333]/90'
                                  : game.completed
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-[#993333] hover:bg-[#993333]/90'
                              } transition-all duration-300`}
                            >
                              {game.id === 1 || game.id === 2
                                ? 'Lösung überprüfen'
                                : game.completed
                                ? 'Schätzung aktualisieren'
                                : 'Meine Schätzung einreichen'}
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
                  <CardTitle className="text-2xl">
                    Teilnahme einreichen
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder="Vorname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Nachname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="E-Mail Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="flex items-start space-x-2 my-4">
                        <div className="relative flex items-center justify-center">
                          <Checkbox
                            id="newsletter"
                            checked={newsletterOptIn}
                            onCheckedChange={(checked) =>
                              setNewsletterOptIn(checked === true)
                            }
                            className="border-gray-300 data-[state=checked]:bg-[#993333] data-[state=checked]:border-[#993333] cursor-pointer"
                          />
                          {newsletterOptIn && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Check
                                className="h-4 w-4 text-white font-bold"
                                strokeWidth={3}
                              />
                            </div>
                          )}
                        </div>
                        <Label
                          htmlFor="newsletter"
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          <span className="text-[#993333] font-semibold">
                            Chance auf 200€:
                          </span>{' '}
                          Newsletter abonnieren
                        </Label>
                      </div>
                      {newsletterOptIn ? (
                        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          Ja, ich möchte per E-Mail Informationen von
                          Academy Consult e. V. zur Bewerbungsphase
                          erhalten (Fristen, Auswahlverfahren, Events
                          & Vereinsinfos und Informationen zum
                          Gewinnspiel mit unserem Partner e-fellows).
                          Ich willige ein, dass Academy Consult e. V.
                          meine E-Mail-Adresse zu diesem Zweck
                          verarbeitet. Widerruf jederzeit über den
                          Abmeldelink oder per Mail an{' '}
                          <a
                            href="mailto:hey@academyconsult.de"
                            className="underline font-medium"
                          >
                            hey[at]academyconsult.de
                          </a>
                          . Details in der{' '}
                          <a
                            href="https://academyconsult.de/unternehmen/datenschutz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#993333] underline font-medium"
                          >
                            Datenschutzerklärung
                          </a>
                          .
                        </div>
                      ) : null}
                      <div className="flex items-start space-x-2 my-4">
                        <div className="relative flex items-center justify-center">
                          <Checkbox
                            id="consent"
                            checked={consentGiven}
                            onCheckedChange={(checked) =>
                              setConsentGiven(checked === true)
                            }
                            className="border-gray-300 data-[state=checked]:bg-[#993333] data-[state=checked]:border-[#993333] cursor-pointer"
                          />
                          {consentGiven && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Check
                                className="h-4 w-4 text-white font-bold"
                                strokeWidth={3}
                              />
                            </div>
                          )}
                        </div>
                        <Label
                          htmlFor="consent"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mit dem Einreichen meiner Lösungen
                          akzeptiere ich die und
                          <a
                            href="https://academyconsult.de/unternehmen/datenschutz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#993333] hover:underline"
                          >
                            {' '}
                            Teilnahmebedingungen{' '}
                          </a>
                          und
                          <a
                            href="https://academyconsult.de/unternehmen/datenschutz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#993333] hover:underline"
                          >
                            {' '}
                            Datenschutzbestimmungen
                          </a>
                          .
                        </Label>
                      </div>

                      {/* Bestehenden Success-Alert entfernen und durch Modal ersetzen */}
                      {submitSuccess && (
                        <>
                          {/* Overlay mit Hintergrundverdunkelung */}
                          <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                            onClick={() => setSubmitSuccess(false)}
                          >
                            {/* Modal-Inhalt, stoppt Klick-Propagation */}
                            <div
                              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-5 flex items-start">
                                <div className="mr-4 bg-green-100 p-2 rounded-full">
                                  <svg
                                    className="h-6 w-6 text-green-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-medium text-gray-900">
                                    Fast fertig!
                                  </h3>
                                  <p className="mt-2 text-sm text-gray-600">
                                    Danke für deine Teilnahme!
                                    Bestätige deine E-Mail, um am
                                    Gewinnspiel teilzunehmen. Deine
                                    Lösungen sind erfolgreich
                                    eingereicht. Schau unbedingt auch
                                    im Spam-Ordner nach, falls du
                                    keine Mail findest.
                                  </p>
                                </div>
                              </div>
                              <div className="bg-white px-5 py-3 rounded-b-lg flex justify-center">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setSubmitSuccess(false)
                                  }
                                  className="bg-[#993333] hover:bg-[#7a2828] text-white"
                                >
                                  Schließen
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Fehlermeldung anzeigen */}
                      {submitError && (
                        <Alert
                          className="border-l-4 border-amber-500 bg-amber-50 shadow-sm"
                          variant="default"
                        >
                          <div className="flex">
                            <div>
                              <AlertTitle className="font-semibold text-amber-900">
                                Achtung
                              </AlertTitle>
                              <AlertDescription className="text-amber-800">
                                {submitError}
                              </AlertDescription>
                            </div>
                          </div>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="bg-[#993333] hover:bg-[#7a2828] text-white rounded-full w-full md:w-auto px-8"
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Wird eingereicht...
                        </div>
                      ) : (
                        'Lösungen einreichen'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* e-fellows Info */}
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/efellowslogoneu.png" alt="e-fellows.net" className="h-7 w-auto object-contain" />
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Den e-fellows Preis (2 × 100 € Amazon Gutschein) kannst du nur gewinnen, wenn du zusätzlich am{' '}
                  <a
                    href="https://www.e-fellows.net/academy-consult-challenge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline text-[#993333] hover:text-[#7a2929] transition-colors"
                  >
                    e-fellows Gewinnspiel
                  </a>{' '}
                  teilnimmst. Jetzt registrieren und Chance sichern!
                </p>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Fortschritt & Gewinntickets
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Mit jedem Spiel sammelst du Gewinntickets. Maximal
                    100 Tickets sind möglich!
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Spiele mit integrierten Ticket-Informationen */}
                  <div className="space-y-4">
                    {games.map((game, index) => (
                      <div
                        key={index}
                        className="flex flex-col bg-white rounded-md border border-gray-200 overflow-hidden"
                      >
                        <div className="flex items-center p-3">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center overflow-hidden mr-3
              ${
                game.completed
                  ? 'bg-green-500 text-white'
                  : 'border border-gray-300 bg-gray-100'
              }`}
                          >
                            {game.completed ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transform translate-y-[0.5px]"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <span className="text-xs">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium ${
                                game.completed
                                  ? 'text-green-600'
                                  : 'text-gray-700'
                              } truncate`}
                            >
                              {game.title.replace(
                                /\s*\([^)]*\)\s*/,
                                ''
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 ml-2">
                            <div className="flex bg-gray-100 rounded-full px-2 py-1 items-center">
                              <img
                                src="https://static.vecteezy.com/system/resources/thumbnails/001/189/271/small_2x/tickets.png"
                                alt="Ticket"
                                className="w-4 h-4 mr-1 object-contain"
                              />
                              <span className="text-xs font-medium">
                                {game.id === 1 &&
                                  (games[0].completed ? '20' : '0')}
                                {game.id === 2 &&
                                  (games[1].completed ? '20' : '0')}
                                {game.id === 3 &&
                                  (games[2].completed ? '?' : '0')}
                                {game.id === 1 || game.id === 2
                                  ? '/20'
                                  : '/60'}
                              </span>
                            </div>

                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full text-white inline-flex justify-center min-w-[60px] ${
                                game.id === 1
                                  ? 'bg-green-500'
                                  : game.id === 2
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                            >
                              {game.id === 1
                                ? 'Leicht'
                                : game.id === 2
                                ? 'Mittel'
                                : 'Schwer'}
                            </span>
                          </div>
                        </div>

                        {/* Ticketdetails */}
                        {game.id === 3 && game.completed && (
                          <div className="bg-amber-50 px-3 py-2 border-t border-amber-100">
                            <p className="text-xs text-amber-800">
                              <span className="font-medium">
                                Schätzung:
                              </span>{' '}
                              Je näher an der korrekten Zahl, desto
                              mehr Tickets erhältst du (bis zu 60).
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Chat Sektion */}
      <CoffeeChats profiles={coffeeProfiles} />

      {/* Spotlight Event – deaktiviert */}
      {/* <section className="bg-white py-16 md:py-24">
        <SectionDivider title="Spotlight Event" />
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 md:grid-cols-[1.1fr,1fr] md:p-10">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/bk/53f57602-1317-43a6-b310-14ce8409d2df.png"
                alt="AC Hack the Case"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center rounded-full bg-[#993333]/10 px-3 py-1 text-sm font-semibold text-[#993333]">
                  23. Oktober · Celonis Office · 10:00–22:00 Uhr
                </div>
                <h3 className="mt-4 text-3xl font-bold text-neutral-900">
                  hACk the case | Celonis | Vestigas | Corbado | Lovable
                </h3>
                <p className="mt-4 text-base leading-relaxed text-neutral-700">
                  Du interessierst dich für Data Analytics, Beratung,
                  Programmierung oder komplexe Problemstellungen? Du
                  studierst in München und möchtest dein Semester mit
                  einem besonderen Erlebnis starten? Dann erlebe
                  gemeinsam mit uns einen ganzen Tag voller Cases,
                  Teamwork und Insights im Celonis Office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Bewerbung Sektion */}
      <section className="bg-white py-6 w-screen overflow-hidden relative">
        <SectionDivider title="Zur Bewerbung" />
        <div className="container mx-auto px-4">
          <p className="text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto">
            Du studierst in München und willst neben deinem eher
            theoretischen Studium echte Beratungserfahrung sammeln und
            dich persönlich weiterentwickeln?
            <br />
            Dann ist Academy Consult genau das richtige für dich!
            Lerne uns bei einem unserer Events näher kennen oder
            bewerbe dich direkt über den folgenden Link.
            <br />
            <span className="text-[#993333] font-bold">
              Wir freuen uns auf dich!
            </span>
          </p>

          <div className="flex justify-center mt-6">
            <a
              href="https://bewerben.academyconsult.de/s/-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transform hover:scale-105 transition-transform duration-300"
            >
              <div
                className="px-8 py-4 rounded-xl shadow-lg text-center"
                style={{
                  backgroundImage:
                    'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl drop-shadow-md">
                  Jetzt bis zum 26.04. bewerben!
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Event-Sektion – Hintergrund weiß */}
      <section
        id="events-section"
        className="bg-white py-12 md:py-24"
      >
        <SectionDivider title="Lerne uns kennen!" />
        <div className="container mx-auto px-4">
          <p className="text-lg md:text-xl text-center mb-8 max-w-3xl mx-auto">
            Auf Infoabenden stellen wir uns genauer vor, klären deine
            Fragen und tauschen uns aus. Melde dich an und füge die
            Events deinem Kalender hinzu. 📅
          </p>
          <div className="flex justify-center mb-12">
            <a
              href="https://luma.com/academyconsult"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#993333] text-white font-semibold hover:bg-[#7a2929] transition-colors shadow-md"
            >
              Alle Events auf Luma
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12">
          <SwiperEventCarousel events={events} />
        </div>
      </section>
      {/* Footer mit Header-Hintergrundbild */}
      <footer
        className="text-white py-12"
        style={{
          backgroundImage:
            'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AC%20Hintergrund%202-tH8JYEwhI9ZvKdJvkZJ21BJ3ZHAgrd.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <p className="text-lg font-medium mb-2">
                Hyped? Dann schau hier vorbei!
              </p>
              <div className="flex space-x-6 justify-center">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/academy-consult/mycompany/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/channel/UCCJetCDqnmoOtOu E5hv0Z1Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://de-de.facebook.com/AcademyConsult"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/academy.consult"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>

                {/* Website */}
                <a
                  href="https://academyconsult.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* reCAPTCHA Hinweis */}
            <div className="text-xs opacity-80 mb-4 text-center w-full">
              Diese Seite ist durch reCAPTCHA geschützt.
              <a
                href="https://academyconsult.de/unternehmen/datenschutz/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline hover:opacity-90"
              >
                Datenschutz
              </a>
              <span className="mx-1">-</span>
              <a
                href="https://academyconsult.de/unternehmen/impressum/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-90"
              >
                Impressum
              </a>
            </div>

            <div className="text-sm opacity-80">
              © {new Date().getFullYear()} Academy Consult. Alle
              Rechte vorbehalten.
            </div>
            <div className="mt-1 text-sm opacity-80">
              G'macht mit ❤️ in Minga
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Haupt-Export-Funktion
export default function Home() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LfoKugqAAAAAKc5SE8o6yJQXuI_zTxcmmy_tZjm"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
      language="de"
      container={{
        parameters: {
          badge: 'inline', // Badge komplett ausblenden
        },
      }}
    >
      <style jsx global>{`
        .grecaptcha-badge {
          visibility: hidden !important;
        }
      `}</style>
      <ChallengeApp />
    </GoogleReCaptchaProvider>
  );
}
