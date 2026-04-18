import { useEffect, useMemo, useState } from "react";
import { churchMeta } from "../../data/siteContent";
import { dayLabelsId, services } from "../../data/serviceSchedule";

const LIVE_WINDOW_MS = 60 * 60 * 1000;
const INITIAL_TICK = Date.now();

function parseTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function createDate(year, monthIndex, day, hour, minute) {
  const date = new Date(year, monthIndex, day, hour, minute, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nthWeekdayOfMonth(year, monthIndex, weekday, weekNumber, hour, minute) {
  const first = new Date(year, monthIndex, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (weekNumber - 1) * 7;

  if (day > daysInMonth(year, monthIndex)) {
    return null;
  }

  return createDate(year, monthIndex, day, hour, minute);
}

function getRecurringCandidates(service, now) {
  const { hour, minute } = parseTime(service.time);
  const candidates = [];
  const { recurrence } = service;

  if (recurrence.type === "weekly") {
    recurrence.days.forEach((day) => {
      const next = new Date(now);
      const daysUntil = (day - now.getDay() + 7) % 7;
      next.setDate(now.getDate() + daysUntil);
      next.setHours(hour, minute, 0, 0);

      if (next <= now) {
        next.setDate(next.getDate() + 7);
      }

      const previous = new Date(next);
      previous.setDate(previous.getDate() - 7);

      candidates.push({ previous, next });
    });
  }

  if (recurrence.type === "monthly_nth_weekday") {
    const y = now.getFullYear();
    const m = now.getMonth();

    const thisMonth = nthWeekdayOfMonth(y, m, recurrence.weekday, recurrence.weekNumber, hour, minute);
    const nextMonth = nthWeekdayOfMonth(y, m + 1, recurrence.weekday, recurrence.weekNumber, hour, minute);
    const prevMonth = nthWeekdayOfMonth(y, m - 1, recurrence.weekday, recurrence.weekNumber, hour, minute);

    if (thisMonth && thisMonth > now) {
      candidates.push({ previous: prevMonth, next: thisMonth });
    } else {
      candidates.push({ previous: thisMonth || prevMonth, next: nextMonth });
    }
  }

  if (recurrence.type === "monthly_date") {
    const y = now.getFullYear();
    const m = now.getMonth();

    const thisMonthDay = Math.min(recurrence.dayOfMonth, daysInMonth(y, m));
    const nextMonthDay = Math.min(recurrence.dayOfMonth, daysInMonth(y, m + 1));
    const prevMonthDay = Math.min(recurrence.dayOfMonth, daysInMonth(y, m - 1));

    const thisMonth = createDate(y, m, thisMonthDay, hour, minute);
    const nextMonth = createDate(y, m + 1, nextMonthDay, hour, minute);
    const prevMonth = createDate(y, m - 1, prevMonthDay, hour, minute);

    if (thisMonth && thisMonth > now) {
      candidates.push({ previous: prevMonth, next: thisMonth });
    } else {
      candidates.push({ previous: thisMonth || prevMonth, next: nextMonth });
    }
  }

  return candidates;
}

function getNextServiceState(now = new Date()) {
  const liveCandidates = [];
  const nextCandidates = [];

  services.forEach((service) => {
    const ranges = getRecurringCandidates(service, now);

    ranges.forEach(({ previous, next }) => {
      if (previous) {
        const liveEnd = new Date(previous.getTime() + LIVE_WINDOW_MS);
        if (now >= previous && now < liveEnd) {
          liveCandidates.push({
            service,
            mode: "live",
            start: previous,
            target: liveEnd,
          });
        }
      }

      if (next && next > now) {
        nextCandidates.push({
          service,
          mode: "countdown",
          start: next,
          target: next,
        });
      }
    });
  });

  if (liveCandidates.length) {
    liveCandidates.sort((a, b) => b.start.getTime() - a.start.getTime());
    return liveCandidates[0];
  }

  nextCandidates.sort((a, b) => a.start.getTime() - b.start.getTime());
  return nextCandidates[0] || null;
}

function formatCountdown(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

function getDayDescription(service) {
  if (service.dayText) return service.dayText;

  if (service.recurrence?.type === "weekly") {
    return `Setiap ${service.recurrence.days.map((day) => dayLabelsId[day]).join(", ")}`;
  }

  return "Jadwal Khusus";
}

export default function SmartCountdownSection() {
  const [tick, setTick] = useState(INITIAL_TICK);

  useEffect(() => {
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const state = useMemo(() => getNextServiceState(new Date(tick)), [tick]);

  if (!state) {
    return (
      <section className="section section-dark" id="next-service">
        <div className="site-container">
          <div className="message-block">
            <h4>No schedule configured</h4>
            <p>Tambahkan jadwal tetap di `src/data/serviceSchedule.js`.</p>
          </div>
        </div>
      </section>
    );
  }

  const liveNow = state.mode === "live";
  const countdownText = liveNow ? "LIVE NOW" : formatCountdown(state.target);

  return (
    <section className="section section-dark" id="next-service">
      <div className="site-container">
        <div className={`countdown-shell ${liveNow ? "live" : ""}`}>
          <p className="eyebrow">{liveNow ? "Ibadah Saat Ini" : "Ibadah Berikutnya"}</p>
          <h2>{state.service.name}</h2>
          <p>
            {getDayDescription(state.service)} · {state.service.time} WIB
          </p>
          <p>{state.service.location}</p>

          <div className={`countdown-time ${liveNow ? "live" : ""}`}>{countdownText}</div>

          {liveNow ? (
            <a className="button-secondary" href={churchMeta.livestreamUrl} target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
