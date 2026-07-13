import { Hero } from '@/sections/Hero';
import { Marquee } from '@/components/shared/Marquee';
import { Collections } from '@/sections/Collections';
import { Manifesto } from '@/sections/Manifesto';
import { Atelier } from '@/sections/Atelier';
import { marqueeItems } from '@/cms/content';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={marqueeItems} className="bg-bone" />
      <Collections />
      <Manifesto />
      <Atelier />
    </>
  );
}
