import { communityGroups } from "../data/siteData";

export default function CommunitySection() {
  return (
    <section className="section" id="community">
      <div className="container">
        <h2 className="section-title">Community</h2>
        <p className="section-subtitle">Temukan komunitas yang menolong Anda bertumbuh dan melayani bersama.</p>

        <div className="card-grid">
          {communityGroups.map((group) => (
            <article className="community-card" key={group.name}>
              <img src={group.image} alt={group.name} className="community-image" loading="lazy" />
              <div className="community-content">
                <h3>{group.name}</h3>
                <p>{group.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

