import { useEffect, useState } from "react";
import services from "../data/services.json";

const getNextService = () => {
  const now = new Date();
  const daysMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  let upcoming = [];

  services.forEach(service => {
    const days = Array.isArray(service.day)
      ? service.day
      : [service.day];

    days.forEach(day => {
      let date = new Date();
      date.setDate(
        date.getDate() +
        ((daysMap[day] + 7 - date.getDay()) % 7)
      );

      const [hour, minute] = service.time.split(":");
      date.setHours(hour, minute, 0);

      if (date < now) {
        date.setDate(date.getDate() + 7);
      }

      upcoming.push({
        ...service,
        datetime: date
      });
    });
  });

  upcoming.sort((a, b) => a.datetime - b.datetime);

  return upcoming[0];
};

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState("");
  const [nextService, setNextService] = useState(null);

  useEffect(() => {
    const service = getNextService();
    setNextService(service);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = service.datetime - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h3>Ibadah Selanjutnya</h3>
      {nextService && (
        <>
          <p>{nextService.name}</p>
          <h1>{timeLeft}</h1>
        </>
      )}
    </div>
  );
}
