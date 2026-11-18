// Serves the built site from /dist and handles /api/generate (keeps the Gemini key on the server).
const P = {
  youtube: 'Write in Urdu (natural Pakistani Urdu). From the notes below create: 5 YouTube title ideas, a 15-second opening hook, a scene-by-scene script, a description, chapter timestamps, and 10 tags.',
  article: 'Write in Urdu. From the notes below create a blog article with a title, a meta description under 160 characters, H2/H3 headings, and an FAQ. Do not invent statistics or facts.',
  social: 'Write in Urdu. From the notes below create three posts: Facebook, Instagram caption, and LinkedIn. Keep each suited to its platform.'
};
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } });
async function generate(request, env) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  if (!b.text || b.text.length > 8000 || !P[b.format]) return json({ error: 'Invalid input' }, 400);
  if (!env.GEMINI_API_KEY) return json({ error: 'Server not configured' }, 500);
  const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: P[b.format] + '\n\nNotes:\n' + b.text }] }] })
  });
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.map(x => x.text).join('') || '';
  return text ? json({ text }) : json({ error: d.error?.message || 'No result' }, 502);
}
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/generate') return request.method === 'POST' ? generate(request, env) : json({ error: 'Use POST' }, 405);
    return env.ASSETS.fetch(request);
  }
};
