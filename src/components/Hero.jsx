export default function Hero() {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* overlay gelap */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
        }}
      />

      {/* content */}
      <div style={{ position: "relative", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          Welcome to Proskuneo
        </h1>

        <p style={{ color: "#ccc", marginBottom: "20px" }}>
          A place to encounter God
        </p>

        <button
          style={{
            background: "#8B6B4A",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
          }}
        >
          Join Us This Sunday
        </button>
      </div>
    </div>
  );
}
