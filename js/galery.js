// --- FUNGSI TOGGLE MENU MOBILE (BARU) ---
function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('active');
}

/**
 * KONFIGURASI GALERI – versi tanpa localhost & storage
 */
const GALLERY_CONFIG = {
    USE_API: false,              // tetap false
    STORAGE_KEY: 'galleryItems', // tidak digunakan lagi
    CHANNEL_NAME: 'gallery_channel'
};

// Dataset Default (15 Gambar)
const defaultGallery = [
    { id: 'g1', img: "images/panen melon.jpg", title: "Panen Melon Golden", cat: "Panen", date: "24 Nov 2025", time: "08:00 WIB", desc: "Kegiatan panen raya melon golden varietas unggul bersama mahasiswa magang." },
    { id: 'g2', img: "images/kunjungan rektor.jpg", title: "Kunjungan Rektor", cat: "Kegiatan", date: "22 Nov 2025", time: "10:30 WIB", desc: "Kunjungan Bapak Direktur Polije untuk meninjau perkembangan Greenhouse." },
    { id: 'g3', img: "images/greenhouse.jpg", title: "Smart Greenhouse", cat: "Fasilitas", date: "20 Nov 2025", time: "09:00 WIB", desc: "Fasilitas Greenhouse IoT terbaru yang dilengkapi sensor suhu otomatis." },
    { id: 'g4', img: "images/panen cabai.jpg", title: "Panen Cabai Rawit", cat: "Panen", date: "18 Nov 2025", time: "07:00 WIB", desc: "Panen cabai rawit merah di lahan terbuka sektor B." },
    { id: 'g5', img: "images/workshop tani.jpg", title: "Workshop Petani", cat: "Kegiatan", date: "15 Nov 2025", time: "13:00 WIB", desc: "Pelatihan pembuatan pupuk organik cair bagi kelompok tani mitra." },
    { id: 'g6', img: "images/drone.jpg", title: "Uji Coba Drone", cat: "Fasilitas", date: "12 Nov 2025", time: "15:45 WIB", desc: "Demonstrasi penggunaan Drone Sprayer untuk penyemprotan nutrisi." },
    { id: 'g7', img: "images/panen jagung.jpg", title: "Panen Jagung Manis", cat: "Panen", date: "10 Nov 2025", time: "08:15 WIB", desc: "Panen jagung manis ungu (Purple Corn) yang kaya antioksidan." },
    { id: 'g8', img: "images/lab tanah.jpg", title: "Analisis Tanah", cat: "Fasilitas", date: "08 Nov 2025", time: "11:00 WIB", desc: "Kegiatan mahasiswa di Laboratorium Tanah menganalisis unsur hara." },
    { id: 'g9', img: "images/magang mahasiswaa.jpg", title: "Mahasiswa Magang", cat: "Kegiatan", date: "05 Nov 2025", time: "07:30 WIB", desc: "Mahasiswa magang melakukan perawatan rutin tanaman tomat ceri." },
    { id: 'g10', img: "images/panen edamame.jpg", title: "Ekspor Edamame", cat: "Panen", date: "01 Nov 2025", time: "06:00 WIB", desc: "Proses pemanenan edamame kualitas ekspor tujuan Jepang." },
    { id: 'g11', img: "images/kebun sortir.jpg", title: "Mesin Grading", cat: "Fasilitas", date: "28 Okt 2025", time: "14:00 WIB", desc: "Mesin otomatis untuk memisahkan ukuran buah berdasarkan berat." },
    { id: 'g12', img: "images/kuliah lapang.jpg", title: "Kuliah Lapang", cat: "Kegiatan", date: "25 Okt 2025", time: "09:30 WIB", desc: "Dosen memberikan materi langsung di lapangan mengenai identifikasi hama." },
    { id: 'g13', img: "images/panen hidroponik.jpg", title: "Instalasi NFT", cat: "Fasilitas", date: "20 Okt 2025", time: "16:00 WIB", desc: "Tampilan instalasi hidroponik sistem NFT." },
    { id: 'g14', img: "images/petikjeruk.jpg", title: "Wisata Petik Jeruk", cat: "Panen", date: "15 Okt 2025", time: "10:00 WIB", desc: "Pengunjung menikmati sensasi memetik jeruk keprok langsung dari pohonnya." },
    { id: 'g15', img: "images/rapat koordinasi.jpg", title: "Rapat Tim", cat: "Kegiatan", date: "10 Okt 2025", time: "08:00 WIB", desc: "Rapat koordinasi mingguan pengelola kebun." }
];

// State
let galleryData = defaultGallery;   // langsung statis
let currentPage = 1;
const itemsPerPage = 8;
let currentFilter = 'all';
let filteredData = [];

// Escape HTML (aman dari XSS)
function escapeHtml(unsafe) {
    return (unsafe || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// LOAD DATA — versi statis tanpa localStorage
function loadGalleryData() {
    galleryData = defaultGallery;
    filterGallery(currentFilter, null);
}

// Rendering
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    insertItemsToGrid();
}

function insertItemsToGrid() {
    const grid = document.getElementById('galleryGrid');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredData.slice(start, end);

    if (pageItems.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px; color:#888;">Tidak ada foto dalam kategori ini.</p>`;
        return;
    }

    pageItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animationDelay = `${index * 0.05}s`;

        div.onclick = () => openLightbox(item.id);

        div.innerHTML = `
            <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}"
                onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            <div class="overlay">
                <i class="fas fa-search-plus"></i>
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.cat)}</p>
            </div>
        `;
        grid.appendChild(div);
    });

    updatePaginationButtons();
}

// FILTER
function filterGallery(category, btn) {
    currentFilter = category;
    currentPage = 1;

    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    filteredData = category === 'all'
        ? galleryData
        : galleryData.filter(i => i.cat === category);

    renderGallery();
}

// Pagination
function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (direction === 'prev' && currentPage > 1) currentPage--;
    if (direction === 'next' && currentPage < totalPages) currentPage++;
    if (typeof direction === 'number') currentPage = direction;

    renderGallery();
    updatePaginationButtons();
}

function updatePaginationButtons() {
    document.querySelectorAll('.page-link').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(`btn${currentPage}`);
    if (btn) btn.classList.add('active');
}

// Lightbox
function openLightbox(id) {
    const item = galleryData.find(x => x.id == id);
    if (!item) return alert("Foto tidak ditemukan.");

    document.getElementById('lb-img').src = escapeHtml(item.img);
    document.getElementById('lb-title').textContent = item.title;
    document.getElementById('lb-date').textContent = item.date;
    document.getElementById('lb-time').textContent = item.time;
    document.getElementById('lb-desc').textContent = item.desc;

    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox(e) {
    if (!e || e.target.id === 'lightbox' || e.target.classList.contains('close-lightbox')) {
        document.getElementById('lightbox').classList.remove('active');
    }
}

// Animasi Scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", reveal);

// INIT
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryData();

    const allBtn = document.querySelector('.filter-btn');
    if (allBtn) filterGallery('all', allBtn);

    reveal();
});
