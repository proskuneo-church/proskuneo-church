import verses from "../data/verses.json";

export default function DailyVerse() {
  const today = new Date().getDate();
  const verse = verses[today % verses.length];

  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        background: "linear-gradient(to right, #1A1A1A, #2A2A2A)"
      }}
    >
      <p style={{ fontStyle: "italic", marginBottom: "10px" }}>
        "{verse.text}"
      </p>

      <p style={{ color: "#aaa" }}>
        - {verse.reference}
      </p>
    </div>
  );
}
