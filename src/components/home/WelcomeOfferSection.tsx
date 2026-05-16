import { WelcomeOfferSlide } from "@/components/home/WelcomeOfferSlide";

/** Standalone welcome offer block (e.g. if used outside the hero carousel). */
export function WelcomeOfferSection() {
  return (
    <section className="border-b-4 border-brand">
      <WelcomeOfferSlide />
    </section>
  );
}
