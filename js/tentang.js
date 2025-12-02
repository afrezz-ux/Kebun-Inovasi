/* ============================================================
   Reveal on Scroll
   Animasi muncul ketika elemen masuk area layar
   ============================================================ */

// cek elemen ".reveal" ketika halaman discroll
function reveal() {
    const items = document.querySelectorAll(".reveal");

    items.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop   = el.getBoundingClientRect().top;
        const offset       = 100; // jarak trigger sebelum elemen benar-benar muncul

        // kalau posisi elemen sudah masuk area tampilan → aktifkan animasi
        if (elementTop < windowHeight - offset) {
            el.classList.add("active");
        }
    });
}

// jalankan saat user scroll
window.addEventListener("scroll", reveal);

// panggil sekali saat halaman pertama kali muncul
reveal();
