const box = document.querySelector('[data-format]');
const $ = s => document.querySelector(s);
const src = $('#src'), out = $('#out'), mic = $('#mic'), gen = $('#gen'), msg = $('#msg');
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec;
if (!SR) { mic.disabled = true; msg.textContent = 'آواز کے لیے Chrome یا Edge استعمال کریں۔ آپ متن لکھ بھی سکتے ہیں۔'; }
else {
  rec = new SR(); rec.lang = 'ur-PK'; rec.continuous = true; rec.interimResults = false;
  rec.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) src.value += e.results[i][0].transcript + ' '; };
  rec.onerror = e => { msg.textContent = e.error === 'not-allowed' ? 'مائیک کی اجازت دیں۔' : 'آواز کی خرابی: ' + e.error; mic.classList.remove('on'); };
  rec.onend = () => mic.classList.remove('on');
  mic.onclick = () => { msg.textContent = ''; mic.classList.toggle('on') ? rec.start() : rec.stop(); };
}
$('#copy').onclick = async () => {
  const t = (out && out.textContent.trim()) || src.value;
  try { await navigator.clipboard.writeText(t); msg.textContent = ''; } catch { msg.textContent = 'کاپی نہیں ہو سکا۔'; }
};
if (gen) gen.onclick = async () => {
  if (!src.value.trim()) { msg.textContent = 'پہلے کچھ بولیں یا لکھیں۔'; return; }
  gen.disabled = true; msg.textContent = ''; out.textContent = 'تحریر بن رہی ہے...';
  try {
    const r = await fetch('/api/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: src.value, format: box.dataset.format }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'خرابی');
    out.textContent = d.text;
  } catch (e) { out.textContent = ''; msg.textContent = 'تحریر نہیں بن سکی: ' + e.message; }
  gen.disabled = false;
};
