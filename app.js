/* プロンプト作成 r281 */
(() => {
const API = 'https://api.github.com/repos/pokoden/prompt-data/contents/';
const PARTS_PATH = 'prompt/parts.json';
const USER_PATH = 'prompt/user.json';
const GAL_DIR = 'prompt/gallery/';
const DEFAULT_FIXED = '肌はなめらかなマット、テカリは無い。、目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気。滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、';
const FIXED_PRESETS = [
  { label: '固定', text: DEFAULT_FIXED },
  { label: '普通', text: '平面な2Dアニメイラスト、肌はなめらかなマット、テカリは無い。、目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気。滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、' },
  { label: '大人顔', text: '平面な2Dアニメイラスト、女性の顔は切れ長の目、通った鼻筋、シャープな顎のライン、頬はふっくらしすぎない。目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気、滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、' },
  { label: '大人顔のみ', text: '女性の顔は切れ長の目、通った鼻筋、シャープな顎のライン、頬はふっくらしすぎない。目に涙は無い。女性は高身長で成熟した大人の体つき、上品で妖艶な大人の雰囲気、滑らかな肌質、綺麗な肌質、肌に凹凸や線は無し、影による肌の表現はしないでください。全身の肌の影を全部消す、全身の毛穴や影の線が一切ないツルンツルンな綺麗な肌、' }
];
const PROP_GROUPS = [['家具'], ['小道具'], ['水回り設備'], ['拘束器具'], ['乗り物'], ['建物の一部']];
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
  { key: 'prop0', title: '道具', kind: 'part', groups: PROP_GROUPS },
  { key: 'prop1', title: '道具', kind: 'part', groups: PROP_GROUPS },
  { key: 'light', title: '光と影', kind: 'part', groups: [['照明']] },
  { key: 'size', title: '画像サイズ', kind: 'part', groups: [['画像サイズ']] },
  { key: 'lock', title: '固定', kind: 'lock' }
];
const LOOK_CATS = [
  { key: 'pose', name: 'ポーズ・カメラ', pose: true },
  { key: 'hair', name: '髪型', cats: ['髪型'] },
  { key: 'expr', name: '表情', cats: ['表情'] },
  { key: 'cloth', name: '服装', cats: ['服装'] },
  { key: 'acc', name: 'アクセサリー', cats: ['アクセサリー'] },
  { key: 'bg', name: '背景セット', cats: ['背景セット'] },
  { key: 'wall', name: '壁', cats: ['壁', 'カーテン', '掲示板'] },
  { key: 'floor', name: '床', cats: ['床'] },
  { key: 'prop', name: '道具', cats: PROP_GROUPS.map(g => g[0]) },
  { key: 'light', name: '光と影', cats: ['照明'] },
  { key: 'size', name: '画像サイズ', cats: ['画像サイズ'] }
];
const SORTS = [['def', '標準'], ['add', '最近追加'], ['use', '使用回数が多い'], ['name', '名前順'], ['last', '最近使った']];
const ICON = {
  make: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>',
  look: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  gal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 4"/></svg>',
  add: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>',
  io: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/></svg>',
  copy: '<svg viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>',
  zoom: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  cam: '<svg viewBox="0 0 24 24"><path d="M4 8.5h3l1.8-2.5h6.4L17 8.5h3v10H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M5 4.5h11l3 3v12H5z"/><path d="M8 4.5v5h7v-5M8 19.5v-6h8v6"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>'
};
const TABS = [['make', '作成'], ['look', '確認'], ['gal', 'ギャラリー'], ['add', '追加'], ['io', '取込']];

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
if (!TABS.some(t => t[0] === tab)) tab = 'make';
let D = null, U = emptyUser(), sha = { parts: null, user: null };
let saveT = 0;
let look = { cat: LS.get('pr_lookcat', ''), q: '', sort: LS.get('pr_sort_look', 'def') };
let galSort = LS.get('pr_sort_gal', 'add');
let listSort = LS.get('pr_sort_list', 'def');
let st = { sel: {}, open: '', list: '', listQ: '', showFull: false, outputEdit: null };
let att = { blob: null, url: '', thumb: null, name: '' };
let skipFocus = false;
const imgCache = new Map();

function emptyUser() {
  return { v: 2, updatedAt: '', order: [], partOrder: {}, partsExtra: [], partsEdit: {}, partsDelete: [], posesExtra: [], poseEdit: {}, poseDelete: [], use: {}, gallery: [], galleryDel: [], fixedText: DEFAULT_FIXED };
}
function status(msg, ok) {
  const el = $('st');
  if (!el) return;
  el.textContent = msg || '';
  el.className = ok === false ? 'ng' : ok ? 'ok' : '';
  el.classList.toggle('show', !!msg);
  clearTimeout(status.t);
  if (msg && ok) status.t = setTimeout(() => status(''), 2200);
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
  const u = typeof s === 'string' ? new TextEncoder().encode(s) : s;
  let bin = '';
  for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(bin);
}
async function getJson(path) {
  const r = await gh(path + '?t=' + Date.now());
  if (!r.ok) return { status: r.status };
  const j = await r.json();
  let data;
  if (j.content && j.encoding === 'base64') data = JSON.parse(b64dec(j.content));
  else {
    const rr = await gh(path + '?raw=' + Date.now(), { headers: { Accept: 'application/vnd.github.raw' } });
    if (!rr.ok) return { status: rr.status };
    data = JSON.parse(await rr.text());
  }
  return { status: 200, sha: j.sha, data };
}

function byIdMerge(x, y) {
  const m = new Map();
  for (const p of (x || [])) if (p && p.id) m.set(p.id, p);
  for (const p of (y || [])) if (p && p.id) m.set(p.id, p);
  return [...m.values()];
}
function mergeUser(a, b) {
  const out = emptyUser();
  let early = a, late = b;
  if (!a) { early = null; late = b; }
  else if (!b) { early = null; late = a; }
  else if ((a.updatedAt || '') >= (b.updatedAt || '')) { early = b; late = a; }
  Object.assign(out, late || {});
  const e = early || {}, l = late || {};
  out.partsEdit = Object.assign({}, e.partsEdit, l.partsEdit);
  out.poseEdit = Object.assign({}, e.poseEdit, l.poseEdit);
  out.partsDelete = [...new Set([...(e.partsDelete || []), ...(l.partsDelete || [])])];
  out.poseDelete = [...new Set([...(e.poseDelete || []), ...(l.poseDelete || [])])];
  out.galleryDel = [...new Set([...(e.galleryDel || []), ...(l.galleryDel || [])])];
  out.partsExtra = byIdMerge(e.partsExtra, l.partsExtra);
  out.posesExtra = byIdMerge(e.posesExtra, l.posesExtra);
  const use = Object.assign({}, e.use || {});
  for (const [k, v] of Object.entries(l.use || {})) if (!use[k] || (v.at || '') >= (use[k].at || '')) use[k] = v;
  out.use = use;
  const gdel = new Set(out.galleryDel);
  const gm = new Map();
  for (const g of [...(e.gallery || []), ...(l.gallery || [])]) {
    if (!g || !g.id || gdel.has(g.id)) continue;
    const old = gm.get(g.id);
    if (!old || (g.last || g.at || '') >= (old.last || old.at || '')) gm.set(g.id, g);
  }
  out.gallery = [...gm.values()];
  delete out.hist; delete out.fav;
  out.v = 2;
  if (!out.fixedText) out.fixedText = DEFAULT_FIXED;
  return out;
}

async function loadRemote() {
  if (!tok()) throw new Error('トークン未設定');
  const [pr, ur] = await Promise.all([getJson(PARTS_PATH), getJson(USER_PATH)]);
  if (pr.status === 401 || pr.status === 403) throw new Error(pr.status === 401 ? 'トークンが違うか期限切れ' : '権限がないか回数制限');
  if (pr.status !== 200) throw new Error('部品の読み込みに失敗（' + pr.status + '）');
  sha.parts = pr.sha;
  D = pr.data;
  LS.set('pr_parts', D);
  const local = LS.get('pr_user', null);
  if (ur.status === 200) {
    sha.user = ur.sha;
    U = local && local.updatedAt ? mergeUser(local, ur.data) : mergeUser(ur.data, null);
  } else if (ur.status === 404) {
    sha.user = null;
    U = mergeUser(local || emptyUser(), null);
  } else throw new Error('データの読み込みに失敗（' + ur.status + '）');
  LS.set('pr_user', U);
}
async function saveUser(manual) {
  U.updatedAt = now();
  LS.set('pr_user', U);
  if (!tok()) { if (manual) status('この端末だけに保存したよ', true); return true; }
  for (let i = 0; i < 2; i++) {
    const payload = { message: 'prompt user sync', content: b64enc(JSON.stringify(U)), sha: sha.user || undefined };
    const r = await gh(USER_PATH, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (r.ok) {
      const j = await r.json();
      sha.user = (j.content && j.content.sha) || sha.user;
      if (manual) status('保存したよ', true);
      return true;
    }
    if ((r.status === 409 || r.status === 422) && i === 0) {
      const g = await getJson(USER_PATH);
      if (g.status === 200) { sha.user = g.sha; U = mergeUser(U, g.data); U.updatedAt = now(); LS.set('pr_user', U); continue; }
    }
    status(r.status === 403 || r.status === 404 ? '保存の権限がないよ（トークン）' : '保存できなかった（' + r.status + '）', false);
    return false;
  }
  return false;
}
function scheduleSave() {
  LS.set('pr_user', U);
  clearTimeout(saveT);
  saveT = setTimeout(() => saveUser(false), 800);
}
async function putFile(path, bytes, msg) {
  let s;
  const g = await gh(path + '?t=' + Date.now());
  if (g.ok) s = (await g.json()).sha;
  const r = await gh(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, content: b64enc(bytes), sha: s }) });
  if (!r.ok) throw new Error(r.status === 403 || r.status === 404 ? '画像を保存する権限がないよ（トークン）' : '画像を保存できなかった（' + r.status + '）');
}
async function delFile(path) {
  const g = await gh(path + '?t=' + Date.now());
  if (!g.ok) return;
  const s = (await g.json()).sha;
  await gh(path, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'gallery delete', sha: s }) });
}

