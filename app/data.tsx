const events = [
  {
    id: 1,
    title: 'Infoabend Online 1',
    date: '2025-04-16',
    time: '19:00-20:30',
    location: 'Teams',
    description:
      'Hier erfährst du alles, was Dich bei uns erwartet und kommst mit uns ins Gespräch!',
    eventbride:
      'https://www.eventbrite.com/e/digitaler-infoabend-academy-consult-tickets-1307910147459?aff=oddtdtcreator',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/OnlineInfo.jpeg',
  },
  /*
    {
      id: 2,
      title: "Case Training 1",
      date: "2025-04-18",
      time: "15:00-19:00",
      location: "LMU Hauptgebäude, Hörsaal A199",
      description: "Beim Case Training hast du die Möglichkeit, gemeinsam mit erfahrenen AClern zu casen und dich dabei ganz entspannt auszutauschen.",
      eventbride: "none",
      image: "https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/InfoAbendLMU.jpg",
    },
    */
  {
    id: 3,
    title: 'Open Büro Day',
    date: '2025-04-22',
    time: '15:00-17:30',
    location: 'AC Büro, Leopoldstraße 62',
    description:
      'Beim Open Büro Day kannst Du Dir anschauen, wo du zukünftig arbeiten könntest ;)',
    eventbride:
      'https://www.eventbrite.com/e/open-buro-day-academy-consult-tickets-1308092021449?aff=oddtdtcreator',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/B%C3%BCro.jpg',
  },
  {
    id: 4,
    title: 'Infoabend Online 2',
    date: '2025-04-22',
    time: '19:00-20:30',
    location: 'Teams',
    description:
      'Hier erfährst du alles, was Dich bei uns erwartet und kommst mit uns ins Gespräch!',
    eventbride:
      'https://www.eventbrite.com/e/digitaler-infoabend-academy-consult-tickets-1308099363409?aff=oddtdtcreator',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/OnlineInfo.jpeg',
  },
  {
    id: 5,
    title: 'Case Training',
    date: '2025-04-23',
    time: '15:00-19:00',
    location: 'AC Büro, Leopoldstraße 62',
    description:
      'Beim Case Training hast du die Möglichkeit, gemeinsam mit erfahrenen AClern zu casen und dich dabei ganz entspannt auszutauschen.',
    eventbride: 'none',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/caseTraining.jpg',
  },
  {
    id: 6,
    title: 'Infoabend LMU',
    date: '2025-04-23',
    time: '19:00-20:00',
    location: 'LMU Hauptgebäude, Hörsaal A199',
    description:
      'Hier erfährst du alles, was Dich bei uns erwartet und danach gehen wir noch ganz locker in eine Bar.',
    eventbride:
      'https://www.eventbrite.com/e/infoabend-academy-consult-lmu-tickets-1308198560109?aff=oddtdtcreator',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/LMU.jpg',
  },
  {
    id: 7,
    title: 'Bewerbertraining',
    date: '2025-04-24',
    time: '19:00-20:00',
    location: 'AC Büro, Leopoldstraße 62',
    description:
      'Beim Bewerbertraining lernst du das wichtigste was du vor einem Bewerbungsprozess wissen musst.',
    eventbride: 'none',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/bewerbertraining.jpg',
  },
  {
    id: 8,
    title: 'Infoabend TUM',
    date: '2025-04-24',
    time: '19:00-20:00',
    location: 'TUM Stammgelände, Raum 0601',
    description:
      'Hier erfährst du alles, was Dich bei uns erwartet und danach gehen wir noch ganz locker in eine Bar.',
    eventbride:
      'https://www.eventbrite.com/e/infoabend-academy-consult-tum-tickets-1308194076699?aff=oddtdtcreator',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/TUM.jpeg',
  },
];

const prizes = [
  {
    position: '1',
    title: 'Hauptpreis',
    description: 'Air Pods Pro 2',
    image:
      'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/airpods-pro-2.png',
  },
  {
    position: '2',
    title: 'Zweiter Preis',
    description:
      '2 Tickets für die BAYERN 3 Beachparty in der Therme Erding',
    image:
      'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/Erding.jpeg',
    //"https://img.br.de/2dcb69b4-aae2-4d30-97ef-698f0489a175.jpeg?rect=0,60,1920,960&_naturalWidth=1920&_naturalHeight=1080",
    //"https://img.br.de/3b42b4d7-5188-4d0d-a644-51c5aa1df94c.jpeg?_naturalWidth=1920&_naturalHeight=1080&rect=0%2C0%2C1920%2C1080&q=70",
  },
  {
    position: '3-5',
    title: 'Dritter Preis',
    description: 'Rewe Gutschein im Wert von 50€',
    image:
      //"https://kartedirekt.de/images/products/rewe-geschenkkarte-50-eur-1702903315.png",
      'https://upload.wikimedia.org/wikipedia/commons/5/5a/REWE_Dein_Markt-Logo_neu.png',
  },
];

const coffeeProfiles = [
  {
    displayName: 'Jannis Höferlin',
    degreeProgram: 'Informatik B.Sc.',
    currentSemester: 6,
    imageLink: '/jannis-hoeferlin.png',
    calendarLink: 'https://jannishoeferlin.com',
  },
  {
    displayName: 'Anna Schmidt',
    degreeProgram: 'BWL M.Sc.',
    currentSemester: 2,
    imageLink: '/jannis-hoeferlin.png',
    calendarLink: 'https://annaschmidt.com',
  },
  {
    displayName: 'Lukas Meier',
    degreeProgram: 'Maschinenbau B.Sc.',
    currentSemester: 4,
    imageLink: '/jannis-hoeferlin.png',
    calendarLink: 'https://lukasmeier.com',
  },
  {
    displayName: 'Sophie Weber',
    degreeProgram: 'Psychologie B.Sc.',
    currentSemester: 5,
    imageLink: '/jannis-hoeferlin.png',
    calendarLink: 'https://sophieweber.com',
  },
  {
    displayName: 'David Müller',
    degreeProgram: 'Mathematik M.Sc.',
    currentSemester: 1,
    imageLink: '/jannis-hoeferlin.png',
    calendarLink: 'https://davidmueller.com',
  },
];

export { events, prizes, coffeeProfiles };
