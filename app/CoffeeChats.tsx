import { SectionDivider } from '@/components/ui/SectionDivider';

import { coffeeProfiles } from './data';
import CoffeeChatCarousel from './CoffeeChatCarousel';

export default function CoffeeChats() {
  return (
    <section id="events-section" className="bg-white py-12 md:py-24">
      <SectionDivider title="Unser Team!" />
      <div className="container mx-auto px-4">
        <p className="text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto">
          Lerne unsere engagierten Berater kennen und buche ein
          persönliches Gespräch mit.
        </p>
      </div>
      <div className="container mx-auto md:px-4 mt-12 max-w-4xl">
        <CoffeeChatCarousel profiles={coffeeProfiles} />
      </div>
    </section>
  );
}
