import ChallengePage from "./challenge-page";

export const dynamic = "force-dynamic";

function ChallengeInactiveMessage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8f4ef] text-[#281f1b]">
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <img
            src="/logo_text.png"
            alt="Academy Consult Logo"
            className="mx-auto mb-10 h-auto w-48 max-w-full"
          />
          <div className="rounded-lg border border-[#e0d5cc] bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Die Challenge ist aktuell nicht aktiv.
            </h1>
            <p className="text-base leading-relaxed text-[#5f554f] md:text-lg">
              Schau später wieder vorbei. Sobald die Challenge startet, findest
              du hier alle Aufgaben und Preise.
            </p>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#e0d5cc] bg-white px-6 py-6 text-center text-sm text-[#5f554f]">
        <div className="mb-2">
          <a
            href="https://academyconsult.de/unternehmen/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#993333]"
          >
            Datenschutz
          </a>
          <span className="mx-2">-</span>
          <a
            href="https://academyconsult.de/unternehmen/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#993333]"
          >
            Impressum
          </a>
        </div>
        <div>
          © {new Date().getFullYear()} Academy Consult. Alle Rechte
          vorbehalten.
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  if (process.env.CHALLENGE_ACTIVE !== "true") {
    return <ChallengeInactiveMessage />;
  }

  return <ChallengePage />;
}
