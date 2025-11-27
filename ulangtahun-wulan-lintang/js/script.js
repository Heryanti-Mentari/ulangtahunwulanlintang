(function(){
  // SLIDESHOW OTOMATIS
  const slides = [
    "images/studio1.jpg",
    "images/studio2.jpg",
    "images/studio3.jpg",
    "images/studio4.jpg"
  ];
  let slideIndex = 0;
  const slideEl = document.getElementById("slide");

  function showSlide() {
    if(!slideEl) return;
    slideEl.src = slides[slideIndex];
    slideIndex = (slideIndex + 1) % slides.length;
  }
  setInterval(showSlide, 3000);

  // ============================
  // BGM & Voice dengan fade sederhana
  // ============================
  const bgm = document.getElementById('bgm');
  const voice = document.getElementById('voice');
  const DEFAULT_VOL = 0.45;
  const LOW_VOL = 0.2; // dikit lebih kecil saat voice

  function fade(audio, toVol, duration=500, callback){
    let step = (toVol - audio.volume) / (duration / 50);
    const fadeInterval = setInterval(() => {
      if((step>0 && audio.volume < toVol) || (step<0 && audio.volume > toVol)){
        audio.volume += step;
      } else {
        audio.volume = toVol;
        clearInterval(fadeInterval);
        if(callback) callback();
      }
    }, 50);
  }

  // Autoplay BGM saat halaman load
  window.addEventListener('load', () => {
    if(bgm){
      bgm.volume = 0;
      bgm.play().catch(()=>{});
      fade(bgm, DEFAULT_VOL, 1500);
    }
  });

  // Play Voice + kecilkan BGM
  const playVoiceBtn = document.getElementById('playVoiceBtn');
  if(playVoiceBtn){
    playVoiceBtn.addEventListener('click', () => {
      if(!voice) return;

      fade(bgm, LOW_VOL, 500, () => {
        voice.currentTime = 0;
        voice.play().catch(()=>{ alert('Voice tidak bisa diputar otomatis. Silakan klik lagi.'); });
      });

      voice.onended = () => {
        fade(bgm, DEFAULT_VOL, 1000);
      };
    });
  }
})();