/* ---------- catalog ---------- */
function catalog() { return D || { poses: [], parts: {}, sets: {}, rules: [], order: [] }; }
function allParts() {
  const C = catalog();
  const list = [];
  const del = new Set(U.partsDelete || []);
  const order = (U.order && U.order.length) ? U.order : (C.order || []);
  const cats = [...order, ...Object.keys(C.parts || {})];
  const seen = new Set();
  let ix = 0;
  for (const cat of cats) {
    if (seen.has(cat) || !C.parts[cat]) continue;
    seen.add(cat);
    for (const sub of Object.keys(C.parts[cat])) {
      for (const it of C.parts[cat][sub] || []) {
        ix++;
        if (del.has(it.id)) continue;
        const ed = U.partsEdit && U.partsEdit[it.id];
        list.push(Object.assign({ cat, sub, _ix: ix }, it, ed || {}));
      }
    }
  }
  for (const it of (U.partsExtra || [])) if (!del.has(it.id)) list.push(Object.assign({ _ix: 1e6 + ix++ }, it));
  if (U.partOrder) {
    const ixOf = (cat, sub) => {
      const ids = U.partOrder[cat + '\t' + sub];
      return ids ? new Map(ids.map((id, i) => [id, i])) : null;
    };
    list.sort((a, b) => {
      if (a.cat !== b.cat || a.sub !== b.sub) return 0;
      const ix2 = ixOf(a.cat, a.sub);
      if (!ix2) return 0;
      return (ix2.has(a.id) ? ix2.get(a.id) : 9999) - (ix2.has(b.id) ? ix2.get(b.id) : 9999);
    });
  }
  return list;
}
function allPoses() {
  const del = new Set(U.poseDelete || []);
  const out = [];
  let ix = 0;
  for (const p of (catalog().poses || [])) { ix++; if (!del.has(p.id)) out.push(Object.assign({ _ix: ix }, p, (U.poseEdit || {})[p.id] || {})); }
  for (const p of (U.posesExtra || [])) if (!del.has(p.id)) out.push(Object.assign({ _ix: 1e6 + ix++ }, p));
  return out;
}
function partById(id) { return allParts().find(p => p.id === id) || null; }
function poseById(id) { return allPoses().find(p => p.id === id) || null; }

