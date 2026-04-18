import { churchMeta } from "../../data/siteContent";

export default function HeroSection() {
  return (
    <section id="home" className="hero-section-main">
      <video className="hero-background" autoPlay muted loop playsInline poster={churchMeta.heroPoster}>
        <source src={churchMeta.heroVideo} type="video/mp4" />
      </video>

      <div className="hero-overlay" />

      <div className="site-container hero-content-main">
        <h1 className="fade-in delay-1">{churchMeta.heroTitle}</h1>
        <p className="fade-in delay-2">{churchMeta.heroSubtitle}</p>
        <a className="button-primary fade-in delay-3" href="#schedule">
          Lihat Jadwal Ibadah
        </a>
      </div>
    </section>
  );
}
