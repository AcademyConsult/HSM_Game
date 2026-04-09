export default function SponsorTicker() {
  const sponsors = [
    { src: "/redbull.svg", alt: "Red Bull" },
    { src: "/Amazon_200.png", alt: "Amazon" },
    { src: "/e_fellows_logo.svg", alt: "e-fellows" },
    { src: "/2023_BW_Logos_2.png", alt: "BW" },
    { src: "/230913_habitus_logo_orange.png", alt: "Habitus" },
    { src: "/KH_Logo_Master_1909_pos.png", alt: "Kienbaum" },
    { src: "/efn-Logo mit Claim mit Schutzraum für Online 600x350 PNG.png", alt: "efn" },
    { src: "/herspace-logo_hoch-earth.jpg", alt: "HerSpace" },
    { src: "/raus_logo_green.png", alt: "RAUS" },
  ];

  return (
    <section className="bg-white py-6 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Sponsoren</h2>

        <div className="ticker-container overflow-hidden relative">
          <div className="ticker-track flex whitespace-nowrap">
            {/* Erstes Set */}
            {sponsors.map((sponsor, i) => (
              <img
                key={`sponsor-${i}`}
                src={sponsor.src}
                alt={sponsor.alt}
                className="mx-8 object-contain"
                style={{ height: "50px", width: "auto" }}
              />
            ))}
            {/* Zweites Set (für nahtloses Loopen) */}
            {sponsors.map((sponsor, i) => (
              <img
                key={`sponsor-dup-${i}`}
                src={sponsor.src}
                alt={sponsor.alt}
                className="mx-8 object-contain"
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
        .ticker-track {
          display: flex;
          animation: ticker 20s linear infinite;
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
