import Hero from "@/components/Hero";
import launchpadHero from "@/public/images/launchpad-hero.png";
import { LiveSection } from "./_components/LiveSection";
import PastSection from "./_components/PastSection";
import FeaturedSection from "./_components/FeaturedSection";
import UpcomingSection from "./_components/UpcomingSection";

const Launchpad = () => {
  return (
    <div className="md:p-20">
      <Hero
        heading="Launchpad"
        desription="Lampapuynft provides marketing and smart contract services to Elevate your brand by connecting it with more buyers."
        buttonText="Discover How"
        image={launchpadHero.src}
        imgHeight={600}
        imgWidth={600}
      />
      <LiveSection />
      <UpcomingSection />
      <PastSection />
      <FeaturedSection />
    </div>
  );
};

export default Launchpad;
