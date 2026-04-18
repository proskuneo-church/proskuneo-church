import { churchProfile } from "../data/siteData";

export default function ChurchProfileSection() {
  return (
    <section className="section" id="profile">
      <div className="container">
        <h2 className="section-title">Tentang Gereja</h2>
        <p className="section-subtitle">Visi yang jelas, misi yang hidup, dan hati gembala untuk setiap jiwa.</p>

        <div className="profile-grid">
          <article className="profile-card">
            <h3>Visi</h3>
            <p>{churchProfile.vision}</p>
          </article>

          <article className="profile-card">
            <h3>Misi</h3>
            <p>{churchProfile.mission}</p>
          </article>
        </div>

        <article className="pastor-card">
          <img
            src={churchProfile.pastor.image}
            alt={churchProfile.pastor.name}
            className="pastor-image"
            loading="lazy"
          />
          <div className="pastor-info">
            <h3>{churchProfile.pastor.name}</h3>
            <p className="pastor-role">{churchProfile.pastor.role}</p>
            <p className="pastor-message">{churchProfile.pastor.message}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

