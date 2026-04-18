import HeroSection from "../../components/public/HeroSection";
import SmartCountdownSection from "../../components/public/SmartCountdownSection";
import DevotionalPreviewSection from "../../components/public/DevotionalPreviewSection";
import FeaturedEventsSection from "../../components/public/FeaturedEventsSection";
import UpcomingEventsCarouselSection from "../../components/public/UpcomingEventsCarouselSection";
import ServiceScheduleSection from "../../components/public/ServiceScheduleSection";
import ChurchProfileSection from "../../components/public/ChurchProfileSection";
import CommunitySection from "../../components/public/CommunitySection";
import MemberServicesSection from "../../components/public/MemberServicesSection";
import GivingSection from "../../components/public/GivingSection";
import SermonArchiveSection from "../../components/public/SermonArchiveSection";
import PublicFooter from "../../components/public/PublicFooter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SmartCountdownSection />
      <DevotionalPreviewSection />
      <FeaturedEventsSection />
      <UpcomingEventsCarouselSection />
      <ServiceScheduleSection />
      <ChurchProfileSection />
      <CommunitySection />
      <MemberServicesSection />
      <GivingSection />
      <SermonArchiveSection />
      <PublicFooter />
    </>
  );
}
