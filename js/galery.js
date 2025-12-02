    // --- FUNGSI TOGGLE MENU MOBILE (BARU) ---
    function toggleMenu() {
        const nav = document.getElementById('navMenu');
        nav.classList.toggle('active');
    }

    /**
     * KONFIGURASI GALERI
     */
    const GALLERY_CONFIG = {
        USE_API: false,
        STORAGE_KEY: 'galleryItems',
        CHANNEL_NAME: 'gallery_channel'
    };

    // Dataset Default (15 Gambar) - Akan dimuat jika LocalStorage kosong
    const defaultGallery = [
        { id: 'g1', img: "https://placehold.co/600x400/eee/333?text=Panen+Melon", title: "Panen Melon Golden", cat: "Panen", date: "24 Nov 2025", time: "08:00 WIB", desc: "Kegiatan panen raya melon golden varietas unggul bersama mahasiswa magang." },
        { id: 'g2', img: "https://placehold.co/600x400/ddd/333?text=Kunjungan+Rektor", title: "Kunjungan Rektor", cat: "Kegiatan", date: "22 Nov 2025", time: "10:30 WIB", desc: "Kunjungan Bapak Direktur Polije untuk meninjau perkembangan Greenhouse." },
        { id: 'g3', img: "https://placehold.co/600x400/ccc/333?text=Greenhouse+Smart", title: "Smart Greenhouse", cat: "Fasilitas", date: "20 Nov 2025", time: "09:00 WIB", desc: "Fasilitas Greenhouse IoT terbaru yang dilengkapi sensor suhu otomatis." },
        { id: 'g4', img: "https://placehold.co/600x400/bbb/333?text=Panen+Cabai", title: "Panen Cabai Rawit", cat: "Panen", date: "18 Nov 2025", time: "07:00 WIB", desc: "Panen cabai rawit merah di lahan terbuka sektor B." },
        { id: 'g5', img: "https://placehold.co/600x400/aaa/333?text=Workshop+Tani", title: "Workshop Petani", cat: "Kegiatan", date: "15 Nov 2025", time: "13:00 WIB", desc: "Pelatihan pembuatan pupuk organik cair bagi kelompok tani mitra." },
        { id: 'g6', img: "https://placehold.co/600x400/999/333?text=Drone+Sprayer", title: "Uji Coba Drone", cat: "Fasilitas", date: "12 Nov 2025", time: "15:45 WIB", desc: "Demonstrasi penggunaan Drone Sprayer untuk penyemprotan nutrisi." },
        { id: 'g7', img: "https://placehold.co/600x400/888/333?text=Panen+Jagung", title: "Panen Jagung Manis", cat: "Panen", date: "10 Nov 2025", time: "08:15 WIB", desc: "Panen jagung manis ungu (Purple Corn) yang kaya antioksidan." },
        { id: 'g8', img: "https://placehold.co/600x400/777/333?text=Lab+Tanah", title: "Analisis Tanah", cat: "Fasilitas", date: "08 Nov 2025", time: "11:00 WIB", desc: "Kegiatan mahasiswa di Laboratorium Tanah menganalisis unsur hara." },
        { id: 'g9', img: "https://placehold.co/600x400/666/fff?text=Magang+Mahasiswa", title: "Mahasiswa Magang", cat: "Kegiatan", date: "05 Nov 2025", time: "07:30 WIB", desc: "Mahasiswa magang melakukan perawatan rutin tanaman tomat ceri." },
        { id: 'g10', img: "https://placehold.co/600x400/555/fff?text=Panen+Edamame", title: "Ekspor Edamame", cat: "Panen", date: "01 Nov 2025", time: "06:00 WIB", desc: "Proses pemanenan edamame kualitas ekspor tujuan Jepang." },
        { id: 'g11', img: "https://placehold.co/600x400/444/fff?text=Mesin+Sortir", title: "Mesin Grading", cat: "Fasilitas", date: "28 Okt 2025", time: "14:00 WIB", desc: "Mesin otomatis untuk memisahkan ukuran buah berdasarkan berat." },
        { id: 'g12', img: "https://placehold.co/600x400/333/fff?text=Kuliah+Lapang", title: "Kuliah Lapang", cat: "Kegiatan", date: "25 Okt 2025", time: "09:30 WIB", desc: "Dosen memberikan materi langsung di lapangan mengenai identifikasi hama." },
        { id: 'g13', img: "https://placehold.co/600x400/222/fff?text=Kebun+Hidroponik", title: "Instalasi NFT", cat: "Fasilitas", date: "20 Okt 2025", time: "16:00 WIB", desc: "Tampilan instalasi hidroponik sistem NFT." },
        { id: 'g14', img: "https://placehold.co/600x400/111/fff?text=Panen+Jeruk", title: "Wisata Petik Jeruk", cat: "Panen", date: "15 Okt 2025", time: "10:00 WIB", desc: "Pengunjung menikmati sensasi memetik jeruk keprok langsung dari pohonnya." },
        { id: 'g15', img: "https://placehold.co/600x400/000/fff?text=Rapat+Koordinasi", title: "Rapat Tim", cat: "Kegiatan", date: "10 Okt 2025", time: "08:00 WIB", desc: "Rapat koordinasi mingguan pengelola kebun." }
    ];

    // Variabel State
    let galleryData = [];
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentFilter = 'all';
    let filteredData = [];

    // --- 1. DATA HANDLING ---
    
    function loadGalleryData() {
        if (GALLERY_CONFIG.USE_API) {
            // Simulasi API call (Placeholder logic)
            console.log("Fetching from API...");
        } else {
            const stored = localStorage.getItem(GALLERY_CONFIG.STORAGE_KEY);
            if (stored) {
                galleryData = JSON.parse(stored);
            } else {
                galleryData = defaultGallery;
                localStorage.setItem(GALLERY_CONFIG.STORAGE_KEY, JSON.stringify(galleryData));
            }
        }
        // Apply filter setelah load
        filterGallery(currentFilter, null);
    }

    function escapeHtml(unsafe) {
        return (unsafe || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- 2. RENDERING ---

    function renderGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;

        // Animasi Fade Out sebelum ganti konten
        const oldItems = grid.querySelectorAll('.gallery-item');
        if (oldItems.length > 0) {
            oldItems.forEach(item => item.classList.add('fade-out'));
            setTimeout(() => {
                grid.innerHTML = '';
                insertItemsToGrid();
            }, 300); // Waktu sesuai transisi CSS
        } else {
            grid.innerHTML = '';
            insertItemsToGrid();
        }
    }

    function insertItemsToGrid() {
        const grid = document.getElementById('galleryGrid');
        
        // Pagination Logic
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
            // Staggered animation delay
            div.style.animationDelay = `${index * 0.05}s`;
            
            // Event listener untuk Lightbox
            div.onclick = function() { 
                openLightbox(item.id); 
            };

            div.innerHTML = `
                <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
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

    // --- 3. FILTER & PAGINATION ---

    function filterGallery(category, btn) {
        currentFilter = category;
        currentPage = 1;

        // Update Visual Tombol
        if (btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }

        // Filter Data
        if (category === 'all') {
            filteredData = galleryData;
        } else {
            filteredData = galleryData.filter(item => item.cat === category);
        }

        renderGallery();
    }

    function changePage(direction) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        if (direction === 'prev') {
            if (currentPage > 1) currentPage--;
        } else if (direction === 'next') {
            if (currentPage < totalPages) currentPage++;
        } else if (typeof direction === 'number') {
            currentPage = direction;
        }

        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        updatePaginationButtons();
        renderGallery();
    }

    function updatePaginationButtons() {
        // Reset active class pada tombol angka (id btn1, btn2, btn3)
        document.querySelectorAll('.page-link').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`btn${currentPage}`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // --- 4. LIGHTBOX LOGIC ---

    function openLightbox(id) {
        // Cari data terbaru dari memory (memastikan sinkronisasi)
        const item = galleryData.find(x => x.id == id);

        if (!item) {
            alert("Gambar ini mungkin telah dihapus oleh admin.");
            renderGallery(); // Refresh grid untuk menghilangkan item yg hilang
            return;
        }

        const lightbox = document.getElementById('lightbox');
        
        // Set Data Aman
        document.getElementById('lb-img').src = escapeHtml(item.img);
        document.getElementById('lb-title').textContent = item.title;
        document.getElementById('lb-date').textContent = item.date;
        document.getElementById('lb-time').textContent = item.time;
        document.getElementById('lb-desc').textContent = item.desc;

        lightbox.classList.add('active');
    }

    function closeLightbox(e) {
        // Tutup jika klik overlay atau tombol close
        if (!e || e.target.id === 'lightbox' || e.target.classList.contains('close-lightbox')) {
            document.getElementById('lightbox').classList.remove('active');
        }
    }

    // --- 5. SINKRONISASI REALTIME (ADMIN) ---
    
    const channel = new BroadcastChannel(GALLERY_CONFIG.CHANNEL_NAME);
    
    channel.onmessage = (event) => {
        if (event.data === 'update_gallery') {
            // Reload data dari storage
            loadGalleryData();
            // Re-render tanpa refresh halaman
            renderGallery();
            
            // Cek jika lightbox sedang terbuka, apakah itemnya masih ada?
            const lightbox = document.getElementById('lightbox');
            if (lightbox.classList.contains('active')) {
                const currentImgSrc = document.getElementById('lb-img').src;
                // Cari apakah gambar ini masih ada di data baru
                const exists = galleryData.some(item => currentImgSrc.includes(item.img));
                if (!exists) {
                    alert("Gambar yang sedang Anda lihat baru saja dihapus oleh admin.");
                    closeLightbox();
                }
            }
        }
    };

    // Fallback untuk browser lama / storage event
    window.addEventListener('storage', (e) => {
        if (e.key === GALLERY_CONFIG.STORAGE_KEY) {
            loadGalleryData();
            renderGallery();
        }
    });

    // Scroll Animation Helper
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);

    // --- INISIALISASI ---
    document.addEventListener('DOMContentLoaded', () => {
        loadGalleryData();
        // Set tombol filter 'Semua' jadi aktif default
        const allBtn = document.querySelector('.filter-btn'); 
        if(allBtn) filterGallery('all', allBtn);
        reveal();
    });