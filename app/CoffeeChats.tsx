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
        <div className="mx-auto mb-12 max-w-3xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Links: Text */}
          <p className="flex-1 text-lg text-neutral-600 text-center">
            Wir freuen uns darauf, dich kennenzulernen. Buche dir direkt einen Coffee Chat und stelle deine Fragen.
          </p>
          {/* Rechts: LAP Logo als modernes Badge */}
          <div className="flex-shrink-0 flex items-center gap-3 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl px-6 py-4 shadow-sm border border-neutral-200/60">
            <img
              src="/LAP_Logo.png"
              alt="LAP Coffee"
              className="object-contain"
              style={{ height: '40px', width: 'auto' }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 leading-none">in Kooperation mit</span>
              <span className="text-sm font-bold text-neutral-700 mt-0.5">LAP Coffee</span>
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
