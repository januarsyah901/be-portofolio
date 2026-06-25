import supabase from './src/supabase';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🚀 Memulai seeding database Supabase...');

  // 1. Seed Admin User
  const adminUsername = 'admin';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  console.log('Seeding AdminUser...');
  const { data: existingAdmin } = await supabase
    .from('AdminUser')
    .select('*')
    .eq('username', adminUsername)
    .maybeSingle();

  if (!existingAdmin) {
    const { error: adminError } = await supabase
      .from('AdminUser')
      .insert({
        username: adminUsername,
        passwordHash: passwordHash
      });
    if (adminError) {
      console.error('❌ Gagal seed AdminUser:', adminError);
    } else {
      console.log(`✅ Admin user berhasil di-seed: ${adminUsername} / ${adminPassword}`);
    }
  } else {
    console.log('ℹ️ Admin user sudah ada, skip.');
  }

  // 2. Seed Projects
  console.log('Seeding Projects...');
  const { data: existingProjects } = await supabase.from('Project').select('id');
  
  if (!existingProjects || existingProjects.length === 0) {
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

    const { error: projError } = await supabase.from('Project').insert(projectsData);
    if (projError) {
      console.error('❌ Gagal seed Projects:', projError);
    } else {
      console.log('✅ Seeding projects selesai.');
    }
  } else {
    console.log('ℹ️ Projects sudah terisi, skip.');
  }

  // 3. Seed BlogVideos
  console.log('Seeding BlogVideos...');
  const { data: existingVideos } = await supabase.from('BlogVideo').select('id');

  if (!existingVideos || existingVideos.length === 0) {
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

    const { error: vidError } = await supabase.from('BlogVideo').insert(videosData);
    if (vidError) {
      console.error('❌ Gagal seed BlogVideos:', vidError);
    } else {
      console.log('✅ Seeding blog videos selesai.');
    }
  } else {
    console.log('ℹ️ BlogVideos sudah terisi, skip.');
  }

  // 4. Seed Testimonials
  console.log('Seeding Testimonials...');
  const { data: existingTestimonials } = await supabase.from('Testimonial').select('id');

  if (!existingTestimonials || existingTestimonials.length === 0) {
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

    const { error: testError } = await supabase.from('Testimonial').insert(testimonialsData);
    if (testError) {
      console.error('❌ Gagal seed Testimonials:', testError);
    } else {
      console.log('✅ Seeding testimonials selesai.');
    }
  } else {
    console.log('ℹ️ Testimonials sudah terisi, skip.');
  }

  console.log('🎉 Seeding database Supabase berhasil diselesaikan!');
}

main().catch(err => {
  console.error('❌ Error during seed:', err);
  process.exit(1);
});
