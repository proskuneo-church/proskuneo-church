import services from "../data/services.json";

export default function ServiceSchedule() {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      
      <h2 style={{ marginBottom: "40px" }}>
        Jadwal Ibadah
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {services.map((service, index) => (
          <div
            key={index}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                }}
            style={{
                background: "#2E2E2E",
                padding: "20px",
                borderRadius: "12px",
                width: "250px",
                textAlign: "left",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "0.3s",
            }}
          >
            <h3>{service.name}</h3>
            <p>{Array.isArray(service.day) ? service.day.join(", ") : service.day}</p>
            <p>{service.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
