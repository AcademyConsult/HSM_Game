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
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-lg text-neutral-600">
            Unsere Beraterinnen und Berater freuen sich darauf, dich kennenzulernen. Buche dir direkt einen Coffee Chat und stelle deine Fragen. Der Kaffee wird von unserem Partner LAP Coffee bezahlt.
          </p>
        </div>
      </div>
      <div className="container mx-auto md:px-4 mt-12 max-w-5xl">
        <CoffeeChatCarousel profiles={profiles} />
      </div>
    </section>
  );
}
