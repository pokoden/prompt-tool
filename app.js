/* プロンプト作成 */
(() => {
const API = 'https://api.github.com/repos/pokoden/prompt-data/contents/';
const PARTS_PATH = 'prompt/parts.json';
const USER_PATH = 'prompt/user.json';
const DEFAULT_FIXED = '肌はなめらかなマット、テカリは無い。、目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気。滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、';
const FIXED_PRESETS = [
  { label: '固定', text: DEFAULT_FIXED },
  { label: '普通', text: '平面な2Dアニメイラスト、肌はなめらかなマット、テカリは無い。、目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気。滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、' },
  { label: '大人顔', text: '平面な2Dアニメイラスト、女性の顔は切れ長の目、通った鼻筋、シャープな顎のライン、頬はふっくらしすぎない。目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気、滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、' },
  { label: '大人顔のみ', text: '女性の顔は切れ長の目、通った鼻筋、シャープな顎のライン、頬はふっくらしすぎない。目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気、滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、' }
];
const SLOTS = [
  { key: 'pose', title: 'ポーズ、カメラ', kind: 'pose' },
  { key: 'hair', title: '髪型', kind: 'part', groups: [['髪型']] },
  { key: 'expr', title: '表情', kind: 'part', groups: [['表情']] },
  { key: 'cl0', title: '服装', kind: 'clothes', slot: 0 },
  { key: 'cl1', title: '服装', kind: 'clothes', slot: 1 },
  { key: 'cl2', title: '服装', kind: 'clothes', slot: 2 },
  { key: 'acc0', title: 'アクセサリー', kind: 'acc' },
  { key: 'acc1', title: 'アクセサリー', kind: 'acc' },
  { key: 'bg', title: '背景セット', kind: 'part', groups: [['背景セット']] },
  { key: 'wall', title: '壁', kind: 'part', groups: [['壁'], ['カーテン'], ['掲示板']] },
  { key: 'floor', title: '床', kind: 'part', groups: [['床']] },
  { key: 'prop0', title: '道具', kind: 'part', groups: [['家具'], ['小道具'], ['水回り設備'], ['拘束器具'], ['乗り物'], ['建物の一部']] },
  { key: 'prop1', title: '道具', kind: 'part', groups: [['家具'], ['小道具'], ['水回り設備'], ['拘束器具'], ['乗り物'], ['建物の一部']] },
  { key: 'light', title: '光と影', kind: 'part', groups: [['照明']] },
  { key: 'size', title: '画像サイズ', kind: 'part', groups: [['画像サイズ']] },
  { key: 'lock', title: '固定', kind: 'lock' }
];
const TABS = [['make', '作成'], ['look', '確認'], ['fav', 'お気に入り'], ['hist', '履歴'], ['parts', '部品'], ['io', '取込']];

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tok = () => LS.get('v2_token', '') || '';
const uid = () => 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
const now = () => new Date().toISOString();
const textClose = (a, b) => {
  const n = s => String(s || '').replace(/。+$/, '').trim();
  return n(a) && n(a) === n(b);
};

let tab = LS.get('pr_tab', 'make');
let D = null, U = emptyUser(), sha = { parts: null, user: null };
let dirty = false, saveT = 0;
let lookQ = '';
let st = { sel: {}, open: '', list: '', listQ: '', showFull: false, outputEdit: null };
let skipFocus = false;

function emptyUser() {
  return { v: 1, updatedAt: '', fav: [], hist: [], order: [], partOrder: {}, partsExtra: [], partsEdit: {}, partsDelete: [], fixedText: DEFAULT_FIXED };
}
function status(msg, ok) {
  const el = $('st');
  if (!el) return;
  el.textContent = msg || '';
  el.className = ok === false ? 'ng' : ok ? 'ok' : '';
  el.style.padding = msg ? '6px 4px' : '0';
}

async function gh(path, opt = {}) {
  return fetch(API + path, Object.assign({ cache: 'no-store' }, opt, {
    headers: Object.assign({ Authorization: 'Bearer ' + tok(), Accept: 'application/vnd.github+json' }, opt.headers || {})
  }));
}
function b64dec(b) {
  const bin = atob(b.replace(/\s/g, ''));
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(u);
}
function b64enc(s) {
  const u = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(bin);
}
function mergeUser(a, b) {
  const out = emptyUser();
  const later = (!a ? b : !b ? a : ((a.updatedAt || '') >= (b.updatedAt || '') ? a : b)) || emptyUser();
  Object.assign(out, later);
  const hist = [...(a && a.hist || []), ...(b && b.hist || [])];
  const hs = new Map();
  for (const h of hist) if (h && h.id && !hs.has(h.id)) hs.set(h.id, h);
  out.hist = [...hs.values()].sort((x, y) => (x.at || '') < (y.at || '') ? 1 : -1);
  const fav = [...(a && a.fav || []), ...(b && b.fav || [])];
  const fs = new Map();
  for (const f of fav) if (f && f.id && !fs.has(f.id)) fs.set(f.id, f);
  out.fav = [...fs.values()].sort((x, y) => (x.at || '') < (y.at || '') ? 1 : -1);
  out.partsEdit = Object.assign({}, a && a.partsEdit, b && b.partsEdit);
  out.partsDelete = [...new Set([...(a && a.partsDelete || []), ...(b && b.partsDelete || [])])];
  const ex = [...(a && a.partsExtra || []), ...(b && b.partsExtra || [])];
  const em = new Map();
  for (const p of ex) if (p && p.id) em.set(p.id, p);
  out.partsExtra = [...em.values()];
  if (!out.fixedText) out.fixedText = DEFAULT_FIXED;
  return out;
}

async function loadRemote() {
  if (!tok()) throw new Error('トークン未設定');
  const [pr, ur] = await Promise.all([gh(PARTS_PATH + '?t=' + Date.now()), gh(USER_PATH + '?t=' + Date.now())]);
  if (pr.status === 401 || pr.status === 403) throw new Error(pr.status === 401 ? 'トークンが違うか期限切れ' : '権限がないか回数制限');
  if (!pr.ok) throw new Error('部品の読み込みに失敗（' + pr.status + '）');
  const pj = await pr.json();
  sha.parts = pj.sha;
  D = JSON.parse(b64dec(pj.content));
  LS.set('pr_parts', D);
  if (ur.ok) {
    const uj = await ur.json();
    sha.user = uj.sha;
    const remote = JSON.parse(b64dec(uj.content));
    const local = LS.get('pr_user', null);
    U = local && local.updatedAt ? mergeUser(local, remote) : mergeUser(remote, emptyUser());
    LS.set('pr_user', U);
  } else if (ur.status === 404) {
    sha.user = null;
    U = LS.get('pr_user', null) || emptyUser();
  } else throw new Error('履歴の読み込みに失敗（' + ur.status + '）');
}
async function saveUser(manual) {
  U.updatedAt = now();
  LS.set('pr_user', U);
  if (!tok()) { if (manual) status('この端末だけに保存したよ', true); return; }
  const payload = { message: 'prompt user sync', content: b64enc(JSON.stringify(U)), sha: sha.user || undefined };
  const r = await gh(USER_PATH, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (r.ok) {
    const j = await r.json();
    sha.user = (j.content && j.content.sha) || j.sha || sha.user;
    dirty = false;
    if (manual) status('保存したよ', true);
  } else if (manual) status('保存できなかった（' + r.status + '）', false);
}
function scheduleSave() {
  dirty = true;
  LS.set('pr_user', U);
  clearTimeout(saveT);
  saveT = setTimeout(() => saveUser(false), 800);
}

function catalog() { return D || { poses: [], parts: {}, sets: {}, rules: [], order: [] }; }
function allParts() {
  const C = catalog();
  const list = [];
  const del = new Set(U.partsDelete || []);
  const order = (U.order && U.order.length) ? U.order : (C.order || []);
  const cats = [...order, ...Object.keys(C.parts || {})];
  const seen = new Set();
  for (const cat of cats) {
    if (seen.has(cat) || !C.parts[cat]) continue;
    seen.add(cat);
    for (const sub of Object.keys(C.parts[cat])) {
      for (const it of C.parts[cat][sub] || []) {
        if (del.has(it.id)) continue;
        const ed = U.partsEdit && U.partsEdit[it.id];
        list.push(Object.assign({ cat, sub }, it, ed || {}));
      }
    }
  }
  for (const it of (U.partsExtra || [])) if (!del.has(it.id)) list.push(it);
  if (U.partOrder) {
    const ixOf = (cat, sub) => {
      const ids = U.partOrder[cat + '\t' + sub];
      return ids ? new Map(ids.map((id, i) => [id, i])) : null;
    };
    list.sort((a, b) => {
      if (a.cat !== b.cat || a.sub !== b.sub) return 0;
      const ix = ixOf(a.cat, a.sub);
      if (!ix) return 0;
      return (ix.has(a.id) ? ix.get(a.id) : 9999) - (ix.has(b.id) ? ix.get(b.id) : 9999);
    });
  }
  return list;
}
function partById(id) { return allParts().find(p => p.id === id) || null; }
function poseById(id) { return (catalog().poses || []).find(p => p.id === id) || null; }

function usedClothTyp(exceptKey) {
  const used = new Set();
  for (const k of ['cl0', 'cl1', 'cl2']) {
    if (k === exceptKey) continue;
    const v = st.sel[k];
    if (v && v.typ && v.typ !== '後付け' && v.typ !== '隠し') used.add(v.typ);
  }
  return used;
}
function optionsFor(slot) {
  if (slot.kind === 'pose') {
    return [{ group: 'ポーズ', items: (catalog().poses || []).map(p => ({ id: p.id, label: p.title, text: p.body, zoom: p.zoom, people: p.people, line: p.line, orient: p.orient })) }];
  }
  if (slot.kind === 'lock') {
    const cur = U.fixedText || DEFAULT_FIXED;
    const list = FIXED_PRESETS.map(p => ({ id: 'preset:' + p.label, label: p.label, text: p.text, group: '固定文' }));
    if (!list.some(p => p.text === cur)) list.unshift({ id: 'preset:設定', label: '設定', text: cur, group: '固定文' });
    return [{ group: '固定文', items: list }];
  }
  if (slot.kind === 'clothes') {
    const used = usedClothTyp(slot.key);
    const groups = [];
    for (const sub of ['下着', '上', '下', 'ワンピ', '水着', '後付け', '隠し', '特殊']) {
      const items = allParts().filter(p => p.cat === '服装' && p.sub === sub && (p.text || p.label) && p.label !== '✖️');
      const vis = items.filter(p => !p.typ || p.typ === '後付け' || p.typ === '隠し' || !used.has(p.typ));
      if (vis.length) groups.push({ group: sub, items: vis });
    }
    return groups;
  }
  if (slot.kind === 'acc') return groupedOptions([['アクセサリー']]);
  return groupedOptions(slot.groups || []);
}
function groupedOptions(groups) {
  const out = [];
  for (const g of groups) {
    const cat = g[0], sub = g[1];
    const items = allParts().filter(p => p.cat === cat && (!sub || p.sub === sub) && (p.text || p.label) && p.label !== '✖️');
    const buckets = new Map();
    for (const p of items) {
      const gn = p.sub || cat;
      if (!buckets.has(gn)) buckets.set(gn, []);
      buckets.get(gn).push(p);
    }
    for (const [name, arr] of buckets) out.push({ group: name, items: arr });
  }
  return out;
}
function flatOptions(slot) {
  const out = [];
  for (const g of optionsFor(slot)) for (const it of g.items) out.push(Object.assign({ group: g.group }, it));
  return out;
}
function findMatch(slot, raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const all = flatOptions(slot);
  let hit = all.find(it => it.label === s);
  if (hit) return recOf(hit);
  hit = all.find(it => it.id === s);
  if (hit) return recOf(hit);
  hit = all.find(it => textClose(it.label, s) || textClose(it.text, s));
  if (hit) return recOf(hit);
  return { id: 'custom:' + s, label: s, text: s, custom: true };
}
function recOf(it) {
  return { id: it.id, label: it.label, text: it.text, typ: it.typ, ud: it.ud, cat: it.cat, sub: it.sub, zoom: it.zoom, people: it.people, line: it.line, orient: it.orient };
}

function ensureLock() {
  if (st.sel.lock === undefined) {
    const fx = U.fixedText || DEFAULT_FIXED;
    const pr = FIXED_PRESETS.find(p => p.text === fx);
    st.sel.lock = { id: pr ? 'preset:' + pr.label : 'preset:設定', label: pr ? pr.label : '設定', text: fx };
  }
}
function inputLabel(key) {
  const v = st.sel[key];
  if (!v) return '';
  if (key === 'lock' && (v.id || '').startsWith('preset:')) return v.label === '設定' ? v.text : v.label;
  return v.custom ? v.label : (v.label || '');
}
function resolvedText(key) {
  const v = st.sel[key];
  return (v && v.text) || '';
}
function assemble() {
  if (st.outputEdit != null) return st.outputEdit;
  const chunks = [];
  for (const s of SLOTS) {
    const t = resolvedText(s.key);
    if (t) chunks.push(t);
  }
  return chunks.join('\n');
}
function zoomText() {
  const v = st.sel.pose;
  if (!v || !v.id) return '';
  const p = poseById(v.id);
  return (p && p.zoom) || v.zoom || '';
}
function snapshot() { return { sel: JSON.parse(JSON.stringify(st.sel)) }; }
function restoreSnap(s) {
  if (!s || !s.sel) return;
  st.sel = JSON.parse(JSON.stringify(s.sel));
  st.outputEdit = null;
  st.open = '';
}

function applyInput(key, raw, openBody) {
  const slot = SLOTS.find(s => s.key === key);
  const s = String(raw || '').trim();
  st.outputEdit = null;
  if (!s) {
    st.sel[key] = (key === 'lock') ? null : null;
    if (openBody) st.open = '';
    return;
  }
  const rec = findMatch(slot, s);
  st.sel[key] = rec;
  if (key === 'lock' && rec && !rec.custom && rec.text) {
    U.fixedText = rec.text;
    scheduleSave();
  }
  if (openBody && rec && rec.text) st.open = key;
}

async function copyText(text, title) {
  try { await navigator.clipboard.writeText(text); status('コピーしたよ', true); }
  catch (e) { prompt('長押しでコピーしてね', text); }
  if (title !== false) {
    U.hist.unshift({ id: uid(), at: now(), title: title || (st.sel.pose && st.sel.pose.label) || '（ポーズなし）', text, snap: snapshot() });
    scheduleSave();
  }
}

/* ---------- render ---------- */
window.go = k => { tab = k; LS.set('pr_tab', k); st.list = ''; hideSug(); render(); };
window.saveTok = () => {
  const v = ($('tk') && $('tk').value.trim()) || '';
  if (!v) { alert('トークンを入れてね'); return; }
  LS.set('v2_token', v);
  boot();
};

function renderNav() {
  $('nav').innerHTML = TABS.map(([k, n]) => `<button class="${tab === k ? 'on' : ''}" onclick="go('${k}')">${n}</button>`).join('');
}

function tokenCard() {
  return `<div class="card"><input id="tk" type="password" placeholder="github_pat_..."><div class="row"><button class="b" onclick="saveTok()">保存して読み込む</button></div></div>`;
}

function renderMake() {
  if (!D) return tokenCard();
  ensureLock();
  return `<div id="form">${SLOTS.map(slot => {
    const v = st.sel[slot.key];
    const val = inputLabel(slot.key);
    const hit = v && !v.custom && v.text;
    const open = st.open === slot.key && resolvedText(slot.key);
    return `<div class="slot${open ? ' on' : ''}" data-key="${slot.key}">
      <div class="slot-r">
        <button class="lab" onclick="tapLab('${slot.key}')">${esc(slot.title)}</button>
        <div class="inp">
          <input id="in_${slot.key}" value="${esc(val)}" autocomplete="off" spellcheck="false" class="${hit ? 'hit' : ''}"
            onfocus="onFocus('${slot.key}')" oninput="onType('${slot.key}',this.value)" onchange="onCommit('${slot.key}',this.value)">
          <button class="chev${st.list === slot.key ? ' on' : ''}" onclick="togList('${slot.key}')">▼</button>
        </div>
      </div>
      ${open ? `<div class="body">${esc(resolvedText(slot.key))}</div>` : ''}
    </div>`;
  }).join('')}</div>`;
}

window.tapLab = key => {
  hideSug();
  st.list = '';
  st.open = st.open === key ? '' : key;
  const keep = 'in_' + key;
  render({ keepFocus: keep });
};
window.onFocus = key => {
  if (skipFocus) return;
  if (resolvedText(key)) st.open = key;
};
window.onType = (key, raw) => {
  const el = $('in_' + key);
  const caret = el ? el.selectionStart : raw.length;
  applyInput(key, raw, false);
  const exact = String(raw || '').trim() && st.sel[key] && !st.sel[key].custom && st.sel[key].label === String(raw || '').trim();
  if (exact) {
    st.open = key;
    st.list = '';
    hideSug();
    render({ keepFocus: 'in_' + key, caret });
    renderDock();
    return;
  }
  st.list = key;
  st.listQ = raw;
  renderDock();
  const hit = $('in_' + key);
  if (hit) hit.classList.toggle('hit', !!(st.sel[key] && !st.sel[key].custom && st.sel[key].text));
  showSug(key, raw);
};
window.onCommit = (key, raw) => {
  applyInput(key, raw, true);
  st.list = '';
  hideSug();
  render({ keepFocus: 'in_' + key });
};
window.togList = key => {
  if (st.list === key) { st.list = ''; hideSug(); document.querySelector('.chev.on') && document.querySelector('.chev.on').classList.remove('on'); return; }
  st.list = key;
  st.listQ = ($('in_' + key) && $('in_' + key).value) || '';
  document.querySelectorAll('.chev.on').forEach(b => b.classList.remove('on'));
  const btn = document.querySelector(`#in_${key}`) && document.querySelector(`#in_${key}`).nextElementSibling;
  if (btn) btn.classList.add('on');
  showSug(key, st.listQ, true);
  const inp = $('in_' + key);
  if (inp) inp.focus();
};
window.pickItem = (key, id) => {
  const slot = SLOTS.find(s => s.key === key);
  const it = flatOptions(slot).find(x => x.id === id);
  if (!it) return;
  st.sel[key] = recOf(it);
  st.outputEdit = null;
  st.open = key;
  st.list = '';
  if (key === 'lock') { U.fixedText = it.text; scheduleSave(); }
  hideSug();
  render({ keepFocus: 'in_' + key });
};

function hideSug() {
  const box = $('sug');
  if (box) { box.hidden = true; box.innerHTML = ''; }
  st.list = st.list;
}
function showSug(key, q, forceAll) {
  const slot = SLOTS.find(s => s.key === key);
  const box = $('sug');
  const inp = $('in_' + key);
  if (!box || !inp) return;
  const s = String(q || '').trim();
  const groups = optionsFor(slot);
  const filtered = [];
  for (const g of groups) {
    const items = s && !forceAll ? g.items.filter(it => (it.label || '').includes(s) || (it.text || '').includes(s)) : g.items;
    if (items.length) filtered.push({ group: g.group, items: items.slice(0, s && !forceAll ? 40 : 80) });
  }
  if (!filtered.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.innerHTML = filtered.map(g => `<div class="g">${esc(g.group)}</div>` + g.items.map(it =>
    `<button onclick="pickItem('${key}','${esc(it.id)}')">${esc(it.label)}</button>`
  ).join('')).join('');
  const r = inp.getBoundingClientRect();
  const width = Math.min(Math.max(r.width + 48, 240), window.innerWidth - 16);
  let top = r.bottom + 4;
  box.style.left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) + 'px';
  box.style.width = width + 'px';
  box.hidden = false;
  box.style.top = '0px';
  const h = Math.min(box.scrollHeight, window.innerHeight * 0.42);
  if (top + h > window.innerHeight - 8) {
    const above = r.top - 4 - h;
    top = above > 8 ? above : Math.max(8, window.innerHeight - h - 8);
  }
  box.style.top = top + 'px';
  box.style.maxHeight = '42dvh';
}

function renderLook() {
  if (!D) return tokenCard();
  const q = lookQ.trim();
  const hits = [];
  if (q) {
    for (const p of (catalog().poses || [])) {
      if ((p.title || '').includes(q) || p.title === q) hits.push({ kind: 'pose', p, label: p.title, exact: p.title === q });
    }
    for (const it of allParts()) {
      if ((it.label || '').includes(q) || it.label === q) hits.push({ kind: 'part', p: it, label: it.label, exact: it.label === q });
    }
    hits.sort((a, b) => (b.exact - a.exact) || a.label.length - b.label.length);
  }
  const rest = hits.slice(0, 12);
  return `<div class="card">
    <input type="search" id="lookq" value="${esc(lookQ)}" placeholder="タイトル" autocomplete="off" oninput="onLook(this.value)">
  </div>
  <div id="look">${rest.map(h => lookHit(h)).join('') || (q ? '<div class="card">（ない）</div>' : '')}</div>`;
}
function lookHit(h) {
  if (h.kind === 'pose') {
    const p = h.p;
    return `<div class="card hit">
      <b>${esc(p.title)}</b>
      <div>${esc(p.people || '')}　${esc(p.orient || '')}　${esc(p.cat || '')}</div>
      ${p.line ? `<div class="prev">${esc(p.line)}</div>` : ''}
      <div class="prev">${esc(p.body || '')}</div>
      <div class="row">
        <button class="b" onclick="copyLook('pose','${esc(p.id)}')">本文をコピー</button>
        ${p.zoom ? `<button class="sub" onclick="copyLook('zoom','${esc(p.id)}')">ズーム</button>` : ''}
      </div>
    </div>`;
  }
  const p = h.p;
  return `<div class="card hit">
    <b>${esc(p.label)}</b>
    <div>${esc(p.cat)}${p.sub && p.sub !== p.cat ? ' / ' + esc(p.sub) : ''}</div>
    <div class="prev">${esc(p.text || '')}</div>
    <div class="row"><button class="b" onclick="copyLook('part','${esc(p.id)}')">コピー</button></div>
  </div>`;
}
window.onLook = v => { lookQ = v; render(); const el = $('lookq'); if (el) { el.focus(); const n = el.value.length; el.setSelectionRange(n, n); } };
window.copyLook = async (kind, id) => {
  if (kind === 'pose') { const p = poseById(id); if (p) await copyText(p.body || '', false); }
  else if (kind === 'zoom') { const p = poseById(id); if (p) await copyText(p.zoom || '', false); }
  else { const p = partById(id); if (p) await copyText(p.text || '', false); }
};

function renderList(kind) {
  const arr = kind === 'fav' ? (U.fav || []) : (U.hist || []);
  if (!arr.length) return `<div class="card">（まだない）</div>`;
  return `<div class="card">${arr.map(x => `
    <div class="item">
      <div><b>${esc(x.title || '')}</b><div>${esc((x.at || '').replace('T', ' ').slice(0, 19))}</div></div>
      <div>
        <button class="sub" onclick="loadSnap('${kind}','${esc(x.id)}')">呼び出す</button>
        ${kind === 'fav' ? `<button class="sub" onclick="delFav('${esc(x.id)}')">外す</button>` : ''}
      </div>
    </div>`).join('')}</div>`;
}
window.loadSnap = (kind, id) => {
  const arr = kind === 'fav' ? U.fav : U.hist;
  const x = (arr || []).find(e => e.id === id);
  if (!x) return;
  restoreSnap(x.snap);
  tab = 'make'; LS.set('pr_tab', tab); render();
};
window.delFav = id => { U.fav = (U.fav || []).filter(x => x.id !== id); scheduleSave(); render(); };
window.doFav = () => {
  U.fav.unshift({ id: uid(), at: now(), title: (st.sel.pose && st.sel.pose.label) || '（ポーズなし）', text: assemble(), snap: snapshot() });
  scheduleSave(); status('お気に入りに入れたよ', true); render();
};

function renderParts() {
  if (!D) return tokenCard();
  const by = new Map();
  for (const p of allParts()) {
    if (!by.has(p.cat)) by.set(p.cat, new Map());
    const sm = by.get(p.cat);
    if (!sm.has(p.sub)) sm.set(p.sub, []);
    sm.get(p.sub).push(p);
  }
  const cats = [...by.keys()];
  let html = `<div class="card">
    <select id="na_cat">${cats.map(c => `<option>${esc(c)}</option>`).join('')}</select>
    <div class="row" style="margin-top:8px"><input id="na_sub" placeholder="小分類"></div>
    <div class="row"><input id="na_lab" placeholder="名前"></div>
    <div class="row"><textarea id="na_tx" placeholder="本文"></textarea></div>
    <div class="row"><button class="b" onclick="addPart()">追加</button></div>
  </div>`;
  for (const cat of cats) {
    const sm = by.get(cat);
    for (const [sub, list] of sm) {
      html += `<div class="card"><b>${esc(cat)} / ${esc(sub)}</b>${list.map((p, i) => `
        <div class="item" style="align-items:flex-start">
          <div style="flex:1"><input value="${esc(p.label)}" onchange="edPart('${esc(p.id)}','label',this.value)"><textarea onchange="edPart('${esc(p.id)}','text',this.value)">${esc(p.text)}</textarea></div>
          <div>
            <button class="sub" ${i === 0 ? 'disabled' : ''} onclick="movePart('${esc(cat)}','${esc(sub)}',${i},-1)">上へ</button>
            <button class="sub" ${i === list.length - 1 ? 'disabled' : ''} onclick="movePart('${esc(cat)}','${esc(sub)}',${i},1)">下へ</button>
            <button class="sub" onclick="delPart('${esc(p.id)}')">削除</button>
          </div>
        </div>`).join('')}</div>`;
    }
  }
  return html;
}
window.addPart = () => {
  const cat = $('na_cat').value.trim();
  const sub = $('na_sub').value.trim() || cat;
  const label = $('na_lab').value.trim();
  const text = $('na_tx').value;
  if (!cat || !label) { alert('分類と名前を入れてね'); return; }
  U.partsExtra.push({ id: uid(), cat, sub, label, text, tags: [] });
  scheduleSave(); render();
};
window.edPart = (id, field, val) => {
  if ((U.partsExtra || []).some(x => x.id === id)) {
    U.partsExtra.find(x => x.id === id)[field] = val;
  } else {
    U.partsEdit[id] = Object.assign({}, U.partsEdit[id] || {}, { [field]: val });
  }
  scheduleSave();
};
window.delPart = id => {
  if (!confirm('この部品を削除する？')) return;
  U.partsExtra = (U.partsExtra || []).filter(x => x.id !== id);
  U.partsDelete = [...new Set([...(U.partsDelete || []), id])];
  scheduleSave(); render();
};
window.movePart = (cat, sub, i, d) => {
  const list = allParts().filter(p => p.cat === cat && p.sub === sub);
  const j = i + d;
  if (j < 0 || j >= list.length) return;
  const ids = list.map(x => x.id);
  const t = ids[i]; ids[i] = ids[j]; ids[j] = t;
  U.partOrder[cat + '\t' + sub] = ids;
  scheduleSave(); render();
};

function renderIo() {
  const fx = U.fixedText || DEFAULT_FIXED;
  return `${!D ? tokenCard() : ''}
  <div class="card">
    <input id="tk" type="password" placeholder="${tok() ? '保存済み（変更時のみ入力）' : 'github_pat_...'}">
    <div class="row"><button class="b" onclick="saveTok()">保存して読み込む</button></div>
  </div>
  <div class="card">
    <b>固定文</b>
    <div class="row">
      <select onchange="setFixedPreset(this.value)">
        ${FIXED_PRESETS.map(p => `<option value="${esc(p.label)}" ${p.text === fx ? 'selected' : ''}>${esc(p.label)}</option>`).join('')}
        <option value="__custom" ${FIXED_PRESETS.every(p => p.text !== fx) ? 'selected' : ''}>直接入力</option>
      </select>
    </div>
    <div class="row"><textarea id="fixedTx" onchange="setFixed(this.value)">${esc(fx)}</textarea></div>
  </div>
  <div class="card">
    <input type="file" id="tsv" accept=".tsv,.txt,text/tab-separated-values" onchange="impTsv(this)">
  </div>
  <div class="card">
    <div class="row">
      <button class="b" onclick="dlXlsx()">エクセルに保存</button>
      <button class="sub" onclick="saveUser(true)">保存</button>
    </div>
  </div>`;
}
window.setFixedPreset = lab => {
  if (lab === '__custom') return;
  const p = FIXED_PRESETS.find(x => x.label === lab);
  if (!p) return;
  U.fixedText = p.text;
  st.sel.lock = { id: 'preset:' + p.label, label: p.label, text: p.text };
  st.outputEdit = null;
  scheduleSave(); render();
};
window.setFixed = t => {
  U.fixedText = t;
  const pr = FIXED_PRESETS.find(p => p.text === t);
  st.sel.lock = { id: pr ? 'preset:' + pr.label : 'preset:設定', label: pr ? pr.label : '設定', text: t };
  st.outputEdit = null;
  scheduleSave();
};

window.impTsv = async ev => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const text = await f.text();
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return;
  const head = lines[0].split('\t').map(s => s.trim());
  const ix = n => head.indexOf(n);
  let nOk = 0;
  const byLabel = new Map(allParts().map(p => [p.cat + '\t' + p.label, p]));
  for (const line of lines.slice(1)) {
    const c = line.split('\t');
    const get = name => { const i = ix(name); return i >= 0 ? (c[i] || '') : ''; };
    let cat = get('分類') || get('今のタブ') || '';
    let sub = get('小分類') || get('今の分類') || cat;
    let label = get('名前') || get('タイトル') || '';
    let body = get('本文') || get('新しい本文') || get('プロンプト') || '';
    if (!label) continue;
    if (!cat) cat = '服装';
    if (!sub) sub = cat;
    const exist = byLabel.get(cat + '\t' + label) || allParts().find(p => p.label === label);
    if (exist) {
      if ((U.partsExtra || []).some(x => x.id === exist.id)) {
        const e = U.partsExtra.find(x => x.id === exist.id);
        e.text = body; e.label = label;
      } else U.partsEdit[exist.id] = Object.assign({}, U.partsEdit[exist.id] || {}, { label, text: body });
    } else {
      const it = { id: uid(), cat, sub, label, text: body, tags: [] };
      U.partsExtra.push(it);
      byLabel.set(cat + '\t' + label, it);
    }
    nOk++;
  }
  scheduleSave(); status(nOk + '件取り込んだよ', true); ev.target.value = ''; render();
};

function xlsxDownload(filename, sheets) {
  function crc32(u) { let c = ~0; for (let i = 0; i < u.length; i++) { c ^= u[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; }
  function u16(n) { return new Uint8Array([n & 255, (n >>> 8) & 255]); }
  function u32(n) { return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]); }
  function enc(s) { return new TextEncoder().encode(s); }
  function catBytes(arr) { const n = arr.reduce((a, b) => a + b.length, 0); const o = new Uint8Array(n); let p = 0; for (const x of arr) { o.set(x, p); p += x.length; } return o; }
  function xmlEsc(s) { return String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[ch])); }
  const files = [];
  files.push(['[Content_Types].xml', enc(`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`)]);
  files.push(['_rels/.rels', enc(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`)]);
  files.push(['xl/_rels/workbook.xml.rels', enc(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}</Relationships>`)]);
  files.push(['xl/workbook.xml', enc(`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`)]);
  sheets.forEach((s, i) => {
    const rows = s.rows.map((row, r) => {
      const cells = row.map((val, c) => {
        const col = (c >= 26 ? String.fromCharCode(65 + Math.floor(c / 26) - 1) : '') + String.fromCharCode(65 + (c % 26));
        return `<c r="${col}${r + 1}" t="inlineStr"><is><t>${xmlEsc(val)}</t></is></c>`;
      }).join('');
      return `<row r="${r + 1}">${cells}</row>`;
    }).join('');
    files.push([`xl/worksheets/sheet${i + 1}.xml`, enc(`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows}</sheetData></worksheet>`)]);
  });
  const locals = [], centrals = []; let off = 0;
  for (const [name, data] of files) {
    const n = enc(name); const crc = crc32(data);
    const loc = catBytes([enc('PK\x03\x04'), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(n.length), u16(0), n, data]);
    locals.push(loc);
    centrals.push(catBytes([enc('PK\x01\x02'), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(n.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off), n]));
    off += loc.length;
  }
  const central = catBytes(centrals);
  const end = catBytes([enc('PK\x05\x06'), u16(0), u16(0), u16(files.length), u16(files.length), u32(central.length), u32(off), u16(0)]);
  const blob = new Blob([catBytes([...locals, central, end])], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
window.dlXlsx = () => {
  const partRows = [['分類', '小分類', '名前', '本文']];
  for (const p of allParts()) partRows.push([p.cat, p.sub, p.label, p.text]);
  const poseRows = [['タイトル', '分類', '分類グループ', '人数', '画像向き', '本文', 'ズーム', 'セリフ', '顔の向き', '視線', '表情']];
  for (const p of (catalog().poses || [])) poseRows.push([p.title, p.cat, p.catGroup, p.people, p.orient, p.body, p.zoom, p.line, (p.rec && p.rec.face) || '', (p.rec && p.rec.gaze) || '', (p.rec && p.rec.expr) || '']);
  const setRows = [['種類', '名前', '部品']];
  for (const [k, arr] of Object.entries(catalog().sets || {})) for (const s of arr || []) setRows.push([k, s.label, (s.items || []).join('、')]);
  xlsxDownload('プロンプト部品.xlsx', [{ name: '部品', rows: partRows }, { name: 'ポーズ', rows: poseRows }, { name: 'セット', rows: setRows }]);
  status('エクセルをダウンロードしたよ', true);
};

function renderDock() {
  const dock = $('dock');
  const sheet = $('sheet');
  if (tab !== 'make' || !D) { dock.hidden = true; if (sheet) { sheet.className = ''; sheet.innerHTML = ''; } return; }
  dock.hidden = false;
  const text = assemble();
  const z = zoomText();
  dock.innerHTML = `<div class="in">
    <div class="pv" id="dockpv">${esc(text)}</div>
    <div class="btns">
      <button class="b" id="btnCopy">コピー</button>
      <button class="sub" id="btnZoom" ${z ? '' : 'disabled'}>ズーム</button>
      <button class="sub" id="btnFav">お気に入り</button>
    </div>
  </div>`;
  $('dockpv').onclick = () => { st.showFull = true; render(); };
  $('btnCopy').onclick = () => copyText(assemble());
  $('btnZoom').onclick = () => { if (z) copyText(z, false); };
  $('btnFav').onclick = () => doFav();
  if (st.showFull) {
    sheet.className = 'on';
    sheet.innerHTML = `<div class="box">
      <textarea id="fullTx">${esc(text)}</textarea>
      <div class="row">
        <button class="b" id="fullCopy">コピー</button>
        <button class="sub" id="fullClose">閉じる</button>
      </div>
    </div>`;
    $('fullTx').oninput = ev => { st.outputEdit = ev.target.value; };
    $('fullCopy').onclick = () => copyText(assemble());
    $('fullClose').onclick = ev => { ev.stopPropagation(); st.showFull = false; render(); };
    sheet.onclick = ev => { if (ev.target === sheet) { st.showFull = false; render(); } };
  } else {
    sheet.className = '';
    sheet.innerHTML = '';
  }
}

function render(opt) {
  opt = opt || {};
  renderNav();
  const app = $('app');
  const keep = opt.keepFocus;
  const caret = opt.caret;
  if (tab === 'make') app.innerHTML = renderMake();
  else if (tab === 'look') app.innerHTML = renderLook();
  else if (tab === 'fav') app.innerHTML = renderList('fav');
  else if (tab === 'hist') app.innerHTML = renderList('hist');
  else if (tab === 'parts') app.innerHTML = renderParts();
  else app.innerHTML = renderIo();
  renderDock();
  if (keep && $(keep)) {
    skipFocus = true;
    $(keep).focus();
    const n = caret != null ? caret : $(keep).value.length;
    try { $(keep).setSelectionRange(n, n); } catch (e) {}
    skipFocus = false;
  }
}

document.addEventListener('click', ev => {
  const sug = $('sug');
  if (!sug || sug.hidden) return;
  if (sug.contains(ev.target)) return;
  if (ev.target.closest && ev.target.closest('.chev')) return;
  if (ev.target.closest && ev.target.closest('.inp input')) return;
  st.list = '';
  hideSug();
  document.querySelectorAll('.chev.on').forEach(b => b.classList.remove('on'));
});

async function boot() {
  status('読み込み中…');
  try {
    const cached = LS.get('pr_parts', null);
    if (cached && !D) D = cached;
    U = LS.get('pr_user', null) || U;
    if (!U.fixedText) U.fixedText = DEFAULT_FIXED;
    if (tok()) await loadRemote();
    else if (!D) tab = 'io';
    ensureLock();
    status(tok() ? '読み込んだよ' : (D ? '' : 'トークンを入れてね'), !!D);
    render();
  } catch (e) {
    const cached = LS.get('pr_parts', null);
    if (cached) D = cached;
    status(String(e.message || e), false);
    if (!D) tab = 'io';
    ensureLock();
    render();
  }
}
window.boot = boot;
window.saveUser = saveUser;
window.doFav = doFav;
addEventListener('DOMContentLoaded', () => boot());
})();
