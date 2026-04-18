export default function SectionHeading({ title, subtitle, align = "left" }) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
