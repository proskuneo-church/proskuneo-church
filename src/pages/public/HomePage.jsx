import SeoHead from "../../components/common/SeoHead";
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
import { churchMeta } from "../../data/siteContent";
import { getAbsoluteUrl } from "../../lib/seo";

export default function HomePage() {
  const schemaChurch = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: "Proskuneo Church",
    alternateName: ["JKI Proskuneo", "Gereja Proskuneo", "Gereja JKI Surabaya", "Gereja Surabaya"],
    url: getAbsoluteUrl("/"),
    logo: getAbsoluteUrl("/images/logogambar.png"),
    image: getAbsoluteUrl("/images/hero.jpg"),
    telephone: churchMeta.whatsappDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: churchMeta.address,
      addressLocality: "Surabaya",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    sameAs: [...churchMeta.socials.map((item) => item.url), churchMeta.whatsappUrl],
  };

  const schemaWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Proskuneo Church",
    url: getAbsoluteUrl("/"),
    inLanguage: "id-ID",
  };

  return (
    <>
      <SeoHead
        title="Gereja JKI Surabaya | JKI Proskuneo"
        description="Proskuneo Church adalah gereja di Surabaya dengan jadwal ibadah, komunitas, arsip khotbah, dan renungan untuk pertumbuhan iman jemaat."
        path="/"
        image="/images/hero.jpg"
        keywords={[
          "jadwal ibadah JKI Surabaya",
          "komunitas gereja Surabaya",
          "arsip khotbah JKI Proskuneo",
          "renungan harian Kristen Surabaya",
        ]}
        jsonLd={[schemaChurch, schemaWebsite]}
      />
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
