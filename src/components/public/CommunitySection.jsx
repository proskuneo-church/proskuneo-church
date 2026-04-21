import { communityCategories } from "../../data/siteContent";
import SectionHeading from "../common/SectionHeading";

export default function CommunitySection() {
  return (
    <section className="section section-alt" id="community">
      <div className="site-container">
        <SectionHeading title="Community" subtitle="Bertumbuh bersama dalam komunitas yang saling mendukung dan membangun." />

        <div className="community-clean-grid">
          {communityCategories.map((item) => (
            <article className="community-clean-item reveal-on-scroll" key={item.name}>
              <span className="community-icon">{item.icon}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