function sortList(arr, mode, nameOf) {
  const use = U.use || {};
  const a = arr.slice();
  const nm = nameOf || (x => x.label || x.title || x.name || '');
  if (mode === 'add') a.sort((x, y) => ((y.at || '') > (x.at || '') ? 1 : (y.at || '') < (x.at || '') ? -1 : 0) || ((y._ix || 0) - (x._ix || 0)));
  else if (mode === 'use') a.sort((x, y) => ((use[y.id] && use[y.id].n) || y.n || 0) - ((use[x.id] && use[x.id].n) || x.n || 0));
  else if (mode === 'last') {
    const l = x => (use[x.id] && use[x.id].at) || x.last || '';
    a.sort((x, y) => (l(y) > l(x) ? 1 : l(y) < l(x) ? -1 : 0));
  } else if (mode === 'name') a.sort((x, y) => nm(x).localeCompare(nm(y), 'ja'));
  return a;
}
function bumpUse(id) {
  if (!id || String(id).startsWith('custom:') || String(id).startsWith('preset:')) return;
  U.use = U.use || {};
  const u = U.use[id] || { n: 0 };
  U.use[id] = { n: (u.n || 0) + 1, at: now() };
  scheduleSave();
}

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
    return [{ group: 'ポーズ', items: allPoses().map(p => ({ id: p.id, label: p.title, text: p.body, zoom: p.zoom, people: p.people, line: p.line, orient: p.orient, at: p.at, _ix: p._ix })) }];
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
  if (!v || !v.id || v.custom) return '';
  const p = poseById(v.id);
  return (p ? p.zoom : v.zoom) || '';
}
function snapshot() {
  const sel = {};
  for (const [k, v] of Object.entries(st.sel)) if (v) sel[k] = { id: v.id, label: v.label, text: v.text, typ: v.typ, custom: v.custom || undefined };
  return { sel };
}
function restoreSnap(s) {
  if (!s || !s.sel) return;
  st.sel = {};
  for (const slot of SLOTS) {
    const v = s.sel[slot.key];
    if (!v) { st.sel[slot.key] = slot.key === 'lock' ? undefined : null; continue; }
    let cur = null;
    if (!v.custom && v.id) cur = flatOptions(slot).find(x => x.id === v.id);
    st.sel[slot.key] = cur ? recOf(cur) : Object.assign({}, v);
    if (cur && v.text && cur.text !== v.text) st.sel[slot.key].text = v.text;
  }
  ensureLock();
  st.outputEdit = null;
  st.open = '';
}

function applyInput(key, raw, openBody) {
  const slot = SLOTS.find(s => s.key === key);
  const s = String(raw || '').trim();
  st.outputEdit = null;
  if (!s) {
    st.sel[key] = null;
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

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); status('コピーしたよ', true); }
  catch (e) { prompt('長押しでコピーしてね', text); }
}

/* ---------- modal / long press ---------- */
function modal(html, cls) {
  const m = $('modal');
  m.innerHTML = `<div class="mbox ${cls || ''}">${html}</div>`;
  m.className = 'on';
  m.onclick = ev => { if (ev.target === m) closeModal(); };
  return m;
}
function closeModal() { const m = $('modal'); m.className = ''; m.innerHTML = ''; }
window.closeModal = closeModal;
function ask(msg, yes, no) {
  return new Promise(res => {
    modal(`<div class="ask">${esc(msg)}</div><div class="row two"><button class="sub" id="askNo">${esc(no || 'いいえ')}</button><button class="b" id="askYes">${esc(yes || 'はい')}</button></div>`, 'small');
    $('askYes').onclick = () => { closeModal(); res(true); };
    $('askNo').onclick = () => { closeModal(); res(false); };
    $('modal').onclick = ev => { if (ev.target === $('modal')) { closeModal(); res(false); } };
  });
}
function showBody(title, body, zoom) {
  modal(`<div class="mt">${esc(title)}</div><div class="prev big">${esc(body || '')}</div>${zoom ? `<div class="mt sm">ズーム</div><div class="prev">${esc(zoom)}</div>` : ''}
    <div class="row two"><button class="sub" onclick="closeModal()">閉じる</button><button class="b" id="bodyCopy">${ICON.copy}コピー</button></div>`);
  $('bodyCopy').onclick = () => copyText(body || '');
}
function longPress(root, sel, onLong, onTap) {
  let t = 0, sx = 0, sy = 0, el = null, fired = false, touched = 0;
  const start = (target, x, y) => {
    fired = false;
    el = target.closest ? target.closest(sel) : null;
    if (!el || !root.contains(el)) { el = null; return; }
    const b = target.closest('button');
    if (b && b !== el) { el = null; return; }
    sx = x; sy = y;
    clearTimeout(t);
    el.classList.add('pressing');
    const cur = el;
    t = setTimeout(() => { fired = true; cur.classList.remove('pressing'); if (navigator.vibrate) navigator.vibrate(12); onLong(cur); }, 480);
  };
  const cancel = () => { clearTimeout(t); if (el) el.classList.remove('pressing'); };
  root.addEventListener('touchstart', e => { touched = Date.now(); const p = e.touches[0]; start(e.target, p.clientX, p.clientY); }, { passive: true });
  root.addEventListener('touchmove', e => { const p = e.touches[0]; if (Math.abs(p.clientX - sx) > 10 || Math.abs(p.clientY - sy) > 10) { cancel(); el = null; } }, { passive: true });
  root.addEventListener('touchend', e => { cancel(); if (fired) e.preventDefault(); }, { passive: false });
  root.addEventListener('touchcancel', cancel);
  root.addEventListener('mousedown', e => { if (Date.now() - touched < 800) return; start(e.target, e.clientX, e.clientY); });
  root.addEventListener('mouseup', cancel);
  root.addEventListener('mouseleave', cancel);
  root.addEventListener('click', e => {
    const c = e.target.closest ? e.target.closest(sel) : null;
    if (!c || !root.contains(c)) return;
    if (e.target.closest('button') && e.target.closest('button') !== c && c.contains(e.target.closest('button'))) return;
    if (fired) { fired = false; e.preventDefault(); e.stopPropagation(); return; }
    if (onTap) { e.stopPropagation(); onTap(c, e); }
  }, true);
  root.addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest(sel)) e.preventDefault(); });
}

