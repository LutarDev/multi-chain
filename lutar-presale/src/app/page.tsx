import { PresaleRubicWidget } from "@/components/PresaleRubicWidget";
import { Participants } from "@/components/Participants";

export default function Home() {
  return (
    <main className="py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Featured Presale</h2>
        <p className="text-white/60 mb-4">Participate in the LUTAR token presale across 7 chains.</p>
        <PresaleRubicWidget />
      </section>
      <section className="mb-8">
        <Participants />
      </section>
    </main>
  );
}
