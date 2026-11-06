import type { SiteContentKey } from './siteContent';

/**
 * The website content as it was hardcoded in the frontend before it became editable.
 * Used to seed an empty table. The frontend keeps its own copy as an offline fallback.
 */
export const SITE_CONTENT_DEFAULTS: Record<SiteContentKey, unknown> = {
  experience: {
    eyebrow: 'Riwayat Kerja',
    title: 'Pengalaman Profesional',
    items: [
      {
        period: '2025',
        badge: 'LSP UGM',
        accent: true,
        title: 'Pengembang Website Akreditasi (LSP UGM)',
        role: 'Web Developer',
        description:
          'Terlibat dalam proyek strategis Sistem Informasi LSP UGM. Mengembangkan platform terintegrasi yang menyederhanakan proses sertifikasi profesi (seperti sistem akreditasi), mulai dari pendaftaran asesi hingga penerbitan sertifikat kompetensi yang terstandarisasi.',
      },
      {
        period: '2022 - 2024',
        badge: 'MA Unggulan Amanatul Ummah',
        accent: false,
        title: 'Pengembang Website PPDB, Olimpiade & Profil Sekolah',
        role: 'Web Developer & Asisten IT',
        description:
          'Memulai karier teknis sejak bangku SMA dengan mengembangkan ekosistem digital sekolah yang krusial, meliputi website Penerimaan Peserta Didik Baru (PPDB), Portal Olimpiade, dan Profil Sekolah. Di saat bersamaan, dipercaya sebagai IT Assistant untuk mengelola pemeliharaan sistem dan dukungan teknis harian.',
      },
    ],
  },

  skills: {
    eyebrow: 'Keahlian Teknis',
    title: 'Teknologi & Kompetensi',
    categories: [
      {
        label: '01 / FRONTEND',
        title: 'Frontend Development',
        description: 'Membangun antarmuka web interaktif, responsif, dan ramah pengguna menggunakan framework modern.',
        skills: [
          { name: 'React / Next.js', level: 90 },
          { name: 'TypeScript', level: 85 },
          { name: 'Tailwind CSS / Vanilla CSS', level: 90 },
        ],
      },
      {
        label: '02 / BACKEND',
        title: 'Backend & API',
        description: 'Merancang arsitektur API yang aman, integrasi basis data berkecepatan tinggi, dan penanganan JWT.',
        skills: [
          { name: 'Node.js / Express.js', level: 85 },
          { name: 'Golang', level: 75 },
          { name: 'Laravel (PHP)', level: 85 },
        ],
      },
      {
        label: '03 / LAINNYA',
        title: 'Tools & Database',
        description: 'Manajemen kontainerisasi, kontrol versi repositori, serta visualisasi antarmuka UI/UX.',
        skills: [
          { name: 'Docker & Git', level: 80 },
          { name: 'MySQL / Prisma / SQLite', level: 85 },
          { name: 'Figma / Canva', level: 80 },
        ],
      },
    ],
  },

  about: {
    eyebrow: 'Tentang Saya',
    name: 'Januarsyah Akbar',
    paragraphs: [
      'Saya adalah mahasiswa program studi **Teknologi Rekayasa Perangkat Lunak (TRPL) Universitas Gadjah Mada (UGM)** angkatan 2024. Sebagai *full-stack web developer*, saya memiliki ketertarikan mendalam dalam memadukan logika pemrograman yang ketat dengan arsitektur web yang modern dan responsif.',
      'Di lingkungan kampus, saya aktif menjabat sebagai **Ketua Departemen Media** di Jamaah Vokasi Al-Alim UGM (Maret 2026 - Sekarang). Saya terbiasa memimpin tim kreatif dan memadukan aspek teknis digital dengan strategi media komunikasi.',
    ],
    summaryTitle: 'Ringkasan Profil',
    summary: [
      { label: 'Universitas saat ini', value: 'Universitas Gadjah Mada (UGM)', accent: false },
      { label: 'Sekolah Menengah', value: 'MA Unggulan Amanatul Ummah Surabaya', accent: false },
      { label: 'Fokus Utama', value: 'Sistem Informasi Akreditasi, Integrasi AI, REST API', accent: true },
    ],
  },

  contact: {
    ctaTitle: 'Mari Berkolaborasi',
    ctaSubtitle: 'Punya proyek menarik atau butuh developer handal? Saya siap berdiskusi.',
    brandDesc:
      'Mengembangkan platform web terintegrasi dan andal. Berfokus pada logika pemrograman yang kuat dan optimalisasi API.',
    email: 'januarsyahakbar791@gmail.com',
    location: 'Sleman, Yogyakarta',
    github: 'https://github.com/januarsyah901',
    linkedin: 'https://www.linkedin.com/in/januarsyah',
    x: 'https://x.com/hallojanu',
    instagram: 'https://www.instagram.com/hallojanuu/',
  },
};
