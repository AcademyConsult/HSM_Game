import { useState, useEffect, useRef } from "react";

export default function SponsorTicker() {
  const tickerTrackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (tickerTrackRef.current) {
      // Da wir zwei identische Sets rendern, entspricht die Breite eines Sets:
      const fullWidth = tickerTrackRef.current.scrollWidth;
      setTrackWidth(fullWidth / 2);
    }
  }, []);

  const logos = Array(20).fill(null);

  return (
    <section className="bg-white py-6 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Sponsoren</h2>

        <div className="ticker-container overflow-hidden relative">
          <div
            className="ticker-track animate-ticker flex whitespace-nowrap"
            ref={tickerTrackRef}
            style={{ ["--track-width" as string]: `${trackWidth}px` }}
          >
            {/* Erstes Set */}
            {logos.map((_, i) => (
              <img
                key={`sponsor-${i}`}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Celonis_Logo.png/1280px-Celonis_Logo.png"
                alt="Celonis Logo"
                className="mx-8"
                style={{ height: "50px", width: "auto" }}
              />
            ))}
            {/* Zweites Set (identisch) */}
            {logos.map((_, i) => (
              <img
                key={`sponsor-dup-${i}`}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Celonis_Logo.png/1280px-Celonis_Logo.png"
                alt="Celonis Logo"
                className="mx-8"
                style={{ height: "50px", width: "auto" }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        /* Entferne ggf. die fixe Breite, da wir dynamisch messen */
        .ticker-track {
          display: flex;
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * var(--track-width)));
          }
        }
        .animate-ticker {
          animation: ticker 20s linear infinite;
        }
      `}</style>
    </section>
  );
}