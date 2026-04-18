export default function QuickActions() {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      
      <h2 style={{ marginBottom: "30px" }}>
        Koneksi Cepat
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        
        {/* Persembahan */}
        <a href="#giving">
          <button style={btnStyle("#2E2E2E")}
          onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
            }}
          >
            Persembahan
          </button>
        </a>

        {/* Doa */}
        <a href="https://wa.me/6282229891020" target="_blank">
          <button style={btnStyle("#2E2E2E")}
          onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
            }}
            >
            Permohonan Doa
          </button>
        </a>

        {/* Live */}
        <a
            href="https://www.youtube.com/channel/UCVoEF3NP5ldr-0BVN-RPsgA"
            target="_blank"
            >
            <button
                style={btnStyle("#2E2E2E")}
                onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                }}
            >
                Live Streaming
            </button>
        </a>

      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    background: bg,
    color: "#fff",
    padding: "15px 25px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  };
}
