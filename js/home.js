// Simpan data produk aktif ke variabel global
let currentFeaturedProducts = [];

// Saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    initModalSystem();
    tampilkanProdukUnggulan();
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

    // 🔥 DATA FIX — SELALU DIPAKAI, TANPA LOCALSTORAGE
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
            img: "images/tabulampotjeruk.jpg",
            desc: "Tabulampot jeruk unggulan, cepat berbuah, perawatan mudah, dan cocok untuk halaman rumah."
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

    // 👉 Gunakan langsung data default
    currentFeaturedProducts = defaultData;

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

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalCategory').innerText = product.category;
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + (product.unit || '');

    document.getElementById('modalDetailBtn').onclick = function() {
        window.location.href = `detailproduk.html?id=${product.id}`;
    };

    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Inject Modal
function initModalSystem() {
    const style = document.createElement('style');
    style.innerHTML = `
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
            display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; z-index: 9999;
            transition: all .3s ease;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal-box {
            background: #fff; width: 90%; max-width: 800px;
            border-radius: 14px; overflow: hidden;
            display: flex; flex-direction: column;
            transform: scale(.9); transition: transform .3s;
        }
        .modal-overlay.active .modal-box { transform: scale(1); }
        @media(min-width:768px){
            .modal-box { flex-direction: row; height: 460px; }
        }
    `;
    document.head.appendChild(style);

    const modalHTML = `
        <div id="productModal" class="modal-overlay" onclick="if(event.target===this) closeProductModal()">
            <div class="modal-box">
                <button class="modal-close" onclick="closeProductModal()">&times;</button>
                <div class="modal-img-area"><img id="modalImg" src=""></div>
                <div class="modal-content-area">
                    <span id="modalCategory" class="modal-cat">Kategori</span>
                    <h2 id="modalTitle" class="modal-title">Nama Produk</h2>
                    <div id="modalPrice" class="modal-price">Rp 0</div>
                    <button id="modalDetailBtn" class="btn-detail">Lihat Detail Produk</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}


