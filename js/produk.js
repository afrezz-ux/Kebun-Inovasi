    // --- FUNGSI TOGGLE MENU MOBILE ---
    function toggleMenu() {
        const nav = document.getElementById('navMenu');
        nav.classList.toggle('active');
    }

    /**
     * KONFIGURASI SISTEM
     */
    const CONFIG = {
        USE_API: false, 
        API_ENDPOINT: '/api/products',
        STORAGE_KEY: 'products',
        CHANNEL_NAME: 'products_channel' 
    };

    // DATASET AWAL 
    const initialDataset = [
        { id: 'p1', name: "Jeruk Keprok", category: "Buah", price: 20000, unit: "/kg", stock: 50, img: "images/jeruk1.jpg", desc: "Jeruk Keprok segar dengan rasa manis asam yang pas, kaya vitamin C." },
        { id: 'p2', name: "Mangga Harum Manis", category: "Buah", price: 30000, unit: "/kg", stock: 30, img: "images/mangga.jpg", desc: "Mangga kualitas super, daging tebal, biji tipis, dan serat halus." },
        { id: 'p3', name: "Nanas Madu", category: "Buah", price: 18000, unit: "/buah", stock: 40, img: "images/nanas.jpg", desc: "Nanas madu lokal anti gatal di lidah, sangat manis." },
        { id: 'p4', name: "Jeruk Lemon", category: "Buah", price: 25000, unit: "/kg", stock: 25, img: "images/jeruk2.jpg", desc: "Lemon lokal segar dengan kandungan air melimpah." },
        { id: 'p5', name: "semangka ", category: "Buah", price: 25000, unit: "/kg", stock: 15, img: "images/semangka.jpg", desc: "Semangka merah segar dengan rasa manis alami yang menyegarkan, kaya air dan vitamin.." },
        
        { id: 't1', name: "Tabulampot Jambu", category: "Tabulampot", price: 150000, unit: "/pot", stock: 5, img: "images/TabulampotJambuHijau.jpg", desc: "Bibit Jambu Air Citra dalam pot siap berbuah." },
        { id: 't2', name: "Tabulampot Jeruk", category: "Tabulampot", price: 250000, unit: "/pot", stock: 3, img: "images/TabulampotJambuHijau.jpg", desc: "Jeruk Dekopon jepang unik dengan tonjolan." },
        { id: 't3', name: "Tabulampot nanas", category: "Tabulampot", price: 175000, unit: "/pot", stock: 4, img: "images/menanam-nanas-di-pot.jpg", desc: "Kelengkeng Itoh super genjah, daging tebal." }
    ];

    // --- CORE FUNCTIONS ---

    /**
     * Memuat data produk dari Storage atau API
     */
    async function loadProducts() {
        let products = [];
        
        if (CONFIG.USE_API) {
            try {
                const response = await fetch(CONFIG.API_ENDPOINT);
                products = await response.json();
            } catch (error) {
                console.error("Gagal memuat API, menggunakan LocalStorage.", error);
            }
        }

        if (products.length === 0) {
            const storedData = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (storedData) {
                products = JSON.parse(storedData);
            } else {
                // Inisialisasi data awal jika kosong
                products = initialDataset;
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(products));
            }
        }
        return products;
    }

    /**
     * Render produk ke dalam DOM
     */
    function render(products) {
        const container = document.getElementById('productContainer');
        container.innerHTML = '';

        if (!products || products.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#666;">
                <i class="fas fa-box-open" style="font-size:2rem; margin-bottom:10px; display:block;"></i>
                Belum ada produk tersedia untuk kategori ini.
            </div>`;
            return;
        }

        products.forEach((item, index) => {
            // Validasi Kategori: Hanya tampilkan jika kategori Buah atau Tabulampot
            // (Jaga-jaga jika ada data kotor dari input admin sebelumnya)
            if (item.category !== 'Buah' && item.category !== 'Tabulampot') return;

            // Format Rupiah
            const price = new Intl.NumberFormat('id-ID').format(item.price);
            
            // Sanitasi input sederhana
            const safeName = document.createElement('div'); safeName.innerText = item.name;
            const safeCat = document.createElement('div'); safeCat.innerText = item.category;

            // Element Creation
            const card = document.createElement('div');
            card.className = 'product-card';
            // Animasi Staggered
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
            card.style.opacity = '0'; 
            
            card.innerHTML = `
                <div class="prod-img-box">
                    <span class="badge-cat">${safeCat.innerHTML}</span>
                    <img src="${item.img}" alt="${safeName.innerHTML}" loading="lazy" onerror="this.src='https://placehold.co/300?text=No+Image'">
                </div>
                <div class="prod-details">
                    <h3 class="prod-title">${safeName.innerHTML}</h3>
                    <div class="prod-price">Rp ${price} <span class="prod-unit" style="font-size:0.8rem; color:#999; font-weight:normal;">${item.unit || ''}</span></div>
                    <a href="detailproduk.html?id=${item.id}" class="btn-detail">Lihat Detail</a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    /**
     * Filter Produk berdasarkan Kategori
     * Diperbarui untuk menangani Active State Sidebar secara otomatis
     */
    async function filterProducts(category) {
        // 1. UI Sidebar 
        document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
        
        // Cari elemen berdasarkan ID agar sinkron dengan parameter URL
        const activeBtn = document.getElementById(`cat-${category}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // 2. Load & Filter Data
        const allProducts = await loadProducts();
        
        if (category === 'all') {
            render(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === category);
            render(filtered);
        }
    }

    // --- INITIALIZATION & SYNC ---

    // 1. Load pertama kali
    document.addEventListener('DOMContentLoaded', async () => {
        // Cek URL Param untuk filter awal (misal: ?kategori=Buah)
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('kategori');
        
        if (catParam) {
            // Jika ada parameter URL, jalankan filter spesifik
            filterProducts(catParam);
        } else {
            // Jika tidak ada, load semua dan set sidebar ke 'all'
            filterProducts('all');
        }
    });

    // 2. Sinkronisasi Realtime antar Tab
    const channel = new BroadcastChannel(CONFIG.CHANNEL_NAME);
    channel.onmessage = async (event) => {
        if (event.data === 'update_products') {
            // Refresh tampilan saat ada update namun tetap di kategori yang sama
            const currentActive = document.querySelector('.cat-item.active');
            const currentCat = currentActive ? currentActive.id.replace('cat-', '') : 'all';
            filterProducts(currentCat);
        }
    };

    // 3. Sinkronisasi Storage Event
    window.addEventListener('storage', async (e) => {
        if (e.key === CONFIG.STORAGE_KEY) {
            const currentActive = document.querySelector('.cat-item.active');
            const currentCat = currentActive ? currentActive.id.replace('cat-', '') : 'all';
            filterProducts(currentCat);
        }
    });

    // CSS Tambahan untuk Animasi JS
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);


