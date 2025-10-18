import { Hero, About, Constitution } from '@/components/home';
import { ExecutiveGrid } from '@/components/executives';
import { EventGallery } from '@/components/events';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <ExecutiveGrid />
      <EventGallery />
      <Constitution />
    </main>
  );
}