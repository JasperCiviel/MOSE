import { Hero } from '@/components/sections/Hero';
import { HomeNarrative } from '@/components/sections/HomeNarrative';
import { Gallery } from '@/components/sections/Gallery';
import { BarrierMap } from '@/components/sections/BarrierMap';

export default function Page() {
  return (
    <div className="pb-24">
      <Hero />
      <HomeNarrative />
      <Gallery />
      <BarrierMap />
    </div>
  );
}
