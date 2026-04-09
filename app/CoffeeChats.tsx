import { SectionDivider } from '@/components/ui/SectionDivider';

import CoffeeChatCarousel, { CoffeeProfile } from './CoffeeChatCarousel';

export default function CoffeeChats({
  profiles,
}: {
  profiles: CoffeeProfile[];
}) {
  if (!profiles?.length) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <SectionDivider title="Triff uns, wir laden dich auf einen Kaffee ein!" />
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl flex items-center gap-12">
          {/* Links: Text */}
          <p className="flex-1 text-lg text-neutral-600">
            Unsere Beraterinnen und Berater freuen sich darauf, dich kennenzulernen. Buche dir direkt einen Coffee Chat und stelle deine Fragen.
          </p>
          {/* Rechts: In Kooperation mit + LAP Logo */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">In Kooperation mit</span>
            <div className="px-5 py-3 rounded-full border-2 border-[#993333]/30 bg-white flex items-center justify-center">
              <img
                src="/LAP_Logo.png"
                alt="LAP Coffee"
                className="object-contain"
                style={{ height: '36px', width: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto md:px-4 mt-12 max-w-5xl">
        <CoffeeChatCarousel profiles={profiles} />
      </div>
    </section>
  );
}
