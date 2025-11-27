(function(){

  // ================================
  // 1. FIREBASE CONFIG (PUNYAMU)
  // ================================
  const firebaseConfig = {
    apiKey: "AIzaSyCUn-ZGMZanJlHyrewiA4FzIS_vMBFOOU4",
    authDomain: "wishes-wulan-lintang.firebaseapp.com",
    databaseURL: "https://wishes-wulan-lintang-default-rtdb.firebaseio.com",
    projectId: "wishes-wulan-lintang",
    storageBucket: "wishes-wulan-lintang.firebasestorage.app",
    messagingSenderId: "170975144942",
    appId: "1:170975144942:web:41af5bab9837035078bcff",
    measurementId: "G-FRTK9G96KG"
  };

  // Firebase aktif kalau API key sudah benar
  const useFirebase = firebaseConfig.apiKey !== "PASTE_APIKEY";

  // Helpers
  function el(id){ return document.getElementById(id); }
  function timestampToString(ts){
    const d = new Date(ts);
    return d.toLocaleString();
  }

  // Render 1 ucapan
  function renderWish(wish, prepend = true){
    const list = el('wishList');
    if(!list) return;

    const wrap = document.createElement('div');
    wrap.className = 'wish-item';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${wish.name} • ${timestampToString(wish.time)}`;

    const body = document.createElement('div');
    body.className = 'body';
    body.textContent = wish.message;

    wrap.appendChild(meta);
    wrap.appendChild(body);

    if(prepend) list.insertBefore(wrap, list.firstChild);
    else list.appendChild(wrap);
  }

  // ================================
  // 2. FIREBASE MODE
  // ================================
  let dbRef = null;

  function firebaseInit(){
    firebase.initializeApp(firebaseConfig);
    dbRef = firebase.database().ref("wishes");

    // Listen realtime (child baru)
    dbRef.orderByChild("time").on("child_added", snap => {
      const v = snap.val();
      if(v) renderWish(v);
    });
  }

  function firebasePush(wish){
    return dbRef.push(wish);
  }

  // ================================
  // 3. LOCAL STORAGE BACKUP
  // ================================
  function localLoad(){
    try { return JSON.parse(localStorage.getItem("wishes_local") || "[]") }
    catch { return [] }
  }
  function localSave(arr){
    localStorage.setItem("wishes_local", JSON.stringify(arr));
  }
  function localPush(wish){
    const arr = localLoad();
    arr.push(wish);
    localSave(arr);
    renderWish(wish);
  }
  function localRenderAll(){
    const arr = localLoad().sort((a,b)=> b.time - a.time);
    arr.forEach(w => renderWish(w, false));
  }

  // ================================
  // 4. INISIALISASI
  // ================================
  if(useFirebase){
    firebaseInit();
  } else {
    localRenderAll();
  }

  // ================================
  // 5. SEND WISH BUTTON
  // ================================
  const sendBtn = el("sendWishBtn");

  if(sendBtn){
    sendBtn.addEventListener("click", () => {

      const name = (el("wishName")?.value.trim()) || "Anonim";
      const message = (el("wishMessage")?.value.trim());
      if(!message){ 
        alert("Isi ucapan dulu ya 😄"); 
        return; 
      }

      const wish = { name, message, time: Date.now() };
      sendBtn.disabled = true;

      if(useFirebase){
        firebasePush(wish)
          .then(()=>{
            sendBtn.disabled = false;
            el("wishName").value = "";
            el("wishMessage").value = "";

            // Efek setelah kirim
            launchBalloons();
            fireConfetti();
          })
          .catch(err=>{
            console.error(err);
            alert("Gagal mengirim ucapan.");
            sendBtn.disabled = false;
          });

      } else {
        localPush(wish);
        sendBtn.disabled = false;

        // Efek lokal juga jalan
        launchBalloons();
        fireConfetti();
      }
    });
  }

})();
  

/* ============================================
   BALLOON EFFECT
   ============================================ */
function launchBalloons() {
  const container = document.getElementById("balloon-container");
  if (!container) return;

  for (let i = 0; i < 6; i++) {
    const b = document.createElement("div");
    b.classList.add("balloon");

    // random posisi
    b.style.left = Math.random() * 90 + "%";

    // random warna pastel
    const colors = ["#ff8db3", "#87cefa", "#ffd18b", "#c798ff", "#8df1c1"];
    b.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(b);

    // hapus setelah selesai
    setTimeout(() => b.remove(), 6000);
  }
}


/* ============================================
   CONFETTI EFFECT
   ============================================ */
function fireConfetti() {
  if (typeof confetti !== "function") return;

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.85 }
  });
}
