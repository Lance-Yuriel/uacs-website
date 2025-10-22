import { Hero, About, Constitution } from '@/components/home';
import { ExecutiveGrid } from '@/components/executives';
import { EventGallery } from '@/components/events';
import { Section } from '@/components/layout';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Section id="events">
        <EventGallery />
      </Section>
      <Section id="about">
        <About />
      </Section>
      <Section id="team">
        <ExecutiveGrid />
      </Section>
      <Section id="constitution">
        <Constitution />
      </Section>
    </main>
  );
}