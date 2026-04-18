export default function Giving() {
  return (
    <div
      id="giving"
      style={{
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Persembahan
      </h2>

      <p style={{ color: "#aaa", marginBottom: "30px" }}>
        Anda dapat memberi melalui QRIS berikut
      </p>
      <p style={{ marginTop: "20px", color: "#aaa" }}>
  Semua persembahan digunakan untuk pelayanan dan pengembangan gereja
</p>

      <img
        src="/images/qris.png"
        alt="QRIS"
        style={{
          width: "250px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}
