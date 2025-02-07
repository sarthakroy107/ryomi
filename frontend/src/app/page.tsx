import { Companies } from "@/components/landing/companies";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Horizon } from "@/components/landing/horizon";
import { Navbar } from "@/components/landing/navbar";
import { Reviews } from "@/components/landing/reviews";
import { Sales } from "@/components/landing/sales";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen flex flex-col items-center gap-y-10 py-3 z-0">
        <Hero />
        <Companies />
        <Horizon rotated={false} />
        <Features />
        <Reviews />
        <Horizon rotated={true} />
        <Sales />
      </main>
      <Footer />
    </>
  );
}
