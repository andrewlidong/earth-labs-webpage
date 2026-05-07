import Hero from "./components/Hero";
import SeismicTrace from "./components/SeismicTrace";
import Thesis from "./components/Thesis";
import Model from "./components/Model";
import Numbers from "./components/Numbers";
import Team from "./components/Team";
import Footer from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import TrainingWidget from "./components/TrainingWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <ScrollProgress />
      <Hero />
      <SeismicTrace />
      <Thesis />
      <Model />
      <Numbers />
      <Team />
      <Footer />
      <TrainingWidget />
    </main>
  );
}
