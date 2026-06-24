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

  console.log(`Admin user berhasil di-seed: ${admin.username} / ${adminPassword}`);

  // 2. Seed Projects
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
    await prisma.project.create({
      data: proj
    });
  }
  console.log('Seeding projects selesai.');

  // 3. Seed BlogVideos
  const videosData = [
    {
      videoId: 'FILL_VIDEO_ID_1',
      caption: 'Video TikTok Terbaru',
      tags: ['#coding', '#webdev'],
      order: 1,
      visible: true
    },
    {
      videoId: 'FILL_VIDEO_ID_2',
      caption: 'Tips & Trick Developer',
      tags: ['#developer', '#tips'],
      order: 2,
      visible: true
    },
    {
      videoId: 'FILL_VIDEO_ID_3',
      caption: 'Project Showcase',
      tags: ['#project', '#fullstack'],
      order: 3,
      visible: true
    },
    {
      videoId: 'FILL_VIDEO_ID_4',
      caption: 'Life as CS Student UGM',
      tags: ['#ugm', '#mahasiswa'],
      order: 4,
      visible: true
    },
    {
      videoId: 'FILL_VIDEO_ID_5',
      caption: 'Belajar Go Lang',
      tags: ['#golang', '#backend'],
      order: 5,
      visible: true
    },
    {
      videoId: 'FILL_VIDEO_ID_6',
      caption: 'React Tips',
      tags: ['#react', '#frontend'],
      order: 6,
      visible: true
    }
  ];

  for (const vid of videosData) {
    await prisma.blogVideo.create({
      data: vid
    });
  }
  console.log('Seeding blog videos selesai.');

  // 4. Seed Testimonials
  const testimonialsData = [
    {
      name: 'Dr. Budi Santoso',
      role: 'Ketua Lembaga Sertifikasi Profesi',
      company: 'Universitas Gadjah Mada',
      text: 'Sistem Informasi LSP yang dibangun oleh bang jan sangat membantu kami dalam mendigitalisasi proses sertifikasi. Kerja samanya sangat profesional dan hasilnya melampaui ekspektasi.',
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
    await prisma.testimonial.create({
      data: test
    });
  }
  console.log('Seeding testimonials selesai.');

  console.log('Seeding database berhasil diselesaikan!');
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