/* ---------- render ---------- */
window.go = k => { tab = k; LS.set('pr_tab', k); st.list = ''; hideSug(); render(); window.scrollTo(0, 0); };
window.saveTok = () => {
  const v = ($('tk') && $('tk').value.trim()) || '';
  if (!v) { alert('トークンを入れてね'); return; }
  LS.set('v2_token', v);
  boot();
};
function renderNav() {
  $('nav').innerHTML = TABS.map(([k, n]) => `<button class="${tab === k ? 'on' : ''}" onclick="go('${k}')">${ICON[k]}<span>${n}</span></button>`).join('');
}
function tokenCard() {
  return `<div class="card"><input id="tk" type="password" placeholder="github_pat_..."><div class="row"><button class="b" onclick="saveTok()">保存して読み込む</button></div></div>`;
}

function renderMake() {
  if (!D) return tokenCard();
  ensureLock();
  const z = zoomText();
  const any = SLOTS.some(s => s.key !== 'lock' && st.sel[s.key]);
  return `<div class="bar"><div class="bt">${ICON.make}<span>組合</span></div><button class="mini" id="clrAll" ${any ? '' : 'disabled'} onclick="clearAll()">全部解除</button></div>
  <div id="form">${SLOTS.map(slot => {
    const v = st.sel[slot.key];
    const val = inputLabel(slot.key);
    const hit = v && !v.custom && v.text;
    const open = st.open === slot.key && resolvedText(slot.key);
    return `<div class="slot${open ? ' on' : ''}" data-key="${slot.key}">
      <div class="slot-r">
        <button class="lab" onclick="tapLab('${slot.key}')">${esc(slot.title)}</button>
        <div class="inp">
          <div class="fld">
            <input id="in_${slot.key}" value="${esc(val)}" autocomplete="off" spellcheck="false" class="${hit ? 'hit' : ''}"
              onfocus="onFocus('${slot.key}')" oninput="onType('${slot.key}',this.value)" onchange="onCommit('${slot.key}',this.value)">
            ${val ? `<button class="clr" aria-label="解除" onmousedown="event.preventDefault()" onclick="clearRow('${slot.key}')">${ICON.x}</button>` : ''}
          </div>
          <button class="chev${st.list === slot.key ? ' on' : ''}" onmousedown="event.preventDefault()" onclick="togList('${slot.key}')">▼</button>
        </div>
      </div>
      ${open ? `<div class="body">${esc(resolvedText(slot.key))}</div>` : ''}
    </div>`;
  }).join('')}
  ${z ? `<div class="zrow"><button class="zbtn" id="btnZoomCopy" onclick="copyZoom()">${ICON.zoom}ズームをコピー</button></div>` : ''}
  </div>
  ${renderAttach()}`;
}
function renderAttach() {
  return `<div class="card attach">
    <div class="bt">${ICON.gal}<span>ギャラリーに保存</span></div>
    <label class="pick${att.url ? ' has' : ''}">
      ${att.url ? `<img src="${att.url}" alt="">` : `<span class="pi">${ICON.cam}</span><span>画像を添付</span>`}
      <input type="file" id="attFile" accept="image/*" onchange="onAttach(this)">
    </label>
    ${att.url ? `<button class="mini wide" onclick="clearAttach()">画像を外す</button>` : ''}
    <input type="text" id="attName" placeholder="名前" value="${esc(att.name)}" oninput="att.name=this.value" autocomplete="off">
    <button class="b wide" id="btnGalSave" ${att.blob ? '' : 'disabled'} onclick="saveGallery()">${ICON.save}保存する</button>
  </div>`;
}
window.att = att;

