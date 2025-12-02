/* ============================================================
   HAMBURGER MENU (untuk header versi mobile)
   Handle buka/tutup + ganti icon bars/X
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");

    // pastikan element ada biar aman
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");

            // ganti icon bars ke X dan sebaliknya
            const icon = hamburger.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("active")) {
                    icon.classList.replace("fa-bars", "fa-times");
                } else {
                    icon.classList.replace("fa-times", "fa-bars");
                }
            }
        });
    }
});



/* ============================================================
   DETAIL BERITA — digunakan di detailberita.html
   ============================================================ */
(function () {
    'use strict';

    // data dummy berita (sama dengan halaman list)
    const newsData = [
        { id:201, title:"UNIK, POLIJE BUKA WISATA EDUKASI PETIK JERUK DI DALAM KAMPUS", cat:"Kegiatan", date:"24 Nov 2025", img:"images/berita 1.png", content:"<p>Teaching factory ...</p>" },
        { id:202, title:"Kunjungan SMA 1 Jember", cat:"Edukasi", date:"20 Nov 2025", img:"https://placehold.co/800x500?text=Kunjungan+SMA", content:"<p>Siswa-siswi mempelajari ...</p>" },
        { id:203, title:"Workshop Biopestisida untuk Mahasiswa", cat:"Edukasi", date:"18 Nov 2025", img:"https://placehold.co/800x500?text=Workshop", content:"<p>Workshop pembuatan ...</p>" },
        { id:204, title:"Uji Coba Varietas Nangka Unggul", cat:"Penelitian", date:"10 Nov 2025", img:"https://placehold.co/800x500?text=Nangka", content:"<p>Tim melakukan uji ...</p>" },
        { id:205, title:"Program Komposter Rumah untuk Staf", cat:"Program", date:"08 Nov 2025", img:"https://placehold.co/800x500?text=Komposter", content:"<p>Distribusi ...</p>" },
        { id:206, title:"Festival Tanaman Hias: Koleksi Langka", cat:"Event", date:"04 Nov 2025", img:"https://placehold.co/800x500?text=Festival+Tanaman", content:"<p>Festival ...</p>" },
        { id:207, title:"Inovasi Irigasi Hemat Air", cat:"Teknologi", date:"01 Nov 2025", img:"https://placehold.co/800x500?text=Irigasi", content:"<p>Sistem irigasi ...</p>" },
        { id:208, title:"Kolaborasi dengan Petani Lokal", cat:"Kolaborasi", date:"28 Okt 2025", img:"https://placehold.co/800x500?text=Kolaborasi", content:"<p>Transfer teknologi ...</p>" },
        { id:209, title:"Pelatihan Hidroponik untuk Pemula", cat:"Edukasi", date:"20 Okt 2025", img:"https://placehold.co/800x500?text=Hidroponik", content:"<p>Pelatihan ...</p>" },
        { id:210, title:"Penanaman Pohon Buah untuk Ketahanan Pangan", cat:"Lingkungan", date:"15 Okt 2025", img:"https://placehold.co/800x500?text=Penanaman+Pohon", content:"<p>Program ...</p>" },
        { id:211, title:"Pameran Hasil Panen & Produk Olahan", cat:"Kegiatan", date:"10 Okt 2025", img:"https://placehold.co/800x500?text=Pameran", content:"<p>Pameran hasil panen ...</p>" },
        { id:212, title:"Program Magang Mahasiswa Agritech", cat:"Program", date:"05 Okt 2025", img:"https://placehold.co/800x500?text=Magang", content:"<p>Mahasiswa ...</p>" },
        { id:213, title:"Evaluasi Kualitas Tanah Berkala", cat:"Penelitian", date:"01 Okt 2025", img:"https://placehold.co/800x500?text=Kualitas+Tanah", content:"<p>Analisis tanah ...</p>" },
        { id:214, title:"Layanan Konsultasi Pertanian Gratis", cat:"Layanan", date:"20 Sep 2025", img:"https://placehold.co/800x500?text=Konsultasi", content:"<p>Konsultasi ...</p>" },
        { id:215, title:"Open House Kebun Inovasi", cat:"Event", date:"10 Sep 2025", img:"https://placehold.co/800x500?text=Open+House", content:"<p>Open house ...</p>" }
    ];

    // helper untuk jaga-jaga biar output tidak rusak
    const escapeHtml = s => 
        s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                     .replace(/"/g,'&quot;').replace(/'/g,'&#039;')
          : '';

    const stripHtml = html => (html || '').replace(/<[^>]*>/g, '').trim();


    /* ----------------------------------------
       Ambil ID dari URL dan cari datanya
       ---------------------------------------- */
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get("id");

    const article = newsData.find(n => String(n.id) === String(newsId));
    const container = document.querySelector(".article-container") || document.body;


    /* ============================================================
       RENDER ARTIKEL — kalau ditemukan
       ============================================================ */
    if (article) {

        // update title browser
        document.title = `${article.title} - Kebun Inovasi`;

        // elemen-elemen detail berita
        const bcTitle = document.getElementById("bc-title");
        const dCat    = document.getElementById("d-cat");
        const dTitle  = document.getElementById("d-title");
        const dDate   = document.getElementById("d-date");
        const dImage  = document.getElementById("d-image");
        const dContent= document.getElementById("d-content");

        if (bcTitle) bcTitle.innerText = article.title;
        if (dCat)    dCat.innerText    = article.cat;
        if (dTitle)  dTitle.innerText  = article.title;
        if (dDate)   dDate.innerText   = article.date;

        // gambar utama artikel
        if (dImage) {
            dImage.src = article.img || "https://placehold.co/800x500?text=No+Image";
            dImage.onerror = () => {
                dImage.src = "https://placehold.co/800x500?text=Gambar+Rusak";
            };
        }

        // isi artikel
        if (dContent) {
            dContent.innerHTML = article.content ||
                `<p>${escapeHtml(stripHtml(article.content || 'Konten belum tersedia'))}</p>`;
        }

        /* ----------------------------------------
           Sidebar: recent post (4 artikel lain)
           ---------------------------------------- */
        const recent = document.getElementById("recent-posts-container");
        if (recent) {
            recent.innerHTML = "";

            const others = newsData
                .filter(n => String(n.id) !== String(article.id))
                .slice(0, 4);

            if (others.length === 0) {
                recent.innerHTML = "<p>Belum ada berita lain.</p>";
            } else {
                others.forEach(it => {
                    const item = document.createElement("a");
                    item.href = `detailberita.html?id=${it.id}`;
                    item.className = "recent-post-item";
                    item.innerHTML = `
                        <div class="rp-thumb">
                            <img src="${escapeHtml(it.img)}" alt="${escapeHtml(it.title)}"
                                 onerror="this.src='https://placehold.co/80?text=No+Img'">
                        </div>
                        <div class="rp-info">
                            <h4>${escapeHtml(it.title)}</h4>
                            <span class="rp-date">${escapeHtml(it.date)}</span>
                        </div>
                    `;
                    recent.appendChild(item);
                });
            }
        }

    } else {
        /* ============================================================
           Halaman NOT FOUND — artikel tidak ditemukan
           ============================================================ */
        container.innerHTML = `
            <div style="text-align:center; padding:50px 0;">
                <i class="fas fa-search" style="font-size:3rem; color:#ccc; margin-bottom:20px;"></i>
                <h2 style="color:var(--green-polije);">Berita Tidak Ditemukan</h2>
                <p style="color:#666; margin-bottom:20px;">Berita yang Anda cari tidak tersedia atau sudah dihapus.</p>
                <a href="berita.html"
                   style="background:var(--orange-cta); color:#fff; padding:10px 25px; 
                          text-decoration:none; border-radius:50px;">
                   Kembali ke Berita
                </a>
            </div>
        `;

        // sembunyikan sidebar biar tampilan lebih rapi
        const side = document.querySelector(".sidebar");
        if (side) side.style.display = "none";
    }

})();
