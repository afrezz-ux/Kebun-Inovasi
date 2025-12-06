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
    { id: 'p1', name: "Jeruk Siam", category: "Buah", price: 12000, unit: "/kg", stock: 50, img: "images/jeruk1.jpg", desc: "Jeruk Siam segar dengan rasa manis asam yang pas, kaya vitamin C." },
    { id: 'p2', name: "Mangga Harum Manis", category: "Buah", price: 30000, unit: "/kg", stock: 30, img: "images/mangga.jpg", desc: "Mangga kualitas super, daging tebal, biji tipis, dan serat halus." },
    { id: 'p3', name: "Nanas Madu", category: "Buah", price: 18000, unit: "/buah", stock: 40, img: "images/nanas.jpg", desc: "Nanas madu lokal anti gatal di lidah, sangat manis." },
    { id: 'p4', name: "Jeruk Pamelo", category: "Buah", price: 15000, unit: "/kg", stock: 25, img: "images/jerukpamelo.jpg", desc: "Jeruk Pamelo lokal segar dengan kandungan air melimpah." },
    { id: 'p5', name: "Semangka", category: "Buah", price: 25000, unit: "/kg", stock: 15, img: "images/semangka.png", desc: "Semangka merah segar dengan rasa manis alami yang menyegarkan." },
    
    { id: 't1', name: "Tabulampot Jambu", category: "Tabulampot", price: 250000, unit: "/pot", stock: 5, img: "images/tabulampotjeruk.jpg", desc: "Bibit Jambu Air Citra dalam pot siap berbuah." },
    { id: 't2', name: "Tabulampot Jeruk", category: "Tabulampot", price: 275000, unit: "/pot", stock: 3, img: "images/tabulampotmangga.jpg", desc: "Jeruk Dekopon Jepang unik dengan tonjolan." },
    { id: 't3', name: "Tabulampot Nanas", category: "Tabulampot", price: 300000, unit: "/pot", stock: 4, img: "images/tabulampotnanas.png", desc: "Kelengkeng Itoh super genjah, daging tebal." }
];

// --- CORE FUNCTIONS ---

/**
 */
async function loadProducts() {
    let products = [];

    // Jika API digunakan
    if (CONFIG.USE_API) {
        try {
            const response = await fetch(CONFIG.API_ENDPOINT);
            products = await response.json();
            return products;
        } catch (error) {
            console.error("Gagal memuat API, menggunakan dataset awal.", error);
        }
    }

    // Selalu pakai dataset awal
    return initialDataset;
}

/**
 * Render produk ke DOM
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
        if (item.category !== 'Buah' && item.category !== 'Tabulampot') return;

        const price = new Intl.NumberFormat('id-ID').format(item.price);
        
        const safeName = document.createElement('div'); safeName.innerText = item.name;
        const safeCat = document.createElement('div'); safeCat.innerText = item.category;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
        card.style.opacity = '0';
        
        card.innerHTML = `
            <div class="prod-img-box">
                <span class="badge-cat">${safeCat.innerHTML}</span>
                <img src="${item.img}" alt="${safeName.innerHTML}" loading="lazy" 
                     onerror="this.src='https://placehold.co/300?text=No+Image'">
            </div>
            <div class="prod-details">
                <h3 class="prod-title">${safeName.innerHTML}</h3>
                <div class="prod-price">
                    Rp ${price} 
                    <span class="prod-unit" style="font-size:0.8rem; color:#999; font-weight:normal;">
                        ${item.unit || ''}
                    </span>
                </div>
                <a href="detailproduk.html?id=${item.id}" class="btn-detail">Lihat Detail</a>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Filter produk berdasarkan kategori
 */
async function filterProducts(category) {
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));

    const activeBtn = document.getElementById(`cat-${category}`);
    if (activeBtn) activeBtn.classList.add('active');

    const allProducts = await loadProducts();
    
    if (category === 'all') render(allProducts);
    else render(allProducts.filter(p => p.category === category));
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('kategori');
    
    if (catParam) filterProducts(catParam);
    else filterProducts('all');
});

// Animasi
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInUp { 
    from { opacity: 0; transform: translateY(20px); } 
    to { opacity: 1; transform: translateY(0); } 
}`;
document.head.appendChild(style);
