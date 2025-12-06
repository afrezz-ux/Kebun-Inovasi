/* ============================================================
   Toggle menu untuk tampilan mobile
   ============================================================ */
function toggleMenu() {
    const nav = document.getElementById("navMenu");
    nav.classList.toggle("active");
}


/* ============================================================
   Konfigurasi global (buat nyimpen setting product)
   ============================================================ */
const CONFIG = {
    USE_API: false,
    API_ENDPOINT: "/api/products",
    STORAGE_KEY: "products",
    CHANNEL_NAME: "products_channel",
    RELATED_MAX: 4
};


/* ============================================================
   Data produk awal (fallback kalau localStorage kosong)
   ============================================================ */
const initialDataset = [
    { id: 'p1', name: "Jeruk Siam", category: "Buah", price: 12000, unit: "/kg", stock: 50, img: "images/jeruk1.jpg", desc: "Jeruk Siam segar dengan rasa manis asam yang pas, kaya vitamin C." },
    { id: 'p2', name: "Mangga Harum Manis", category: "Buah", price: 30000, unit: "/kg", stock: 30, img: "images/mangga.jpg", desc: "Mangga kualitas super, daging tebal, biji tipis, dan serat halus." },
    { id: 'p3', name: "Nanas Madu", category: "Buah", price: 18000, unit: "/buah", stock: 40, img: "images/nanas.jpg", desc: "Nanas madu lokal anti gatal di lidah, sangat manis." },
    { id: 'p4', name: "Jeruk Pamelo", category: "Buah", price: 15000, unit: "/kg", stock: 25, img: "images/jerukpamelo.jpg", desc: "Jeruk Pamelo lokal segar dengan kandungan air melimpah." },
    { id: 'p5', name: "Semangka", category: "Buah", price: 25000, unit: "/kg", stock: 15, img: "images/semangka.png", desc: "Semangka merah segar dengan rasa manis alami yang menyegarkan." },
    
{ 
    id: 't1', 
    name: "Tabulampot Jambu", 
    category: "Tabulampot", 
    price: 250000, 
    unit: "/pot", 
    stock: 5, 
    img: "images/tabulampotjeruk.jpg", 
    desc: "Tabulampot Jambu Air Citra unggulan, cepat berbuah, perawatan mudah, dan cocok untuk halaman rumah." 
},

{ 
    id: 't2', 
    name: "Tabulampot Jeruk", 
    category: "Tabulampot", 
    price: 275000, 
    unit: "/pot", 
    stock: 3, 
    img: "images/tabulampotmangga.jpg", 
    desc: "Tabulampot Jeruk Dekopon berkualitas, aroma segar, buah besar, dan pertumbuhan stabil dalam pot." 
},

{ 
    id: 't3', 
    name: "Tabulampot Nanas", 
    category: "Tabulampot", 
    price: 300000, 
    unit: "/pot", 
    stock: 4, 
    img: "images/tabulampotnanas.png", 
    desc: "Tabulampot Nanas Madu dengan rasa manis alami, tanaman kuat, dan siap mempercantik taman rumah." 
}



/* ============================================================
   Cek apakah data sudah ada di localStorage
   ============================================================ */
function ensureProducts() {
    const stored = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));

    // kalau belum ada → isi dengan dataset default
    if (!Array.isArray(stored) || stored.length === 0) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(initialDataset));
        return initialDataset;
    }
    return stored;
}
/* ============================================================
   Reset LocalStorage (AGAR DATA BARU TERPAKAI)
============================================================ */
localStorage.removeItem(CONFIG.STORAGE_KEY);

/* ============================================================
   Pastikan LocalStorage Terisi
============================================================ */
function ensureProducts() {
    const stored = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));

    if (!Array.isArray(stored) || stored.length === 0) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(initialDataset));
        return initialDataset;
    }
    return stored;
}


/* ============================================================
   Load detail satu produk berdasarkan id
   ============================================================ */
async function loadProductDetail(id) {
    if (!id) return null;

    // mode API kalau suatu hari mau pakai backend
    if (CONFIG.USE_API) {
        try {
            const res = await fetch(`${CONFIG.API_ENDPOINT}/${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    // fallback ke localStorage
    const products = ensureProducts();
    return products.find(p => p.id == id) || null;
}


/* ============================================================
   Helper untuk amankan HTML dari karakter aneh
   ============================================================ */
function escapeHtml(str) {
    if (typeof str !== "string") return str;

    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   Format angka ke rupiah
   ============================================================ */
function fmtRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(price);
}


/* ============================================================
   Tampilkan produk terkait
   ============================================================ */
function renderRelated(product) {
    const grid = document.getElementById("relatedGrid");
    grid.innerHTML = "";

    const all = ensureProducts();

    // cari produk yang satu kategori
    let candidates = all.filter(p => p.category === product.category && p.id !== product.id);

    // fungsi acak sederhana
    const shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // kalau kurang → tambahkan produk dari kategori lain
    if (candidates.length < CONFIG.RELATED_MAX) {
        const other = all.filter(p => p.id !== product.id && !candidates.includes(p));
        candidates = candidates.concat(shuffle(other)).slice(0, CONFIG.RELATED_MAX);
    } else {
        candidates = shuffle(candidates).slice(0, CONFIG.RELATED_MAX);
    }

    // render masing-masing card
    candidates.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.tabIndex = 0;

        card.innerHTML = `
            <div class="p-img"><img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}"></div>
            <div class="p-details">
                <div class="p-title">${escapeHtml(p.name)}</div>
                <div class="p-price">${fmtRupiah(p.price)} ${p.unit || ""}</div>
                <div class="p-stock">${p.stock > 0 ? p.stock + " Tersedia" : "Habis"}</div>
            </div>
        `;

        // klik → pindah ke detail
        card.addEventListener("click", () => {
            window.location.href = `detailproduk.html?id=${p.id}`;
        });

        grid.appendChild(card);
    });
}


/* ============================================================
   Update tombol beli → arahkan ke form pembelian
   ============================================================ */
function updateBuyLink(product) {
    const btn = document.getElementById("btnBuyNow");
    if (!product) {
        btn.href = "#";
        return;
    }

    // default qty = 1
    btn.href = `form 2.html?id=${product.id}&qty=1`;
}


/* ============================================================
   Render detail halaman produk
   ============================================================ */
function renderProductDetail(product) {
    if (!product) {
        document.querySelector(".product-wrapper").innerHTML =
            `<div style="text-align:center;">Produk Tidak Ditemukan</div>`;
        return;
    }

    document.title = `${escapeHtml(product.name)} - Detail Produk`;

    document.getElementById("d-img").src = escapeHtml(product.img);
    document.getElementById("d-cat").textContent = product.category;
    document.getElementById("d-bread").textContent = product.name;
    document.getElementById("d-name").textContent = product.name;
    document.getElementById("d-price").textContent =
        fmtRupiah(product.price) + (product.unit ? ` ${escapeHtml(product.unit)}` : "");
    document.getElementById("d-desc").innerText = product.desc;

    // status stok
    const stockEl = document.getElementById("d-stock-status");
    const available = Number(product.stock) > 0;

    stockEl.textContent = available ? `Stok: ${product.stock} Tersedia` : "Stok Habis";
    stockEl.classList.toggle("stock-habis", !available);

    updateBuyLink(product);
    renderRelated(product);
}


/* ============================================================
   Inisialisasi halaman detail
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    ensureProducts();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const product = await loadProductDetail(id);
    renderProductDetail(product);
});

