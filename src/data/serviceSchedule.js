export const dayLabelsId = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// `dayText` bebas dipakai untuk label Indonesia, contoh:
// - "Setiap Sabtu ke-3"
// - "Setiap tanggal 1"
// Countdown tetap akurat karena memakai objek `recurrence`.
export const services = [
  {
    name: "Sunday Service 1",
    time: "08:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Minggu",
    recurrence: {
      type: "weekly",
      days: [0],
    },
  },
  {
    name: "Sunday Service 2",
    time: "16:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Minggu",
    recurrence: {
      type: "weekly",
      days: [0],
    },
  },
  {
    name: "Ibadah Doa Malam",
    time: "19:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Jumat",
    recurrence: {
      type: "weekly",
      days: [5],
    },
  },
  {
    name: "PraiseUp Youth",
    time: "18:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Sabtu",
    recurrence: {
      type: "weekly",
      days: [6],
    },
  },
  {
    name: "Ibadah Doa Pagi",
    time: "05:00",
    location: "Rumah Doa Jl. Simokerto II No.9, Surabaya",
    dayText: "Setiap Senin, Rabu, Jumat",
    recurrence: {
      type: "weekly",
      days: [1, 3, 5],
    },
  },
  {
    name: "Ibadah Pemulihan",
    time: "10:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Setiap Sabtu ke-1",
    recurrence: {
      type: "monthly_nth_weekday",
      weekday: 6,
      weekNumber: 1,
    },
  },
  {
    name: "Proskuneo Morning Favor",
    time: "05:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Setiap Sabtu ke-3",
    recurrence: {
      type: "monthly_nth_weekday",
      weekday: 6,
      weekNumber: 3,
    },
  },
  {
    name: "Ibadah Proskuneo Wanita",
    time: "10:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Setiap Sabtu ke-4",
    recurrence: {
      type: "monthly_nth_weekday",
      weekday: 6,
      weekNumber: 4,
    },
  },
  {
    name: "Ibadah Mujizat Masih Ada",
    time: "10:00",
    location: "Jl. Dharmahusada Indah Barat IIIA No. 153-155, Surabaya",
    dayText: "Setiap tanggal 1",
    recurrence: {
      type: "monthly_date",
      dayOfMonth: 1,
    },
  },
];