window.clearRow = key => {
  st.sel[key] = null;
    st.outputEdit = null;
  if (st.open === key) st.open = '';
  st.list = ''; hideSug();
  render();
};
window.clearAll = async () => {
  if (!(await ask('全部解除する？'))) return;
  for (const s of SLOTS) if (s.key !== 'lock') st.sel[s.key] = null;
  st.outputEdit = null; st.open = ''; st.list = ''; hideSug();
  render();
};
window.copyZoom = () => { const z = zoomText(); if (z) copyText(z); };
window.tapLab = key => {
  hideSug();
  st.list = '';
  st.open = st.open === key ? '' : key;
  render({ keepFocus: 'in_' + key });
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
    bumpUse(st.sel[key].id);
    render({ keepFocus: 'in_' + key, caret });
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
  const before = st.sel[key] && st.sel[key].id;
  applyInput(key, raw, true);
  if (st.sel[key] && !st.sel[key].custom && st.sel[key].id !== before) bumpUse(st.sel[key].id);
  st.list = '';
  hideSug();
  render({ keepFocus: 'in_' + key });
};
window.togList = key => {
  document.querySelectorAll('.chev.on').forEach(b => b.classList.remove('on'));
  if (st.list === key) { st.list = ''; hideSug(); return; }
  const ae = document.activeElement;
  if (ae && ae.blur && ae.tagName === 'INPUT') ae.blur();
  st.list = key;
  st.listQ = '';
  const btn = document.querySelector(`.slot[data-key="${key}"] .chev`);
  if (btn) btn.classList.add('on');
  showSug(key, '', true);
};
function pickItem(key, id) {
  const slot = SLOTS.find(s => s.key === key);
  const it = flatOptions(slot).find(x => x.id === id);
  if (!it) return;
  st.sel[key] = recOf(it);
  st.outputEdit = null;
  st.open = key;
  st.list = '';
  if (key === 'lock') { U.fixedText = it.text; scheduleSave(); }
  bumpUse(id);
  hideSug();
  render({ keepFocus: 'in_' + key });
}
function hideSug() {
  const box = $('sug');
  if (box) { box.hidden = true; box.innerHTML = ''; }
}
function showSug(key, q, forceAll) {
  const slot = SLOTS.find(s => s.key === key);
  const box = $('sug');
  const inp = $('in_' + key);
  if (!box || !inp) return;
  const s = String(q || '').trim();
  const groups = optionsFor(slot);
  const filtered = [];
  if (listSort !== 'def' && slot.kind !== 'lock') {
    let items = [];
    for (const g of groups) items.push(...g.items);
    if (s && !forceAll) items = items.filter(it => (it.label || '').includes(s) || (it.text || '').includes(s));
    items = sortList(items, listSort);
    if (items.length) filtered.push({ group: '', items: items.slice(0, 120) });
  } else {
    for (const g of groups) {
      const items = s && !forceAll ? g.items.filter(it => (it.label || '').includes(s) || (it.text || '').includes(s)) : g.items;
      if (items.length) filtered.push({ group: g.group, items: items.slice(0, s && !forceAll ? 40 : 120) });
    }
  }
  if (!filtered.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.dataset.key = key;
  const sorts = slot.kind === 'lock' ? '' : `<div class="sorts">${SORTS.map(([k, n]) => `<button class="sc${listSort === k ? ' on' : ''}" data-sort="${k}">${n}</button>`).join('')}</div>`;
  box.innerHTML = sorts + filtered.map(g => (g.group ? `<div class="g">${esc(g.group)}</div>` : '') + g.items.map(it =>
    `<button class="opt${st.sel[key] && st.sel[key].id === it.id ? ' cur' : ''}" data-id="${esc(it.id)}">${esc(it.label)}</button>`
  ).join('')).join('');
  const r = inp.getBoundingClientRect();
  const width = Math.min(Math.max(r.width + 96, 260), window.innerWidth - 16);
  let top = r.bottom + 4;
  box.style.left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) + 'px';
  box.style.width = width + 'px';
  box.hidden = false;
  box.style.top = '0px';
  const h = Math.min(box.scrollHeight, window.innerHeight * 0.46);
  if (top + h > window.innerHeight - 8) {
    const above = r.top - 4 - h;
    top = above > 8 ? above : Math.max(8, window.innerHeight - h - 8);
  }
  box.style.top = top + 'px';
  box.style.maxHeight = '46dvh';
}
function optBody(key, id) {
  const slot = SLOTS.find(s => s.key === key);
  return flatOptions(slot).find(x => x.id === id);
}

/* ---------- attach / gallery save ---------- */
function loadImg(file) {
  return new Promise((res, rej) => {
    const u = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => res({ im, u });
    im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('画像を読めなかった')); };
    im.src = u;
  });
}
function toJpeg(im, maxSide, q) {
  const w0 = im.naturalWidth || im.width, h0 = im.naturalHeight || im.height;
  const k = Math.min(1, maxSide / Math.max(w0, h0));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w0 * k)); c.height = Math.max(1, Math.round(h0 * k));
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
  x.drawImage(im, 0, 0, c.width, c.height);
  return new Promise(res => c.toBlob(b => res(b), 'image/jpeg', q));
}
window.onAttach = async el => {
  const f = el.files && el.files[0];
  if (!f) return;
  try {
    const { im, u } = await loadImg(f);
    const big = await toJpeg(im, 1200, 0.85);
    const th = await toJpeg(im, 480, 0.8);
    URL.revokeObjectURL(u);
    if (att.url) URL.revokeObjectURL(att.url);
    att.blob = big; att.thumb = th; att.url = URL.createObjectURL(th);
    render();
  } catch (e) { status(String(e.message || e), false); }
};
window.clearAttach = () => { if (att.url) URL.revokeObjectURL(att.url); att.blob = null; att.thumb = null; att.url = ''; render(); };
window.saveGallery = async () => {
  if (!att.blob) return;
  if (!tok()) { status('トークンを入れてね', false); return; }
  const text = assemble();
  if (!text.trim()) { status('プロンプトが空だよ', false); return; }
  const btn = $('btnGalSave');
  if (btn) { btn.disabled = true; btn.textContent = '保存中…'; }
  const id = 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = (att.name || '').trim() || (st.sel.pose && st.sel.pose.label) || 'プロンプト';
  try {
    const big = new Uint8Array(await att.blob.arrayBuffer());
    const th = new Uint8Array(await att.thumb.arrayBuffer());
    await putFile(GAL_DIR + id + '.jpg', big, 'gallery add');
    await putFile(GAL_DIR + id + '_t.jpg', th, 'gallery add');
    imgCache.set(GAL_DIR + id + '_t.jpg', URL.createObjectURL(att.thumb));
    imgCache.set(GAL_DIR + id + '.jpg', URL.createObjectURL(att.blob));
    U.gallery = U.gallery || [];
    U.gallery.unshift({ id, at: now(), name, text, snap: snapshot(), img: GAL_DIR + id + '.jpg', thumb: GAL_DIR + id + '_t.jpg', n: 0, last: '' });
    const ok = await saveUser(false);
    if (att.url) URL.revokeObjectURL(att.url);
    att.blob = null; att.thumb = null; att.url = ''; att.name = '';
    render();
    if (ok) status('ギャラリーに保存したよ', true);
  } catch (e) {
    status(String(e.message || e), false);
    if (btn) { btn.disabled = false; btn.innerHTML = ICON.save + '保存する'; }
  }
};

