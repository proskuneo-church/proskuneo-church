import { churchInfo } from "../data/siteData";

export default function HeroSection() {
  return (
    <section id="home" className="hero-section section">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster={churchInfo.heroPoster}
      >
        <source src={churchInfo.heroVideoUrl} type="video/mp4" />
      </video>

      <div className="hero-overlay" />

      <div className="container hero-content">
        <p className="hero-kicker fade-in">{churchInfo.location}</p>
        <h1 className="hero-title fade-in delay-1">{churchInfo.heroTitle}</h1>
        <p className="hero-subtitle fade-in delay-2">{churchInfo.heroSubtitle}</p>

        <div className="hero-actions fade-in delay-3">
          <a href="#schedule" className="btn">
            Lihat Jadwal Ibadah
          </a>
        </div>
      </div>
    </section>
  );
}

