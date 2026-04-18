import { useEffect, useMemo, useState } from "react";
import { churchInfo, services } from "../data/siteData";

const DAY_TO_INDEX = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const LIVE_DURATION_MS = 60 * 60 * 1000;

function getNextServiceStart(service, now) {
  const [hours, minutes] = service.time.split(":").map(Number);
  const nextStart = new Date(now);
  const dayIndex = DAY_TO_INDEX[service.day];
  const daysUntil = (dayIndex - now.getDay() + 7) % 7;

  nextStart.setDate(now.getDate() + daysUntil);
  nextStart.setHours(hours, minutes, 0, 0);

  if (nextStart <= now) {
    nextStart.setDate(nextStart.getDate() + 7);
  }

  return nextStart;
}

function getServiceState(now) {
  const liveCandidates = [];
  const upcomingCandidates = [];

  services.forEach((service) => {
    const nextStart = getNextServiceStart(service, now);
    const currentWeekStart = new Date(nextStart);
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);

    const currentWeekEnd = new Date(currentWeekStart.getTime() + LIVE_DURATION_MS);

    if (now >= currentWeekStart && now < currentWeekEnd) {
      liveCandidates.push({
        service,
        startDate: currentWeekStart,
        targetDate: currentWeekEnd,
      });
    }

    upcomingCandidates.push({
      service,
      startDate: nextStart,
      targetDate: nextStart,
    });
  });

  if (liveCandidates.length > 0) {
    liveCandidates.sort((a, b) => b.startDate - a.startDate);
    return { mode: "live", ...liveCandidates[0] };
  }

  upcomingCandidates.sort((a, b) => a.startDate - b.startDate);
  return { mode: "countdown", ...upcomingCandidates[0] };
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function formatServiceDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function CountdownSection() {
  const [serviceState, setServiceState] = useState(() => getServiceState(new Date()));

  useEffect(() => {
    const tick = () => {
      setServiceState(getServiceState(new Date()));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownText = useMemo(() => {
    if (serviceState.mode === "live") {
      return "LIVE NOW";
    }

    const remainingMs = serviceState.targetDate.getTime() - Date.now();
    return formatCountdown(remainingMs);
  }, [serviceState]);

  return (
    <section className="section countdown-section" id="next-service">
      <div className="container">
        <div className={`countdown-panel ${serviceState.mode === "live" ? "is-live" : ""}`}>
          <p className="countdown-label">Next Service</p>
          <h2 className="countdown-service">{serviceState.service.name}</h2>

          <p className="countdown-meta">
            {formatServiceDate(serviceState.startDate)} WIB · {serviceState.service.location}
          </p>

          <div className={`countdown-value ${serviceState.mode === "live" ? "live" : ""}`}>
            {countdownText}
          </div>

          {serviceState.mode === "live" && (
            <a
              className="btn live-button"
              href={churchInfo.liveStreamUrl}
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