/* ---------- 確認 ---------- */
function lookItems(cat) {
  if (cat.pose) return allPoses().map(p => ({ kind: 'pose', id: p.id, label: p.title, text: p.body, zoom: p.zoom, sub: p.cat || '', at: p.at, _ix: p._ix }));
  return allParts().filter(p => cat.cats.includes(p.cat) && p.label && p.label !== '✖️').map(p => ({ kind: 'part', id: p.id, label: p.label, text: p.text, sub: p.sub || p.cat, at: p.at, _ix: p._ix }));
}
function renderLook() {
  if (!D) return tokenCard();
  const cat = LOOK_CATS.find(c => c.key === look.cat);
  const chips = `<div class="chips">${LOOK_CATS.map(c => `<button class="chip${look.cat === c.key ? ' on' : ''}" onclick="setLookCat('${c.key}')">${esc(c.name)}</button>`).join('')}</div>`;
  const q = look.q.trim();
  let items = [];
  if (cat) items = lookItems(cat);
  else if (q) for (const c of LOOK_CATS) items.push(...lookItems(c));
  if (q) items = items.filter(it => (it.label || '').includes(q) || (it.text || '').includes(q));
  items = sortList(items, look.sort);
  let list = '';
  if (cat || q) {
    if (!items.length) list = `<div class="card empty">ない</div>`;
    else {
      let last = null, html = '';
      for (const it of items) {
        if (look.sort === 'def' && it.sub !== last) { html += `<div class="g">${esc(it.sub || '')}</div>`; last = it.sub; }
        const n = (U.use && U.use[it.id] && U.use[it.id].n) || 0;
        html += `<div class="li lp" data-kind="${it.kind}" data-id="${esc(it.id)}">
          <span class="lt">${esc(it.label)}</span>${n ? `<span class="cnt">${n}</span>` : ''}
          <button class="mini" onclick="editItem('${it.kind}','${esc(it.id)}')">編集</button>
          <button class="mini dan" onclick="delItem('${it.kind}','${esc(it.id)}')">削除</button>
        </div>`;
      }
      list = `<div class="card list">${html}</div>`;
    }
  }
  return `<div class="card">
    ${chips}
    <div class="srch"><input type="search" id="lookq" value="${esc(look.q)}" placeholder="タイトル" autocomplete="off" oninput="onLook(this.value)">
    ${(look.cat || look.q) ? `<button class="mini" onclick="clearLook()">解除</button>` : ''}</div>
    ${sortBar(look.sort, 'setLookSort', SORTS)}
  </div>
  <div id="lookList">${list}</div>`;
}
function sortBar(cur, fn, opts) {
  return `<div class="sorts">${opts.map(([k, n]) => `<button class="sc${cur === k ? ' on' : ''}" onclick="${fn}('${k}')">${n}</button>`).join('')}</div>`;
}
window.setLookCat = k => { look.cat = look.cat === k ? '' : k; LS.set('pr_lookcat', look.cat); render(); };
window.setLookSort = k => { look.sort = k; LS.set('pr_sort_look', k); render(); };
window.clearLook = () => { look.cat = ''; look.q = ''; LS.set('pr_lookcat', ''); render(); };
window.onLook = v => {
  look.q = v;
  const el0 = $('lookq'); const caret = el0 ? el0.selectionStart : v.length;
  render();
  const el = $('lookq'); if (el) { el.focus(); try { el.setSelectionRange(caret, caret); } catch (e) {} }
};
function itemOf(kind, id) {
  if (kind === 'pose') { const p = poseById(id); return p && { label: p.title, text: p.body, zoom: p.zoom }; }
  const p = partById(id); return p && { label: p.label, text: p.text };
}
window.editItem = (kind, id) => {
  const it = itemOf(kind, id);
  if (!it) return;
  modal(`<div class="mt">編集</div>
    <input type="text" id="edLab" value="${esc(it.label)}" placeholder="タイトル">
    <textarea id="edTx" placeholder="本文">${esc(it.text || '')}</textarea>
    ${kind === 'pose' ? `<textarea id="edZm" class="short" placeholder="ズーム">${esc(it.zoom || '')}</textarea>` : ''}
    <div class="row two"><button class="sub" onclick="closeModal()">キャンセル</button><button class="b" id="edSave">保存</button></div>`);
  $('edSave').onclick = () => {
    const label = $('edLab').value.trim();
    const text = $('edTx').value;
    if (!label) { $('edLab').focus(); return; }
    if (kind === 'pose') {
      const zoom = $('edZm').value;
      const ex = (U.posesExtra || []).find(x => x.id === id);
      if (ex) Object.assign(ex, { title: label, body: text, zoom });
      else U.poseEdit[id] = Object.assign({}, U.poseEdit[id] || {}, { title: label, body: text, zoom });
    } else {
      const ex = (U.partsExtra || []).find(x => x.id === id);
      if (ex) Object.assign(ex, { label, text });
      else U.partsEdit[id] = Object.assign({}, U.partsEdit[id] || {}, { label, text });
    }
    for (const s of SLOTS) {
      const v = st.sel[s.key];
      if (v && v.id === id) { v.label = label; v.text = text; if (kind === 'pose') v.zoom = $('edZm').value; }
    }
    closeModal();
    saveUser(false).then(ok => { if (ok) status('保存したよ', true); });
    render();
  };
};
window.delItem = async (kind, id) => {
  const it = itemOf(kind, id);
  if (!it) return;
  if (!(await ask(`「${it.label}」を削除する？`, '削除', 'やめる'))) return;
  if (kind === 'pose') {
    U.posesExtra = (U.posesExtra || []).filter(x => x.id !== id);
    U.poseDelete = [...new Set([...(U.poseDelete || []), id])];
  } else {
    U.partsExtra = (U.partsExtra || []).filter(x => x.id !== id);
    U.partsDelete = [...new Set([...(U.partsDelete || []), id])];
  }
  saveUser(false).then(ok => { if (ok) status('削除したよ', true); });
  render();
};

