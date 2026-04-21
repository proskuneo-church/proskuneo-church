export const churchMeta = {
  name: "Proskuneo Church",
  location: "Surabaya",
  tagline: "Welcoming, spiritual, modern",
  heroTitle: "Welcome to Proskuneo",
  heroSubtitle: "A place to encounter God",
  heroVideo: "https://videos.pexels.com/video-files/3000175/3000175-uhd_2560_1440_25fps.mp4",
  heroPoster:
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80",
  livestreamUrl: "https://www.youtube.com/@jkiproskuneosby",
  address: "Jl. Dharmahusada Indah Barat III-A No. 153-155, Surabaya, Jawa Timur",
  whatsappDisplay: "+62 822-2989-1020",
  whatsappUrl: "https://wa.me/6282229891020",
  socials: [
    { label: "YouTube", url: "https://www.youtube.com/@jkiproskuneosby" },
    { label: "Instagram", url: "https://instagram.com/jkiproskuneo_sby" },
    { label: "TikTok", url: "https://tiktok.com/@jkiproskuneo_sby" },
  ],
  navigation: [
    { label: "Home", href: "#home" },
    { label: "Schedule", href: "#schedule" },
    { label: "Ministries", href: "#services" },
    { label: "Sermon Archive", href: "#sermons" },
    { label: "Giving", href: "#giving" },
    { label: "Contact", href: "#contact" },
  ],
};

export const churchProfile = {
  vision:
    "-Mewujudkan jemaat yang berwawasan Kerajaan Allah.\n-Berkarakter Kristus.",
  mission:
    "Membangun Pujian, Penyembahan Doa, Pengajaran Firman Tuhan.",
  pastor: {
    name: "Pdt. Susy Herawati S. Th.",
    //role: "Gembala Sidang JKI Proskuneo",
    image: "/images/gembala.jpeg",
    message:
      "Pdt. Susy Herawati adalah seorang pendeta Kristen yang melayani sebagai gembala jemaat di JKI Proskuneo Surabaya. Dalam pelayanannya, beliau dikenal aktif membina jemaat melalui khotbah, doa, dan berbagai kegiatan rohani yang berfokus pada pertumbuhan iman serta kehidupan spiritual. ENTER ENTER Sebagai pemimpin gereja, Pdt. Susy Herawati turut berperan dalam pengembangan pelayanan dan komunitas gereja di Surabaya, termasuk dalam peresmian dan pengelolaan fasilitas ibadah yang mendukung aktivitas jemaat. Pelayanannya juga menjangkau media digital, di mana ia membagikan firman Tuhan melalui siaran ibadah dan konten rohani. ENTER ENTER Dengan dedikasi dalam pelayanan, Pdt. Susy Herawati terus berkomitmen untuk membangun jemaat yang bertumbuh secara rohani serta berdampak positif bagi masyarakat sekitar.",
  },
};

export const communityCategories = [
  {
    name: "Wanita",
    description: "Komunitas wanita untuk saling menguatkan dalam doa, firman, dan pelayanan.",
    icon: "✦",
  },
  {
    name: "Youth",
    description: "Ruang kreatif generasi muda untuk bertumbuh dalam iman dan karakter Kristus.",
    icon: "⚡",
  },
  {
    name: "Pendoa",
    description: "Tim pendoa yang setia menopang setiap musim pelayanan melalui doa syafaat.",
    icon: "✝",
  },
  {
    name: "Dancer",
    description: "Pelayanan dance untuk mengekspresikan penyembahan dengan kreativitas yang kudus.",
    icon: "♫",
  },
];

export const memberServices = [
  // Pastikan `url` menggunakan link publik Google Form yang valid (Publish/Share link).
  // Jika short-link forms.gle sudah expired, ganti dengan link baru dari Google Forms.
  {
    title: "Baptisan",
    description: "Daftar kelas baptisan dan jadwal pelayanan baptisan kudus.",
    icon: "💧",
    url: "https://forms.gle/8yrMkg7P4M5Txs9f8",
    fallbackUrl: "https://wa.me/6282229891020?text=Halo%20admin,%20saya%20ingin%20mendaftar%20Baptisan",
  },
  {
    title: "Penyerahan Anak",
    description: "Ajukan pelayanan penyerahan anak untuk keluarga Anda.",
    icon: "👶",
    url: "https://forms.gle/d2LBh5UkPa8PtGvf7",
    fallbackUrl: "https://wa.me/6282229891020?text=Halo%20admin,%20saya%20ingin%20pelayanan%20Penyerahan%20Anak",
  },
  {
    title: "Pernikahan",
    description: "Pendaftaran konseling pra-nikah dan pelayanan pemberkatan.",
    icon: "💍",
    url: "https://forms.gle/ydch5gG4PXraTgh36",
    fallbackUrl: "https://wa.me/6282229891020?text=Halo%20admin,%20saya%20ingin%20pelayanan%20Pernikahan",
  },
  {
    title: "Konseling",
    description: "Layanan konseling rohani dan keluarga bersama tim pastoral.",
    icon: "🤝",
    url: "https://forms.gle/sWiB8MpAkTx3q4iYA",
    fallbackUrl: "https://wa.me/6282229891020?text=Halo%20admin,%20saya%20ingin%20jadwal%20Konseling",
  },
];

export const givingInfo = {
  qris: "/images/qris.png",
  account: "Rekening BCA 010 884 884 0",
  holder: "a.n. JKI Proskuneo Surabaya",
  message: "Terima kasih atas dukungan Anda dalam pelayanan Tuhan.",
};
