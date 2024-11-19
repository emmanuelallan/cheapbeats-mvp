import Hero from "@/components/layout/hero";
import FilterSearch from "@/components/beats/filter";
import { BeatsList } from "@/components/beats/beatList";

export default function Home() {
  return (
    <main>
      <Hero />
      <FilterSearch />

      <div className="container mx-auto px-4 py-4">
        <BeatsList />
      </div>
    </main>
  );
}