/* ---------- ギャラリー ---------- */
const GAL_SORTS = SORTS.filter(s => s[0] !== 'def');
function galList() { return sortList((U.gallery || []).filter(g => !(U.galleryDel || []).includes(g.id)), galSort, g => g.name || ''); }
function renderGal() {
  if (!D) return tokenCard();
  const list = galList();
  return `<div class="card">${sortBar(galSort, 'setGalSort', GAL_SORTS)}</div>
  ${list.length ? `<div class="grid">${list.map(g => `<div class="gt" data-id="${esc(g.id)}">
      <div class="ph"><img data-src="${esc(g.thumb || g.img)}" alt=""></div>
      <div class="gn">${esc(g.name || '')}</div>
    </div>`).join('')}</div>` : `<div class="card empty">${ICON.gal}<span>まだない</span></div>`}`;
}
window.setGalSort = k => { galSort = k; LS.set('pr_sort_gal', k); render(); };
let imgQ = [], imgBusy = 0;
function fetchImg(path) {
  if (imgCache.has(path)) return Promise.resolve(imgCache.get(path));
  return new Promise(res => { imgQ.push({ path, res }); pumpImg(); });
}
function pumpImg() {
  while (imgBusy < 4 && imgQ.length) {
    const { path, res } = imgQ.shift();
    if (imgCache.has(path)) { res(imgCache.get(path)); continue; }
    imgBusy++;
    gh(path, { headers: { Accept: 'application/vnd.github.raw' } })
      .then(r => r.ok ? r.blob() : null)
      .then(b => { const u = b ? URL.createObjectURL(b) : ''; if (u) imgCache.set(path, u); res(u); })
      .catch(() => res(''))
      .finally(() => { imgBusy--; pumpImg(); });
  }
}
function hydrateImgs() {
  document.querySelectorAll('img[data-src]').forEach(im => {
    const p = im.dataset.src;
    if (imgCache.has(p)) { im.src = imgCache.get(p); im.closest('.ph') && im.closest('.ph').classList.add('ld'); return; }
    fetchImg(p).then(u => { if (u) { im.src = u; im.closest('.ph') && im.closest('.ph').classList.add('ld'); } });
  });
}
function galById(id) { return (U.gallery || []).find(g => g.id === id); }
function openGal(id) {
  const g = galById(id);
  if (!g) return;
  modal(`<div class="mt">${esc(g.name || '')}</div>
    <div class="vimg"><img data-src="${esc(g.img)}" alt=""></div>
    <div class="prev big">${esc(g.text || '')}</div>
    <div class="row three">
      <button class="sub dan" id="gDel">削除</button>
      <button class="sub" id="gCopy">${ICON.copy}コピー</button>
      <button class="b" id="gApply">反映</button>
    </div>
    <div class="row"><button class="sub wide" onclick="closeModal()">閉じる</button></div>`, 'tall');
  const im = $('modal').querySelector('img[data-src]');
  const th = imgCache.get(g.thumb);
  if (th) im.src = th;
  fetchImg(g.img).then(u => { if (u) im.src = u; });
  $('gCopy').onclick = () => copyText(g.text || '');
  $('gApply').onclick = async () => { closeModal(); applyGal(id); };
  $('gDel').onclick = async () => {
    if (!(await ask(`「${g.name || ''}」を削除する？`, '削除', 'やめる'))) { openGal(id); return; }
    U.gallery = (U.gallery || []).filter(x => x.id !== id);
    U.galleryDel = [...new Set([...(U.galleryDel || []), id])];
    render();
    const ok = await saveUser(false);
    if (ok) status('削除したよ', true);
    if (tok()) { delFile(g.img).catch(() => {}); if (g.thumb) delFile(g.thumb).catch(() => {}); }
  };
}
async function askApply(id) {
  const g = galById(id);
  if (!g) return;
  if (await ask('このプロンプトを反映させますか？')) applyGal(id);
}
function applyGal(id) {
  const g = galById(id);
  if (!g) return;
  restoreSnap(g.snap);
  if (g.text && assemble() !== g.text) st.outputEdit = g.text;
  g.n = (g.n || 0) + 1; g.last = now();
  scheduleSave();
  tab = 'make'; LS.set('pr_tab', tab);
  render(); window.scrollTo(0, 0);
  status('反映したよ', true);
}

