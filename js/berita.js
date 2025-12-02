/* ============================================================
   1. SCRIPT HAMBURGER MENU
   Meng-handle buka/tutup menu mobile + ganti ikon (bars ↔ X)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger-btn");
    const navMenu = document.getElementById("nav-menu");

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");

        // Ganti icon menu
        const icon = hamburger.querySelector("i");
        if (icon) {
            if (navMenu.classList.contains("active")) {
                icon.classList.replace("fa-bars", "fa-times");
            } else {
                icon.classList.replace("fa-times", "fa-bars");
            }
        }
    });
});


/* ============================================================
   2. DATA BERITA — DUMMY / STATIC  
   Disiapkan untuk kebutuhan listing berita
   ============================================================ */
const newsData = [
    { id:201, title:"UNIK, POLIJE BUKA WISATA EDUKASI PETIK JERUK DI DALAM KAMPUS", cat:"Kegiatan", date:"24 Nov 2025", img:"images/berita 1.png", content:"<p>Teaching factory ...</p>" },
    { id:202, title:"Kunjungan SMA 1 Jember", cat:"Edukasi", date:"20 Nov 2025", img:"https://placehold.co/800x500?text=Kunjungan+SMA", content:"<p>Siswa-siswi ...</p>" },
    { id:203, title:"Workshop Biopestisida untuk Mahasiswa", cat:"Edukasi", date:"18 Nov 2025", img:"https://placehold.co/800x500?text=Workshop", content:"<p>Workshop ...</p>" },
    { id:204, title:"Uji Coba Varietas Nangka Unggul", cat:"Penelitian", date:"10 Nov 2025", img:"https://placehold.co/800x500?text=Nangka", content:"<p>Tim melakukan ...</p>" },
    { id:205, title:"Program Komposter Rumah untuk Staf", cat:"Program", date:"08 Nov 2025", img:"https://placehold.co/800x500?text=Komposter", content:"<p>Distribusi ...</p>" },
    { id:206, title:"Festival Tanaman Hias: Koleksi Langka", cat:"Event", date:"04 Nov 2025", img:"https://placehold.co/800x500?text=Festival+Tanaman", content:"<p>Festival ...</p>" },
    { id:207, title:"Inovasi Irigasi Hemat Air", cat:"Teknologi", date:"01 Nov 2025", img:"https://placehold.co/800x500?text=Irigasi", content:"<p>Sistem ...</p>" },
    { id:208, title:"Kolaborasi dengan Petani Lokal", cat:"Kolaborasi", date:"28 Okt 2025", img:"https://placehold.co/800x500?text=Kolaborasi", content:"<p>Transfer ...</p>" },
    { id:209, title:"Pelatihan Hidroponik untuk Pemula", cat:"Edukasi", date:"20 Okt 2025", img:"https://placehold.co/800x500?text=Hidroponik", content:"<p>Pelatihan ...</p>" },
    { id:210, title:"Penanaman Pohon Buah untuk Ketahanan Pangan", cat:"Lingkungan", date:"15 Okt 2025", img:"https://placehold.co/800x500?text=Penanaman+Pohon", content:"<p>Program ...</p>" },
    { id:211, title:"Pameran Hasil Panen & Produk Olahan", cat:"Kegiatan", date:"10 Okt 2025", img:"https://placehold.co/800x500?text=Pameran", content:"<p>Pameran ...</p>" },
    { id:212, title:"Program Magang Mahasiswa Agritech", cat:"Program", date:"05 Okt 2025", img:"https://placehold.co/800x500?text=Magang", content:"<p>Mahasiswa ...</p>" },
    { id:213, title:"Evaluasi Kualitas Tanah Berkala", cat:"Penelitian", date:"01 Okt 2025", img:"https://placehold.co/800x500?text=Kualitas+Tanah", content:"<p>Analisis ...</p>" },
    { id:214, title:"Layanan Konsultasi Pertanian Gratis", cat:"Layanan", date:"20 Sep 2025", img:"https://placehold.co/800x500?text=Konsultasi", content:"<p>Konsultasi ...</p>" },
    { id:215, title:"Open House Kebun Inovasi", cat:"Event", date:"10 Sep 2025", img:"https://placehold.co/800x500?text=Open+House", content:"<p>Open house ...</p>" }
];


/* ============================================================
   PENGATURAN PAGINASI
   ============================================================ */
const itemsPerPage = 6;
let currentPage = 1;


/* ============================================================
   HELPER: Menghapus tag HTML dari konten
   ============================================================ */
function strip(html) {
    return html.replace(/<[^>]*>/g, "").trim();
}


/* ============================================================
   HELPER: Membuat excerpt pendek untuk preview
   ============================================================ */
function makeExcerpt(html) {
    const text = strip(html);
    return text.length > 120 ? text.slice(0, 120) + "..." : text;
}


/* ============================================================
   MEMBUAT CARD BERITA & MEMASUKKANNYA KE GRID
   ============================================================ */
function insertCards(items, container) {
    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "news-card";
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="news-thumb">
                <span class="news-date-badge">${item.date}</span>
                <img src="${item.img}" alt="${item.title}"
                     onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            </div>
            
            <div class="news-content">
                <span class="news-category">${item.cat}</span>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${makeExcerpt(item.content)}</p>
                <a href="detailberita.html?id=${item.id}" class="read-more-link">
                    Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}


/* ============================================================
   RENDER BERITA PER HALAMAN
   ============================================================ */
function renderNews(page) {
    const grid = document.getElementById("newsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const paginatedItems = newsData.slice(start, start + itemsPerPage);

    insertCards(paginatedItems, grid);

    // Update tombol pagination aktif
    document.querySelectorAll(".page-link").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`btn${page}`);
    if (activeBtn) activeBtn.classList.add("active");
}


/* ============================================================
   HANDLER PAGINATION (Prev / Next / Number)
   ============================================================ */
function changePage(page) {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);

    if (page === "prev" && currentPage > 1) {
        currentPage--;
    } 
    else if (page === "next" && currentPage < totalPages) {
        currentPage++;
    } 
    else if (typeof page === "number") {
        currentPage = page;
    }

    renderNews(currentPage);
}


/* ============================================================
   INIT — Render pertama kali
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    renderNews(1);
});
