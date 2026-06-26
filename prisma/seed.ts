import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai seeding database...');

  // 1. Seed Admin User
  const adminUsername = 'admin';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: passwordHash
    }
  });
  console.log(`Admin user: ${admin.username} / ${adminPassword}`);

  // 2. Seed Projects — only if empty
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    const projectsData = [
      {
        title: 'Sistem Informasi LSP UGM',
        description: 'Platform terintegrasi untuk Lembaga Sertifikasi Profesi Universitas Gadjah Mada. Menyederhanakan proses sertifikasi profesi mulai dari pendaftaran asesi hingga penerbitan sertifikat kompetensi yang terstandarisasi dan diakui BNSP.',
        imageUrl: '/assets/projects/lsp-ugm.png',
        liveUrl: 'https://silsp.trpl.space',
        githubUrl: 'https://github.com/januarsyah901',
        tags: ['Laravel', 'PHP', 'MySQL', 'REST API'],
        order: 1,
        visible: true
      },
      {
        title: "Java Al-'Alim UGM",
        description: "Website resmi Jama'ah Vokasi Al-'Alim Sekolah Vokasi UGM yang modern dan dinamis. Dilengkapi fitur blog, profil organisasi, dashboard administrasi, dan sistem autentikasi anggota.",
        imageUrl: '/assets/projects/java-ugm.png',
        liveUrl: 'https://javaugm.vercel.app',
        githubUrl: 'https://github.com/januarsyah901',
        tags: ['React', 'Next.js', 'TypeScript', 'Vercel'],
        order: 2,
        visible: true
      },
      {
        title: 'Website PPDB MA Amanatul Ummah',
        description: 'Sistem website Penerimaan Peserta Didik Baru (PPDB) untuk MA Unggulan Amanatul Ummah Surabaya. Menampilkan informasi sekolah, berita, panduan pendaftaran, dan formulir online bagi calon peserta didik baru.',
        imageUrl: '/assets/projects/ppdb-mai.png',
        liveUrl: 'https://mai-au.sch.id',
        githubUrl: 'https://github.com/januarsyah901',
        tags: ['PHP', 'Laravel', 'TailwindCSS', 'MySQL'],
        order: 3,
        visible: true
      },
      {
        title: "Jama'ah Vokasi Al-'Alim (WordPress)",
        description: "Website resmi Jama'ah Vokasi Al-'Alim berbasis WordPress di domain resmi UGM. Memuat artikel, kegiatan organisasi, dan media dakwah untuk komunitas mahasiswa muslim Sekolah Vokasi UGM.",
        imageUrl: '/assets/projects/java-wordpress.png',
        liveUrl: 'https://javamuslim.sv.ugm.ac.id',
        githubUrl: 'https://github.com/januarsyah901',
        tags: ['WordPress', 'PHP', 'CMS', 'UGM'],
        order: 4,
        visible: true
      }
    ];

    for (const proj of projectsData) {
      await prisma.project.create({ data: proj });
    }
    console.log('Projects seeded.');
  } else {
    console.log('Projects already exist, skipping.');
  }

  // 3. Seed BlogVideos — only if empty
  const existingVideos = await prisma.blogVideo.count();
  if (existingVideos === 0) {
    const videosData = [
      {
        videoId: '7651547919576812817',
        caption: 'Part 2: Bikin monitor laptop bekas jadi monitor eksternal',
        tags: ['#monitor', '#laptopbekas', '#laptoprusak', '#fyppp'],
        order: 1,
        visible: true
      },
      {
        videoId: '7649396644290596117',
        caption: 'Isi galeri cowo',
        tags: ['#CapCut', '#9router', '#hotwheels', '#ngoding', '#mancing'],
        order: 2,
        visible: true
      },
      {
        videoId: '7647545349942430996',
        caption: 'Biang kerok yang sering bikin limit. Cara biar ga boros token.',
        tags: ['#ai', '#token', '#bot', '#agent', '#gemini'],
        order: 3,
        visible: true
      },
      {
        videoId: '7645643023283457301',
        caption: 'Bocil ketauan nyolong API key',
        tags: ['#claude', '#ai', '#parodi', '#fypシ', '#bocil'],
        order: 4,
        visible: true
      },
      {
        videoId: '7639756301941116180',
        caption: 'YTTA hihi, saran sound dong',
        tags: ['#quote', '#love', '#programming', '#javascript', '#learncoding'],
        order: 5,
        visible: true
      },
      {
        videoId: '7639669422306741524',
        caption: 'Nggak perlu bayar app cleaner — AI agent bisa lakuin semua itu, gratis. Set up agent CLI untuk cleaning laptop.',
        tags: ['#aitrend', '#ai', '#claude', '#developerindonesia', '#programming', '#macbook', '#tipsandtricks'],
        order: 6,
        visible: true
      },
      {
        videoId: '7638126581625539861',
        caption: 'Tutorial ucapin ultah buat doi pake website',
        tags: ['#coding', '#vscode', '#github', '#hbd', '#ultah'],
        order: 7,
        visible: true
      },
      {
        videoId: '7603236338476813588',
        caption: 'Status error-nya 404 mulu',
        tags: ['#programmer', '#fyp', '#frontend', '#backend', '#website'],
        order: 8,
        visible: true
      },
      {
        videoId: '7523618082602880273',
        caption: 'Nih cara dapetin AI tercanggih yang belum rilis!',
        tags: ['#programmer', '#programmerhumor', '#xybca', '#openai', '#chatgpt', '#sora'],
        order: 9,
        visible: true
      },
      {
        videoId: '7516932007151078663',
        caption: 'Light mode is real!',
        tags: ['#programmer', '#fyp', '#frontend', '#backend', '#website', '#freelance', '#framework', '#darkmode', '#lightmode'],
        order: 10,
        visible: true
      },
      {
        videoId: '7511365024510774546',
        caption: 'Replying to @fahryzzz aku cuma nanyea lo',
        tags: ['#kesenjangan', '#programmer', '#docker', '#fyp'],
        order: 11,
        visible: true
      },
      {
        videoId: '7507455681386106120',
        caption: 'Duh endingnya 🙏',
        tags: ['#programmer', '#fyp', '#frontend', '#backend', '#website', '#freelance', '#laravel', '#framework'],
        order: 12,
        visible: true
      },
      {
        videoId: '7506130788564487431',
        caption: 'Cita-cita dan realita',
        tags: ['#programmer', '#citacita', '#realita', '#fypシ゚', '#xybca', '#programmerhumor', '#upinipin'],
        order: 13,
        visible: true
      },
      {
        videoId: '7504971644050492679',
        caption: 'Sory ye… kaum GitHub students mau lewat',
        tags: ['#codeeditor', '#meme', '#vscode', '#jetbrains', '#ngeleak', '#programmer', '#fyp', '#okegas'],
        order: 14,
        visible: true
      },
      {
        videoId: '7504480534874148114',
        caption: 'Cobain pake Docker deh',
        tags: ['#kesenjangan', '#programmer', '#docker', '#fyp', '#xyzabc'],
        order: 15,
        visible: true
      }
    ];

    for (const vid of videosData) {
      await prisma.blogVideo.create({ data: vid });
    }
    console.log('Blog videos seeded.');
  } else {
    console.log('Blog videos already exist, skipping.');
  }

  // 4. Seed Testimonials — only if empty
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    const testimonialsData = [
      {
        name: 'Dr. Budi Santoso',
        role: 'Ketua Lembaga Sertifikasi Profesi',
        company: 'Universitas Gadjah Mada',
        text: 'Sistem Informasi LSP yang dibangun oleh bang Jan sangat membantu kami dalam mendigitalisasi proses sertifikasi. Kerja samanya sangat profesional dan hasilnya melampaui ekspektasi.',
        rating: 5,
        visible: true
      },
      {
        name: 'Ahmad Fauzi',
        role: 'Koordinator IT',
        company: 'MA Amanatul Ummah',
        text: 'Website PPDB berjalan dengan lancar saat pendaftaran siswa baru. Sistem sangat stabil meskipun diakses oleh ribuan pendaftar secara bersamaan.',
        rating: 5,
        visible: true
      }
    ];

    for (const test of testimonialsData) {
      await prisma.testimonial.create({ data: test });
    }
    console.log('Testimonials seeded.');
  } else {
    console.log('Testimonials already exist, skipping.');
  }

  console.log('Seeding selesai!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
