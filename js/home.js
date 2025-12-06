// Simpan data produk di variabel global agar mudah diakses oleh Modal
let currentFeaturedProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    initModalSystem(); // 1. Siapkan sistem modal
    tampilkanProdukUnggulan(); // 2. Tampilkan produk
});

// Helper: Format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
};

function tampilkanProdukUnggulan() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    // Data Default (Sudah diperbaiki deskripsi)
    const defaultData = [
        { 
            id: 'p1', 
            name: "Jeruk Keprok", 
            category: "Buah", 
            price: 20000, 
            unit: "/kg", 
            img: "images/jeruk1.jpg",
            desc: "Jeruk keprok segar langsung dari petani, memiliki rasa manis dan sedikit asam yang menyegarkan."
        },

        { 
            id: 'p2', 
            name: "Mangga Harum Manis", 
            category: "Buah", 
            price: 30000, 
            unit: "/kg", 
            img: "images/mangga.jpg",
            desc: "Mangga harum manis berkualitas premium, daging tebal, rasa manis legit, dan biji tipis."
        },

        { 
            id: 't1', 
            name: "Tabulampot Jambu", 
            category: "Tabulampot", 
            price: 150000, 
            unit: "/pot", 
            img: "images/jambu.png",
            desc: "Tabulampot Jambu Kristal unggulan, cepat berbuah, perawatan mudah, dan cocok untuk halaman rumah."
        },

        { 
            id: 't3', 
            name: "Tabulampot Nanas", 
            category: "Tabulampot", 
            price: 175000, 
            unit: "/pot", 
            img: "images/menanam-nanas-di-pot.jpg",
            desc: "Tabulampot Nanas Madu, tanaman kuat dengan rasa buah manis alami, ideal untuk dekorasi teras."
        }
    ];

    // >>> Tidak pakai localStorage lagi ←←←
    const products = defaultData;

    // Ambil 4 produk pertama & simpan ke variabel global
    currentFeaturedProducts = products.slice(0, 4);

    // Render HTML
    container.innerHTML = currentFeaturedProducts.map((item, index) => {
        const imgSource = item.img || 'https://placehold.co/300x300/eee/333?text=No+Image';

        return `
            <div class="product-card" 
                 onclick="openProductModal(${index})" 
                 title="Klik untuk melihat detail">
                
                <div class="p-img">
                    <img src="${imgSource}" 
                         alt="${item.name}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://placehold.co/300x300/eee/333?text=Img+Error'">

                    <div class="overlay-icon">
                        <i class="fas fa-search-plus"></i> Lihat
                    </div>
                </div>
                
                <div class="p-info">
                    <span class="p-cat">${item.category}</span>
                    <h4 class="p-title">${item.name}</h4>
                    <div class="p-price">
                        ${formatRupiah(item.price)}
                        <small>${item.unit || ""}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- SISTEM MODAL ---
function openProductModal(index) {
    const product = currentFeaturedProducts[index];
    if (!product) return;

    document.getElementById('modalImg').src = product.img || 'https://placehold.co/300x300/eee/333?text=No+Image';
    document.getElementById('modalCategory').innerText = product.category;
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + (product.unit || '');

    const detailBtn = document.getElementById('modalDetailBtn');
    detailBtn.onclick = function() {
        window.location.href = `detailproduk.html?id=${product.id}`;
    };

    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Inject Modal HTML + CSS
function initModalSystem() {

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            z-index: 9999;
            transition: all .3s ease;
        }
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-box {
            background: #fff;
            width: 90%;
            max-width: 800px;
            border-radius: 14px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: scale(.9);
            transition: transform .3s;
        }
        .modal-overlay.active .modal-box {
            transform: scale(1);
        }
        @media(min-width:768px){
            .modal-box { flex-direction: row; height: 460px; }
        }

        .modal-img-area {
            flex: 1;
            background: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 25px;
        }
        .modal-img-area img {
            max-width: 100%;
            border-radius: 8px;
        }

        .modal-content-area {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
        }

        .modal-close {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 30px;
            background: none;
            border: none;
            cursor: pointer;
            color: #888;
        }
        .modal-close:hover { color:#333; }

        .modal-cat { 
            color: #27ae60; 
            font-weight: 600; 
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .modal-title { font-size: 1.9rem; margin: 0 0 15px 0; }
        .modal-price { font-size: 1.8rem; color:#e74c3c; font-weight:700; margin-bottom: 25px; }

        .modal-actions { margin-top: auto; }
        .btn-detail {
            padding: 12px; width: 100%;
            background: #27ae60;
            color: #fff; border: none;
            border-radius: 6px; cursor: pointer;
            font-weight: 600;
        }
        .btn-detail:hover { background:#1f8f4c; }

        .product-card:hover { transform: translateY(-5px); box-shadow:0 10px 20px rgba(0,0,0,.1); }
    `;
    document.head.appendChild(style);

    // Inject HTML Modal
    const modalHTML = `
        <div id="productModal" class="modal-overlay" onclick="if(event.target===this) closeProductModal()">
            <div class="modal-box">
                <button class="modal-close" onclick="closeProductModal()">&times;</button>

                <div class="modal-img-area">
                    <img id="modalImg" src="">
                </div>

                <div class="modal-content-area">
                    <span id="modalCategory" class="modal-cat">Kategori</span>
                    <h2 id="modalTitle" class="modal-title">Nama Produk</h2>
                    <div id="modalPrice" class="modal-price">Rp 0</div>

                    <div class="modal-actions">
                        <button id="modalDetailBtn" class="btn-detail">Lihat Detail Produk</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProductModal();
    });
}
