// confetti.js (menggunakan canvas-confetti CDN)
function startConfetti(duration = 4000) {
  const end = Date.now() + duration;

  (function frame() {
    // 5-10 kecil per frame
    confetti({
      particleCount: 7,
      spread: 60,
      origin: { y: 0.6 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
