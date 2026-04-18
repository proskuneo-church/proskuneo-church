export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function excerpt(text, maxWords = 30) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function formatDateDisplay(dateValue) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

export function formatDateTimeDisplay(dateValue, timeValue) {
  const datePart = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));

  const timePart = timeValue?.slice(0, 5) ?? "00:00";
  return `${datePart} · ${timePart} WIB`;
}

export function combineDateAndTime(dateValue, timeValue) {
  const safeTime = timeValue?.length >= 5 ? timeValue.slice(0, 5) : "00:00";
  return new Date(`${dateValue}T${safeTime}:00`);
}

export function formatDateInput(dateValue) {
  if (!dateValue) return "";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
}

export function parseDateInputToIso(value) {
  const raw = String(value || "")
    .trim()
    .replaceAll("-", "/")
    .replaceAll(".", "/");

  if (!raw) {
    throw new Error("Tanggal wajib diisi dengan format dd/mm/yyyy.");
  }

  let day = "";
  let month = "";
  let year = "";

  const ddmmyyyy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    [, day, month, year] = ddmmyyyy;
  } else {
    const yyyymmdd = raw.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    if (!yyyymmdd) {
      throw new Error("Format tanggal harus dd/mm/yyyy.");
    }
    [, year, month, day] = yyyymmdd;
  }

  const isoDate = `${year}-${month}-${day}`;
  const parsed = new Date(`${isoDate}T00:00:00`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() + 1 !== Number(month) ||
    parsed.getDate() !== Number(day)
  ) {
    throw new Error("Tanggal tidak valid. Gunakan format dd/mm/yyyy.");
  }

  return isoDate;
}

export function normalize24HourTime(value) {
  const raw = String(value || "")
    .trim()
    .replaceAll(".", ":");

  if (!raw) {
    throw new Error("Jam wajib diisi dengan format 24 jam (HH:mm).");
  }

  const match = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    throw new Error("Format jam harus 24 jam, contoh: 19:30.");
  }

  const hour = String(match[1]).padStart(2, "0");
  const minute = String(match[2]).padStart(2, "0");
  return `${hour}:${minute}`;
}