/* ---------- 追加 ---------- */
function renderAdd() {
  if (!D) return tokenCard();
  const cats = [...new Set(allParts().map(p => p.cat))];
  const sel = LS.get('pr_addcat', 'ポーズ・カメラ');
  const subs = sel === 'ポーズ・カメラ' ? [] : [...new Set(allParts().filter(p => p.cat === sel).map(p => p.sub))];
  return `<div class="card addf">
    <div class="bt">${ICON.add}<span>追加</span></div>
    <select id="na_cat" onchange="setAddCat(this.value)">
      <option ${sel === 'ポーズ・カメラ' ? 'selected' : ''}>ポーズ・カメラ</option>
      ${cats.map(c => `<option ${c === sel ? 'selected' : ''}>${esc(c)}</option>`).join('')}
    </select>
    ${sel === 'ポーズ・カメラ' ? '' : `<input id="na_sub" list="na_subs" placeholder="小分類" autocomplete="off" value="${esc(subs[0] || '')}"><datalist id="na_subs">${subs.map(s => `<option value="${esc(s)}">`).join('')}</datalist>`}
    <input id="na_lab" type="text" placeholder="タイトル" autocomplete="off">
    <textarea id="na_tx" placeholder="本文"></textarea>
    ${sel === 'ポーズ・カメラ' ? `<textarea id="na_zm" class="short" placeholder="ズーム"></textarea>` : ''}
    <button class="b wide" onclick="addPart()">${ICON.add}追加する</button>
  </div>`;
}
window.setAddCat = v => { LS.set('pr_addcat', v); render(); };
window.addPart = () => {
  const cat = $('na_cat').value.trim();
  const label = $('na_lab').value.trim();
  const text = $('na_tx').value;
  if (!cat || !label) { status('タイトルを入れてね', false); return; }
  if (cat === 'ポーズ・カメラ') {
    U.posesExtra = U.posesExtra || [];
    U.posesExtra.push({ id: uid(), title: label, body: text, zoom: ($('na_zm') && $('na_zm').value) || '', at: now() });
  } else {
    const sub = ($('na_sub') && $('na_sub').value.trim()) || cat;
    U.partsExtra.push({ id: uid(), cat, sub, label, text, tags: [], at: now() });
  }
  saveUser(false).then(ok => { if (ok) status('追加したよ', true); });
  status('追加したよ', true);
  render();
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
    <label class="pick slim"><span class="pi">${ICON.io}</span><span>TSVを取り込む</span><input type="file" id="tsv" accept=".tsv,.txt,text/tab-separated-values" onchange="impTsv(event)"></label>
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
      const it = { id: uid(), cat, sub, label, text: body, tags: [], at: now() };
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
  for (const p of allPoses()) poseRows.push([p.title, p.cat, p.catGroup, p.people, p.orient, p.body, p.zoom, p.line, (p.rec && p.rec.face) || '', (p.rec && p.rec.gaze) || '', (p.rec && p.rec.expr) || '']);
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
  dock.innerHTML = `<div class="in">
    <div class="pv" id="dockpv">${esc(text)}</div>
    <div class="btns">
      <button class="b" id="btnCopy">${ICON.copy}コピー</button>
      <button class="sub" id="btnLook">${ICON.eye}確認</button>
    </div>
  </div>`;
  $('dockpv').onclick = () => { st.showFull = true; renderDock(); };
  $('btnCopy').onclick = () => copyText(assemble());
  $('btnLook').onclick = () => { st.showFull = true; renderDock(); };
  if (st.showFull) {
    sheet.className = 'on';
    sheet.innerHTML = `<div class="box">
      <div class="mt">完成文</div>
      <textarea id="fullTx">${esc(text)}</textarea>
      <div class="row two">
        <button class="sub" id="fullClose">閉じる</button>
        <button class="b" id="fullCopy">${ICON.copy}コピー</button>
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
  const keep = opt.keepFocus;
  const wasActive = keep && document.activeElement && document.activeElement.id === keep;
  renderNav();
  const app = $('app');
  const caret = opt.caret;
  app.dataset.tab = tab;
  if (tab === 'make') app.innerHTML = renderMake();
  else if (tab === 'look') app.innerHTML = renderLook();
  else if (tab === 'gal') app.innerHTML = renderGal();
  else if (tab === 'add') app.innerHTML = renderAdd();
  else app.innerHTML = renderIo();
  renderDock();
  hydrateImgs();
  if (wasActive && $(keep)) {
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
  if (!ev.target.isConnected || $('modal').contains(ev.target) || $('modal').classList.contains('on')) return;
  if (ev.target.closest && ev.target.closest('.chev')) return;
  if (ev.target.closest && ev.target.closest('.inp input')) return;
  st.list = '';
  hideSug();
  document.querySelectorAll('.chev.on').forEach(b => b.classList.remove('on'));
});
window.addEventListener('scroll', () => {
  if (st.list && !$('sug').hidden && document.activeElement && document.activeElement.tagName !== 'INPUT') {
    const inp = $('in_' + st.list);
    if (!inp) return;
    const r = inp.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { st.list = ''; hideSug(); document.querySelectorAll('.chev.on').forEach(b => b.classList.remove('on')); }
  }
}, { passive: true });

function bindOnce() {
  const sug = $('sug');
  sug.addEventListener('click', ev => {
    const sb = ev.target.closest && ev.target.closest('.sc');
    if (sb) { listSort = sb.dataset.sort; LS.set('pr_sort_list', listSort); showSug(sug.dataset.key, st.listQ, !st.listQ); }
  });
  longPress(sug, '.opt', el => {
    const it = optBody(sug.dataset.key, el.dataset.id);
    if (it) showBody(it.label, it.text, it.zoom);
  }, el => pickItem(sug.dataset.key, el.dataset.id));
  const app = $('app');
  longPress(app, '.lp', el => {
    const it = itemOf(el.dataset.kind, el.dataset.id);
    if (it) showBody(it.label, it.text, it.zoom);
  }, null);
  longPress(app, '.gt', el => askApply(el.dataset.id), el => openGal(el.dataset.id));
}

async function boot() {
  status('読み込み中…');
  try {
    const cached = LS.get('pr_parts', null);
    if (cached && !D) D = cached;
    const lu = LS.get('pr_user', null);
    if (lu) U = mergeUser(lu, null);
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
addEventListener('DOMContentLoaded', () => { bindOnce(); boot(); });
})();
