

// Simpan data produk di variabel global agar mudah diakses oleh Modal
let currentFeaturedProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    initModalSystem(); // 1. Siapkan sistem modal (HTML & CSS inject)
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

    // Data Default
    const defaultData = [
        { id: 'p1', name: "Jeruk Keprok", category: "Buah", price: 20000, unit: "/kg", img: "images/jeruk1.jpg", desc: "Jeruk keprok segar langsung dari petani, rasa manis sedikit asam segar." },
        { id: 'p2', name: "Mangga Harum Manis", category: "Buah", price: 30000, unit: "/kg", img: "images/mangga.jpg", desc: "Mangga kualitas super, daging tebal dan biji tipis." },
        { id: 't1', name: "Tabulampot Jambu", category: "Tabulampot", price: 150000, unit: "/pot", img: "images/jambu.jpg", desc: "Bibit jambu kristal dalam pot, sudah siap berbuah." },
        { id: 't3', name: "Tabulampot Nanas", category: "Tabulampot", price: 175000, unit: "/pot", img: "images/menanam-nanas-di-pot.jpg", desc: "Tanaman nanas madu dalam pot, cocok untuk hiasan teras." }
    ];

    let products = [];
    const storedData = localStorage.getItem('products');

    if (storedData) {
        products = JSON.parse(storedData);
    } else {
        products = defaultData;
    }

    // Ambil 4 produk pertama & simpan ke variabel global
    currentFeaturedProducts = products.slice(0, 4);

    // Render HTML
    container.innerHTML = currentFeaturedProducts.map((item, index) => {
        const imgSource = item.img ? item.img : 'https://placehold.co/300x300/eee/333?text=No+Image';

        return `
            <div class="product-card" 
                 onclick="openProductModal(${index})" 
                 title="Klik untuk melihat detail">
                
                <div class="p-img">
                    <img src="${imgSource}" 
                         alt="${item.name}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://placehold.co/300x300/eee/333?text=Img+Error'">
                    <div class="overlay-icon"><i class="fas fa-search-plus"></i> Lihat</div>
                </div>
                
                <div class="p-info">
                    <span class="p-cat">${item.category}</span>
                    <h4 class="p-title">${item.name}</h4>
                    <div class="p-price">
                        ${formatRupiah(item.price)} 
                        <small>${item.unit || ''}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- SISTEM POPUP / MODAL ---

function openProductModal(index) {
    const product = currentFeaturedProducts[index];
    if (!product) return;

    // Isi data ke dalam elemen modal
    document.getElementById('modalImg').src = product.img || 'https://placehold.co/300x300/eee/333?text=No+Image';
    document.getElementById('modalCategory').innerText = product.category;
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + (product.unit || '');
    
    // Set tombol detail agar mengarah ke halaman detail yang benar
    const detailBtn = document.getElementById('modalDetailBtn');
    detailBtn.onclick = function() {
        window.location.href = `detailproduk.html?id=${product.id}`;
    };

    // Tampilkan Modal
    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Matikan scroll background
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Hidupkan scroll background
}

// Fungsi untuk menyuntikkan HTML Modal dan CSS secara otomatis
function initModalSystem() {
    // 1. Inject CSS Styles untuk Modal
    const style = document.createElement('style');
    style.innerHTML = `
        /* Modal Overlay */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* Modal Box */
        .modal-box {
            background: #fff;
            width: 90%;
            max-width: 800px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            display: flex;
            flex-direction: column;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-overlay.active .modal-box {
            transform: scale(1);
        }

        @media(min-width: 768px) {
            .modal-box {
                flex-direction: row;
                height: 450px;
            }
        }

        /* Modal Image Area */
        .modal-img-area {
            flex: 1;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-img-area img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        /* Modal Content Area */
        .modal-content-area {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 28px;
            color: #aaa;
            cursor: pointer;
            transition: color 0.2s;
            background: none;
            border: none;
        }
        .modal-close:hover { color: #333; }
        
        .modal-cat { color: #27ae60; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .modal-title { font-size: 2rem; margin: 0 0 15px 0; color: #333; line-height: 1.2; }
        .modal-price { font-size: 1.8rem; color: #e74c3c; font-weight: 700; margin-bottom: 25px; }
        
        .modal-actions { margin-top: auto; display: flex; gap: 10px; }
        .btn-detail {
            flex: 1;
            padding: 12px;
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            transition: background 0.2s;
        }
        .btn-detail:hover { background: #219150; }
        
        /* Tambahan Hover Effect di Card Utama */
        .product-card { transition: transform 0.2s, box-shadow 0.2s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .p-img { position: relative; overflow: hidden; }
        .overlay-icon {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.3);
            display: flex; justify-content: center; align-items: center;
            color: #fff; opacity: 0; transition: opacity 0.3s;
            font-weight: bold;
        }
        .product-card:hover .overlay-icon { opacity: 1; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Modal ke Body
    const modalHTML = `
        <div id="productModal" class="modal-overlay" onclick="if(event.target === this) closeProductModal()">
            <div class="modal-box">
                <button class="modal-close" onclick="closeProductModal()">&times;</button>
                
                <div class="modal-img-area">
                    <img id="modalImg" src="" alt="Product Image">
                </div>
                
                <div class="modal-content-area">
                    <span id="modalCategory" class="modal-cat">Kategori</span>
                    <h2 id="modalTitle" class="modal-title">Nama Produk</h2>
                    <div id="modalPrice" class="modal-price">Rp 0</div>
                    

                    <div class="modal-actions">
                        <button id="modalDetailBtn" 
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 3. Listener Keyboard (Tutup dengan ESC)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProductModal();
    });

}
