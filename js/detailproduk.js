/* ============================================================
   Toggle menu mobile
   ============================================================ */
function toggleMenu() {
    const nav = document.getElementById("navMenu");
    nav.classList.toggle("active");
}

/* ============================================================
   Konfigurasi global
   ============================================================ */
const CONFIG = {
    USE_API: false,
    API_ENDPOINT: "/api/products",
    RELATED_MAX: 4
};

/* ============================================================
   Data Produk (static dataset, tidak disimpan di localStorage)
   ============================================================ */
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

/* ============================================================
   Load detail produk berdasarkan id
   ============================================================ */
async function loadProductDetail(id) {
    if (!id) return null;

    // Jika suatu hari ingin gunakan API
    if (CONFIG.USE_API) {
        try {
            const res = await fetch(`${CONFIG.API_ENDPOINT}/${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    // LANGSUNG pakai initialDataset
    return initialDataset.find(p => p.id === id) || null;
}

/* ============================================================
   Escape HTML
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
   Format Rupiah
   ============================================================ */
function fmtRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(price);
}

/* ============================================================
   Produk terkait (tanpa localStorage)
   ============================================================ */
function renderRelated(product) {
    const grid = document.getElementById("relatedGrid");
    grid.innerHTML = "";

    let candidates = initialDataset.filter(
        p => p.category === product.category && p.id !== product.id
    );

    const shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    if (candidates.length < CONFIG.RELATED_MAX) {
        const other = initialDataset.filter(p => p.id !== product.id && !candidates.includes(p));
        candidates = candidates.concat(shuffle(other)).slice(0, CONFIG.RELATED_MAX);
    } else {
        candidates = shuffle(candidates).slice(0, CONFIG.RELATED_MAX);
    }

    candidates.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="p-img"><img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}"></div>
            <div class="p-details">
                <div class="p-title">${escapeHtml(p.name)}</div>
                <div class="p-price">${fmtRupiah(p.price)} ${p.unit || ""}</div>
                <div class="p-stock">${p.stock > 0 ? p.stock + " Tersedia" : "Habis"}</div>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `detailproduk.html?id=${p.id}`;
        });

        grid.appendChild(card);
    });
}

/* ============================================================
   Update tombol beli
   ============================================================ */
function updateBuyLink(product) {
    const btn = document.getElementById("btnBuyNow");
    btn.href = product ? `form 2.html?id=${product.id}&qty=1` : "#";
}

/* ============================================================
   Render detail produk
   ============================================================ */
function renderProductDetail(product) {
    if (!product) {
        document.querySelector(".product-wrapper").innerHTML =
            `<div style="text-align:center;">Produk Tidak Ditemukan</div>`;
        return;
    }

    document.title = `${product.name} - Detail Produk`;

    document.getElementById("d-img").src = escapeHtml(product.img);
    document.getElementById("d-cat").textContent = product.category;
    document.getElementById("d-bread").textContent = product.name;
    document.getElementById("d-name").textContent = product.name;
    document.getElementById("d-price").textContent =
        fmtRupiah(product.price) + (product.unit ? ` ${product.unit}` : "");
    document.getElementById("d-desc").innerText = product.desc;

    const stockEl = document.getElementById("d-stock-status");
    const available = Number(product.stock) > 0;

    stockEl.textContent = available ? `Stok: ${product.stock} Tersedia` : "Stok Habis";
    stockEl.classList.toggle("stock-habis", !available);

    updateBuyLink(product);
    renderRelated(product);
}

/* ============================================================
   Inisialisasi halaman
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const product = await loadProductDetail(id);
    renderProductDetail(product);
});
