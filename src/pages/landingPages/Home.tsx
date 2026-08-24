import HeroSection from "../../components/portfolio-componets/home/HeroSection";
import IntroSection from "../../components/portfolio-componets/home/IntroSection";
import ServicesOverview from "../../components/portfolio-componets/home/ServicesOverview";
import IndustriesSection from "../../components/portfolio-componets/home/IndustriesSection";
import WhyChooseUsSection from "../../components/portfolio-componets/home/WhyChooseUsSection";
import HowItWorksSection from "../../components/portfolio-componets/home/HowItWorksSection";
import StatsSection from "../../components/portfolio-componets/home/StatsSection";
import CTASection from "../../components/portfolio-componets/home/CTAsection";
import Navbar from "../../components/portfolio-componets/site/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <IntroSection />
      <ServicesOverview />
      <IndustriesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <StatsSection />
      {/* <TestimonialsSection /> */}
      <CTASection />
    </>
  );
}
