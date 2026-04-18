import { churchProfile } from "../../data/siteContent";
import SectionHeading from "../common/SectionHeading";

function formatMultilineText(text = "") {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\s*\bENTER\b\s*/gi, "\n");
}

export default function ChurchProfileSection() {
  return (
    <section className="section" id="profile">
      <div className="site-container">
        <SectionHeading title="Tentang Gereja" subtitle="Visi dan misi yang bergerak bersama hati gembala untuk jemaat." />

        <div className="profile-split">
          <article>
            <h3>Visi</h3>
            <p>{formatMultilineText(churchProfile.vision)}</p>
          </article>
          <article>
            <h3>Misi</h3>
            <p>{formatMultilineText(churchProfile.mission)}</p>
          </article>
        </div>

        <div className="pastor-feature">
          <img src={churchProfile.pastor.image} alt={churchProfile.pastor.name} loading="lazy" />
          <div>
            <p className="eyebrow">GEMBALA SIDANG</p>
            <h3>{churchProfile.pastor.name}</h3>
            <p className="meta">{churchProfile.pastor.role}</p>
            <p className="pastor-message">{formatMultilineText(churchProfile.pastor.message)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
