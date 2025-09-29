import { SectionDivider } from '@/components/ui/SectionDivider';

export default function Sponsoring() {
  return (
    <section className="bg-white py-6 w-screen overflow-hidden relative">
      <SectionDivider title="Unser Sponsor" />

      {/* Mobile: Statische Logos in einem Grid */}
      <div className="md:hidden container mx-auto">
        <div className="flex justify-center items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg"
            alt="Terme Erding Logo"
            className="rounded-lg"
            style={{
              height: '110px',
              width: 'auto',
              transform: 'translateZ(0)',
            }}
          />
        </div>
      </div>

      <div className="hidden md:block ticker-container w-screen mt-16">
        <div className="ticker-track" data-mobile-animation>
          {/* Erster Satz Logos */}
          <div className="ticker-content">
            {Array(10)
              .fill(null)
              .map((_, i) => {
                // Nur ein Logo im Array
                const logos = [
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                ];

                // Verwende den Modulo-Operator, um durch die Logos zu rotieren
                const logo = logos[i % 4];

                return (
                  <img
                    key={`sponsor-2-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="mx-10 rounded-lg"
                    loading="eager"
                    style={{
                      height: '70px',
                      width: 'auto',
                      transform: 'translateZ(0)',
                    }}
                  />
                );
              })}
          </div>

          {/* Zweiter identischer Satz - reduziere auf 6 statt 10 für bessere Performance */}
          <div className="ticker-content">
            {Array(10)
              .fill(null)
              .map((_, i) => {
                // Nur ein Logo im Array
                const logos = [
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                  {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Logo_TWE_gross.jpg/1200px-Logo_TWE_gross.jpg',
                    alt: 'Therme Erding Logo',
                  },
                ];

                // Verwende den Modulo-Operator, um durch die Logos zu rotieren
                const logo = logos[i % 4];

                return (
                  <img
                    key={`sponsor-2-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    className="mx-10 rounded-lg"
                    loading="eager"
                    style={{
                      height: '70px',
                      width: 'auto',
                      transform: 'translateZ(0)',
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
