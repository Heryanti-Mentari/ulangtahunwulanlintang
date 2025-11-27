// popup.js — helper sederhana (kami sediakan, dipanggil bila perlu)
function openPopup(id){
  const el = document.getElementById(id);
  if(el) el.classList.remove('hidden');
}
function closePopup(id){
  const el = document.getElementById(id);
  if(el) el.classList.add('hidden');
}
