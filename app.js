/* プロンプト作成 r296 */
(() => {
const API = 'https://api.github.com/repos/pokoden/slot-data/contents/';
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
/* 家具の行で選べる分類（旧「壁」のカーテン・掲示板、旧「道具」の水回り設備・拘束器具・乗り物・建物の一部もここ） */
const FURN_GROUPS = [['家具'], ['カーテン'], ['掲示板'], ['水回り設備'], ['拘束器具'], ['乗り物'], ['建物の一部']];
const SLOTS = [
  { key: 'pose', title: 'ポーズ、カメラ', kind: 'pose' },
  { key: 'face', title: '顔', kind: 'part', groups: [['顔']] },
  { key: 'body', title: '体', kind: 'part', groups: [['体']] },
  { key: 'hair', title: '髪型', kind: 'part', groups: [['髪型']] },
  { key: 'expr', title: '表情', kind: 'part', groups: [['表情']] },
  { key: 'cl0', title: '服装', kind: 'clothes', slot: 0 },
  { key: 'cl1', title: '服装', kind: 'clothes', slot: 1 },
  { key: 'cl2', title: '服装', kind: 'clothes', slot: 2 },
  { key: 'acc0', title: 'アクセサリー', kind: 'acc' },
  { key: 'acc1', title: 'アクセサリー', kind: 'acc' },
  { key: 'acc2', title: 'アクセサリー', kind: 'acc' },
  { key: 'bg', title: '背景', kind: 'part', groups: [['背景セット']] },
  { key: 'prop0', title: '家具', kind: 'part', groups: FURN_GROUPS },
  { key: 'prop1', title: '家具', kind: 'part', groups: FURN_GROUPS },
  { key: 'prop2', title: '家具', kind: 'part', groups: FURN_GROUPS },
  { key: 'light', title: '光と影', kind: 'part', groups: [['照明']] },
  { key: 'size', title: '画像サイズ', kind: 'part', groups: [['画像サイズ']] },
  { key: 'lock', title: '品質向上', kind: 'part', groups: [['品質向上']] }
];
/* 完成文の並び。あとで変えるときはここだけ直す（作成の行順と揃える） */
const JOIN_KEYS = SLOTS.map(s => s.key);
const CAT_ALIAS = { '顔モデル': '顔', '体型モデル': '体', '背景': '背景セット' };
const ACC_KEYS = ['acc0', 'acc1', 'acc2'];
const normCat = c => CAT_ALIAS[c] || c;
const catDisp = c => c === '背景セット' ? '背景' : c;
const Q_CAT = '品質向上';
const QID = l => Q_CAT + '_' + l;
const GAL_CATS = [['ポーズ', ['pose']], ['顔', ['face']], ['体', ['body']], ['髪型', ['hair']], ['表情', ['expr']], ['服装', ['cl0', 'cl1', 'cl2']], ['アクセサリー', ACC_KEYS], ['背景', ['bg']], ['家具', ['prop0', 'prop1', 'prop2']], ['完成品', null]];
/* 旧ギャラリー分類名の読み替え（壁・床は無くなったのでポーズ扱い） */
const GC_ALIAS = { '背景セット': '背景', '道具': '家具' };
const gcName = n => GC_ALIAS[n] || n;
const gcOf = g => (g && GAL_CATS.some(c => c[0] === gcName(g.gc))) ? gcName(g.gc) : 'ポーズ';
const LOOK_CATS = [
  { key: 'pose', name: 'ポーズ・カメラ', pose: true },
  { key: 'face', name: '顔', cats: ['顔'] },
  { key: 'body', name: '体', cats: ['体'] },
  { key: 'hair', name: '髪型', cats: ['髪型'] },
  { key: 'expr', name: '表情', cats: ['表情'] },
  { key: 'cloth', name: '服装', cats: ['服装'] },
  { key: 'acc', name: 'アクセサリー', cats: ['アクセサリー'] },
  { key: 'bg', name: '背景', cats: ['背景セット'] },
  { key: 'prop', name: '家具', cats: FURN_GROUPS.map(g => g[0]) },
  { key: 'light', name: '光と影', cats: ['照明'] },
  { key: 'size', name: '画像サイズ', cats: ['画像サイズ'] },
  { key: 'quality', name: '品質向上', cats: ['品質向上'] }
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
  dl: '<svg viewBox="0 0 24 24"><path d="M12 4.5v10M7.5 10.5L12 15l4.5-4.5"/><path d="M5 15.5v3a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-3"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>',
  ar: '<svg viewBox="0 0 24 24"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg>'
};
const TABS = [['make', '作成'], ['look', '確認'], ['gal', 'ギャラリー'], ['io', '取込']];

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
let galCat = gcName(LS.get('pr_galcat', 'ポーズ'));
if (!GAL_CATS.some(c => c[0] === galCat)) galCat = 'ポーズ';
let tsvDraft = '';
let listSort = LS.get('pr_sort_list', 'def');
let st = { sel: {}, open: '', list: '', listQ: '', showFull: false, outputEdit: null, og: new Set() };
let att = { blob: null, url: '', thumb: null, name: '', gc: gcName(LS.get('pr_galcat_save', 'ポーズ')) };
let gEdit = null; // { id } while overwriting a gallery entry from 作成
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
    const stamp = x => [x.ed || '', x.last || '', x.at || ''].sort().pop();
    if (!old || stamp(g) >= stamp(old)) gm.set(g.id, g);
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
function catalog() {
  if (D && D.parts && !D.parts[Q_CAT]) D.parts[Q_CAT] = { [Q_CAT]: FIXED_PRESETS.map(p => ({ id: QID(p.label), label: p.label, text: p.text, tags: [] })) };
  return D || { poses: [], parts: {}, sets: {}, rules: [], order: [] };
}
/* 旧「固定」(preset:◯◯) を品質向上の部品idへ */
function legacyId(key, v) {
  const id = v && v.id;
  if (!id || key !== 'lock' || !String(id).startsWith('preset:')) return id;
  const l = String(id).slice(7);
  const qs = allParts().filter(x => x.cat === Q_CAT);
  if (l === '設定') { const h = qs.find(x => x.text === v.text) || qs.find(x => x.label === '設定'); return h ? h.id : id; }
  const h = qs.find(x => x.id === QID(l)) || qs.find(x => x.label === l);
  return h ? h.id : id;
}
function migrateQuality() {
  const fx = U.fixedText;
  if (!D || !fx || FIXED_PRESETS.some(p => p.text === fx)) return;
  if (allParts().some(x => x.cat === Q_CAT && x.text === fx)) return;
  U.partsExtra = U.partsExtra || [];
  U.partsExtra.push({ id: uid(), cat: Q_CAT, sub: Q_CAT, label: '設定', text: fx, tags: [], at: now() });
  scheduleSave();
}
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
  for (const p of out) p.cat = poseCat(p.cat);
  return out;
}
const POSE_CAT_MAP = { '足裏見せ': '足裏指見せ', '足指見せ': '足裏指見せ' };
const poseCat = c => POSE_CAT_MAP[c] || c || '';
function groupByFirst(arr, keyOf) {
  const order = new Map();
  arr.forEach((x, i) => { const k = keyOf(x); if (!order.has(k)) order.set(k, i); });
  return arr.map((x, i) => [x, i]).sort((a, b) => (order.get(keyOf(a[0])) - order.get(keyOf(b[0]))) || (a[1] - b[1])).map(a => a[0]);
}
let peopleSel = LS.get('pr_people', '');
const PEOPLE = [['', 'すべて'], ['1人', '1人'], ['2人', '2人'], ['3人', '3人']];
window.setPeople = v => { peopleSel = v || ''; LS.set('pr_people', peopleSel); st.list = ''; hideSug(); render(); };
function savedPoseIds() {
  const del = new Set(U.galleryDel || []);
  const ids = new Set();
  for (const g of (U.gallery || [])) {
    if (del.has(g.id)) continue;
    const v = g.snap && g.snap.sel && g.snap.sel.pose;
    if (v && v.id) ids.add(v.id);
  }
  return ids;
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
function optionsFor(slot, ppl) {
  if (slot.kind === 'pose') {
    const groups = new Map();
    for (const p of allPoses()) {
      if (ppl && p.people !== ppl) continue;
      const g = p.cat || 'その他';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(p);
    }
    return [...groups].map(([group, arr]) => ({ group, items: arr.map(p => ({ id: p.id, label: p.title, text: p.body, zoom: p.zoom, people: p.people, line: p.line, orient: p.orient, at: p.at, _ix: p._ix })) })); // text is body only (poseEdit overwrites catalog body); rec.face is not included
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
function flatOptions(slot, ppl) {
  const out = [];
  for (const g of optionsFor(slot, ppl)) for (const it of g.items) out.push(Object.assign({ group: g.group }, it));
  return out;
}
function findMatch(slot, raw, ppl) {
  const s = String(raw || '').trim();
  if (!s) return null;
  const all = flatOptions(slot, ppl);
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

function qualityDefault() {
  const qs = allParts().filter(p => p.cat === Q_CAT && (p.text || p.label) && p.label !== '✖️');
  return qs.find(p => p.id === U.qualityId) || qs.find(p => p.text === U.fixedText) || qs.find(p => p.id === QID('固定')) || qs[0] || null;
}
function ensureLock() {
  if (st.sel.lock === undefined && D) {
    const p = qualityDefault();
    st.sel.lock = p ? recOf(p) : null;
  }
}
function rememberQuality(rec) {
  if (!rec || rec.custom || !rec.id) return;
  U.qualityId = rec.id; U.fixedText = rec.text || '';
  scheduleSave();
}
function inputLabel(key) {
  const v = st.sel[key];
  if (!v) return '';
  return v.custom ? v.label : (v.label || '');
}
function resolvedText(key) {
  const v = st.sel[key];
  return (v && v.text) || '';
}
function assemble() {
  if (st.outputEdit != null) return st.outputEdit;
  const chunks = [];
  for (const key of JOIN_KEYS) {
    const t = resolvedText(key);
    if (t) chunks.push(t);
  }
  // pose body already includes face direction and gaze (poseEdit). Do not append rec.face / rec.gaze / face.
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
  for (const [k, v] of Object.entries(st.sel)) if (v) sel[k] = { id: v.id, label: v.label, text: v.text, typ: v.typ, custom: v.custom || undefined, edited: v.edited || undefined };
  return { sel };
}
function restoreRow(slot, v) {
  if (!v) return null;
  let cur = null;
  const id = legacyId(slot.key, v);
  if (!v.custom && id) cur = flatOptions(slot).find(x => x.id === id);
  const out = cur ? recOf(cur) : Object.assign({}, v);
  if (cur && v.text != null && v.text !== '' && cur.text !== v.text) out.text = v.text;
  if (v.edited) out.edited = true;
  return out;
}
function restoreSnap(s) {
  if (!s || !s.sel) return;
  st.sel = {};
  for (const slot of SLOTS) {
    const v = s.sel[slot.key];
    st.sel[slot.key] = !v && slot.key === 'lock' ? undefined : restoreRow(slot, v);
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
  const rec = findMatch(slot, s, slot.kind === 'pose' ? peopleSel : '');
  st.sel[key] = rec;
  if (key === 'lock') rememberQuality(rec);
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
function closeModal() { const m = $('modal'); if (m._tidyFs) { m._tidyFs(); m._tidyFs = null; } m.className = ''; m.innerHTML = ''; }
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
    t = setTimeout(() => { fired = true; cur.classList.remove('pressing'); if (navigator.vibrate) navigator.vibrate(12); suppressAfterLong(); onLong(cur); clearSel(); }, 480);
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

/* long-press aftercare: no iOS text selection / copy callout, swallow the ghost click */
let suppressUntil = 0;
function clearSel() { try { const s = window.getSelection && window.getSelection(); if (s && s.rangeCount) s.removeAllRanges(); } catch (e) {} }
function suppressAfterLong() {
  suppressUntil = Date.now() + 700;
  const ae = document.activeElement;
  if (ae && ae.blur && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) ae.blur();
  clearSel();
  [60, 200, 450, 700].forEach(ms => setTimeout(clearSel, ms));
}
const isEditable = el => !!(el && el.closest && el.closest('input,textarea,select,[contenteditable=true]'));
['click', 'touchend', 'mouseup'].forEach(type => document.addEventListener(type, ev => {
  if (Date.now() < suppressUntil && !isEditable(ev.target)) {
    if (ev.cancelable) ev.preventDefault();
    ev.stopPropagation();
    clearSel();
    if (type === 'click') suppressUntil = 0;
  }
}, { capture: true, passive: false }));
document.addEventListener('contextmenu', ev => { if (!isEditable(ev.target)) ev.preventDefault(); }, { capture: true });
document.addEventListener('selectionchange', () => { if (Date.now() < suppressUntil) clearSel(); });
document.addEventListener('selectstart', ev => { if (!isEditable(ev.target)) ev.preventDefault(); }, { capture: true });

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
  return `<div class="card"><input id="tk" type="password" placeholder="github_pat_..."><div class="row"><button class="b" onclick="saveTok()">トークン入力</button></div></div>`;
}

function renderMake() {
  if (!D) return tokenCard();
  ensureLock();
  const z = zoomText();
  const any = SLOTS.some(s => s.key !== 'lock' && st.sel[s.key]);
  return `<div class="bar"><div class="bt">${ICON.make}<span>組合</span></div><button class="mini" id="clrAll" ${any ? '' : 'disabled'} onclick="clearAll()">全部解除</button></div>
  <div class="ppl"><span class="pl">人数</span><select id="pplSel" onchange="setPeople(this.value)">${PEOPLE.map(([v, n]) => `<option value="${v}"${peopleSel === v ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
  <div id="form">${SLOTS.map(slot => {
    const v = st.sel[slot.key];
    const val = inputLabel(slot.key);
    const hit = v && !v.custom && v.text;
    const open = st.open === slot.key && resolvedText(slot.key);
    return `<div class="slot${open ? ' on' : ''}" data-key="${slot.key}">
      <div class="slot-r">
        <button class="lab${st.list === slot.key ? ' on' : ''}" onmousedown="event.preventDefault()" onclick="tapLab('${slot.key}')">${esc(slot.title)}</button>
        <div class="inp">
          <div class="fld">
            <input id="in_${slot.key}" value="${esc(val)}" autocomplete="off" spellcheck="false" class="${hit ? 'hit' : ''}"
              onfocus="onFocus('${slot.key}')" oninput="onType('${slot.key}',this.value)" onchange="onCommit('${slot.key}',this.value)">
            ${val ? `<button class="clr" aria-label="解除" onmousedown="event.preventDefault()" onclick="clearRow('${slot.key}')">${ICON.x}</button>` : ''}
          </div>
          <button class="chev${st.list === slot.key ? ' on' : ''}" onmousedown="event.preventDefault()" onclick="togList('${slot.key}')">▼</button>
        </div>
      </div>
      ${open ? (gEdit ? `<textarea class="body ed" data-k="${slot.key}" oninput="onBodyEdit('${slot.key}',this.value)">${esc(resolvedText(slot.key))}</textarea>` : `<div class="body">${esc(resolvedText(slot.key))}</div>`) : ''}
    </div>`;
  }).join('')}
  ${z ? `<div class="zrow"><button class="zbtn" id="btnZoomCopy" onclick="copyZoom()">${ICON.zoom}ズームをコピー</button></div>` : ''}
  </div>
  ${renderAttach()}`;
}
function renderAttach() {
  if (gEdit && !galById(gEdit.id)) gEdit = null;
  if (gEdit) return `<div class="card attach ged">
    <div class="bt">${ICON.gal}<span>ギャラリーを編集</span></div>
    <label class="pick${att.url ? ' has' : ''}">
      ${att.url ? `<img src="${att.url}" alt="">` : `<span class="pi">${ICON.cam}</span><span>画像を添付</span>`}
      <input type="file" id="attFile" accept="image/*" onchange="onAttach(this)">
    </label>
    ${att.blob ? `<button class="mini wide" onclick="clearAttach()">元の画像に戻す</button>` : ''}
    <input type="text" id="attName" placeholder="名前" value="${esc(att.name)}" oninput="att.name=this.value" autocomplete="off">
    <div class="chips gcs" id="attGc">${GAL_CATS.map(([n]) => `<button class="chip${att.gc === n ? ' on' : ''}" data-gc="${n}" onclick="setAttGc('${n}')">${n}</button>`).join('')}</div>
    <div class="row two"><button class="sub" id="btnGalQuit" onclick="quitGalEdit()">編集をやめる</button><button class="b" id="btnGalSave" onclick="overwriteGallery()">${ICON.save}上書き保存</button></div>
  </div>`;
  return `<div class="card attach">
    <div class="bt">${ICON.gal}<span>ギャラリーに保存</span></div>
    <label class="pick${att.url ? ' has' : ''}">
      ${att.url ? `<img src="${att.url}" alt="">` : `<span class="pi">${ICON.cam}</span><span>画像を添付</span>`}
      <input type="file" id="attFile" accept="image/*" onchange="onAttach(this)">
    </label>
    ${att.url ? `<button class="mini wide" onclick="clearAttach()">画像を外す</button>` : ''}
    <input type="text" id="attName" placeholder="名前" value="${esc(att.name)}" oninput="att.name=this.value" autocomplete="off">
    <div class="chips gcs" id="attGc">${GAL_CATS.map(([n]) => `<button class="chip${att.gc === n ? ' on' : ''}" data-gc="${n}" onclick="setAttGc('${n}')">${n}</button>`).join('')}</div>
    <button class="b wide" id="btnGalSave" ${att.blob ? '' : 'disabled'} onclick="saveGallery()">${ICON.save}保存する</button>
  </div>`;
}
window.att = att;
window.setAttGc = n => {
  att.gc = n;
  if (!gEdit) LS.set('pr_galcat_save', n);
  document.querySelectorAll('#attGc .chip').forEach(b => b.classList.toggle('on', b.dataset.gc === n));
};

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
  if (gEdit) { gEdit = null; resetAttach(); }
  render();
};
window.copyZoom = () => { const z = zoomText(); if (z) copyText(z); };
window.tapLab = key => {
  togList(key);
};
window.onFocus = key => {
  if (skipFocus) return;
  if (gEdit && resolvedText(key) && st.open !== key) { st.open = key; render({ keepFocus: 'in_' + key }); return; }
  if (resolvedText(key)) st.open = key;
};
window.onBodyEdit = (key, val) => {
  const v = st.sel[key];
  if (!v) return;
  st.sel[key] = Object.assign({}, v, { text: val, edited: true });
  st.outputEdit = null;
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
  document.querySelectorAll('.lab.on').forEach(b => b.classList.remove('on'));
  if (st.list === key) { st.list = ''; hideSug(); return; }
  const ae = document.activeElement;
  if (ae && ae.blur && ae.tagName === 'INPUT') ae.blur();
  st.list = key;
  st.listQ = '';
  st.og = new Set();
  const slotEl = document.querySelector(`.slot[data-key="${key}"]`);
  if (slotEl) {
    const btn = slotEl.querySelector('.chev');
    const lab = slotEl.querySelector('.lab');
    if (btn) btn.classList.add('on');
    if (lab) lab.classList.add('on');
  }
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
  if (key === 'lock') rememberQuality(st.sel[key]);
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
  const groups = optionsFor(slot, slot.kind === 'pose' ? peopleSel : '');
  const saved = slot.kind === 'pose' ? savedPoseIds() : null;
  const filtering = !!(s && !forceAll);
  const filtered = [];
  for (const g of groups) {
    let items = filtering ? g.items.filter(it => (it.label || '').includes(s) || (it.text || '').includes(s)) : g.items;
    if (listSort !== 'def') items = sortList(items, listSort);
    if (items.length) filtered.push({ group: g.group, items: items.slice(0, filtering ? 40 : 200) });
  }
  if (!filtered.length) { box.hidden = true; box.innerHTML = ''; return; }
  const keepScroll = box.dataset.key === key && !box.hidden ? box.scrollTop : 0;
  box.dataset.key = key;
  const single = filtered.length === 1;
  const curId = st.sel[key] && st.sel[key].id;
  const sorts = `<div class="sorts">${SORTS.map(([k, n]) => `<button class="sc${listSort === k ? ' on' : ''}" data-sort="${k}">${n}</button>`).join('')}</div>`;
  const opt = it => `<button class="opt${curId === it.id ? ' cur' : ''}" data-id="${esc(it.id)}">${saved && !saved.has(it.id) ? '<span class="mi">未</span>' : ''}${esc(it.label)}</button>`;
  box.innerHTML = sorts + filtered.map(g => {
    if (single) return g.items.map(opt).join('');
    const open = filtering || st.og.has(g.group);
    const has = curId && g.items.some(it => it.id === curId);
    return `<button class="gh${open ? ' op' : ''}" data-g="${esc(g.group)}"><span class="ar">${ICON.ar}</span><span class="gn2">${esc(g.group)}</span>${has ? `<span class="cnt">●</span>` : `<span class="cnt">${g.items.length}</span>`}</button>`
      + (open ? `<div class="gi">${g.items.map(opt).join('')}</div>` : '');
  }).join('');
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
  if (keepScroll) box.scrollTop = keepScroll;
}
function optBody(key, id) {
  const slot = SLOTS.find(s => s.key === key);
  return flatOptions(slot).find(x => x.id === id);
}

/* ---------- attach / gallery save ---------- */

function rowAutoName(key) {
  const v = st.sel[key];
  if (!v) return '';
  if (!v.custom) {
    const title = String(v.label || '').trim();
    if (title) return title;
    return '';
  }
  const t = String(v.text || v.label || '').trim().split(/\n/)[0].trim();
  return t.slice(0, 15);
}
function autoGalName() {
  const cat = att.gc || 'ポーズ';
  const keys = cat === '完成品' ? ['pose'] : ((GAL_CATS.find(c => c[0] === cat) || [])[1] || []);
  return keys.map(rowAutoName).filter(Boolean).join('・');
}
function galSaveName() {
  return (att.name || '').trim() || autoGalName();
}

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
    if (att.url && att.blob) URL.revokeObjectURL(att.url);
    att.blob = big; att.thumb = th; att.url = URL.createObjectURL(th);
    render();
  } catch (e) { status(String(e.message || e), false); }
};
window.clearAttach = () => {
  if (att.url && att.blob) URL.revokeObjectURL(att.url);
  att.blob = null; att.thumb = null; att.url = '';
  if (gEdit) showGalEditImg(gEdit.id);
  render();
};
function resetAttach() {
  if (att.url && att.blob) URL.revokeObjectURL(att.url);
  att.blob = null; att.thumb = null; att.url = ''; att.name = '';
  att.gc = gcName(LS.get('pr_galcat_save', 'ポーズ'));
}
function showGalEditImg(id) {
  const g = galById(id);
  if (!g) return;
  att.url = imgCache.get(g.img) || imgCache.get(g.thumb) || '';
  if (!att.url) fetchImg(g.thumb || g.img).then(u => {
    if (u && gEdit && gEdit.id === id && !att.blob) { att.url = u; if (tab === 'make') render(); }
  });
}
window.quitGalEdit = () => {
  gEdit = null;
  resetAttach();
  render();
};
window.overwriteGallery = async () => {
  if (!gEdit) return;
  const g = galById(gEdit.id);
  if (!g) { gEdit = null; render(); return; }
  if (!tok()) { status('トークンを入れてね', false); return; }
  const text = assemble();
  if (!text.trim()) { status('プロンプトが空だよ', false); return; }
  if (!(await ask('上書きしますか？', '上書き', 'やめる'))) return;
  const btn = $('btnGalSave');
  if (btn) { btn.disabled = true; btn.textContent = '保存中…'; }
  const old = { img: g.img, thumb: g.thumb };
  try {
    if (att.blob) {
      const v = Date.now().toString(36);
      const img = GAL_DIR + g.id + '_' + v + '.jpg', thumb = GAL_DIR + g.id + '_' + v + '_t.jpg';
      await putFile(img, new Uint8Array(await att.blob.arrayBuffer()), 'gallery edit');
      await putFile(thumb, new Uint8Array(await att.thumb.arrayBuffer()), 'gallery edit');
      imgCache.set(thumb, URL.createObjectURL(att.thumb));
      imgCache.set(img, URL.createObjectURL(att.blob));
      g.img = img; g.thumb = thumb;
    }
    g.text = text;
    g.snap = snapshot();
    g.name = galSaveName();
    g.gc = att.gc || gcOf(g);
    g.ed = now();
    const ok = await saveUser(false);
    if (ok && g.img !== old.img) { delFile(old.img).catch(() => {}); if (old.thumb && old.thumb !== g.thumb) delFile(old.thumb).catch(() => {}); }
    gEdit = null;
    resetAttach();
    render();
    if (ok) status('上書きしたよ', true);
  } catch (e) {
    status(String(e.message || e), false);
    if (btn) { btn.disabled = false; btn.innerHTML = ICON.save + '上書き保存'; }
  }
};
window.saveGallery = async () => {
  if (!att.blob) return;
  if (!tok()) { status('トークンを入れてね', false); return; }
  const text = assemble();
  if (!text.trim()) { status('プロンプトが空だよ', false); return; }
  const btn = $('btnGalSave');
  if (btn) { btn.disabled = true; btn.textContent = '保存中…'; }
  const id = 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = galSaveName();
  try {
    const big = new Uint8Array(await att.blob.arrayBuffer());
    const th = new Uint8Array(await att.thumb.arrayBuffer());
    await putFile(GAL_DIR + id + '.jpg', big, 'gallery add');
    await putFile(GAL_DIR + id + '_t.jpg', th, 'gallery add');
    imgCache.set(GAL_DIR + id + '_t.jpg', URL.createObjectURL(att.thumb));
    imgCache.set(GAL_DIR + id + '.jpg', URL.createObjectURL(att.blob));
    U.gallery = U.gallery || [];
    U.gallery.unshift({ id, at: now(), name, gc: att.gc || 'ポーズ', text, snap: snapshot(), img: GAL_DIR + id + '.jpg', thumb: GAL_DIR + id + '_t.jpg', n: 0, last: '' });
    const ok = await saveUser(false);
    resetAttach();
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
  if (look.sort === 'def') items = groupByFirst(items, it => it.sub || '');
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
function galLive() { const del = new Set(U.galleryDel || []); return (U.gallery || []).filter(g => !del.has(g.id)); }
function galImgFor(kind, id) {
  let best = null, bs = '';
  for (const g of galLive()) {
    const sel = (g.snap && g.snap.sel) || {};
    const hit = kind === 'pose' ? !!(sel.pose && sel.pose.id === id) : Object.entries(sel).some(([k, v]) => k !== 'pose' && v && legacyId(k, v) === id);
    if (!hit) continue;
    const s = [g.ed || '', g.at || ''].sort().pop();
    if (!best || s > bs) { best = g; bs = s; }
  }
  return best;
}
window.editItem = (kind, id) => {
  const it = itemOf(kind, id);
  if (!it) return;
  const gi = galImgFor(kind, id);
  modal(`<div class="mt">編集</div>
    ${gi ? `<div class="edImg"><img id="edImg" alt=""></div>` : ''}
    <input type="text" id="edLab" value="${esc(it.label)}" placeholder="タイトル">
    <textarea id="edTx" placeholder="本文">${esc(it.text || '')}</textarea>
    ${kind === 'pose' ? `<textarea id="edZm" class="short" placeholder="ズーム">${esc(it.zoom || '')}</textarea>` : ''}
    <div class="row two"><button class="sub" onclick="closeModal()">キャンセル</button><button class="b" id="edSave">保存</button></div>`);
  if (gi) {
    const im = $('edImg'), th = imgCache.get(gi.thumb) || imgCache.get(gi.img);
    if (th) { im.src = th; im.parentNode.classList.add('ld'); }
    else fetchImg(gi.thumb || gi.img).then(u => { if (u && im.isConnected) { im.src = u; im.parentNode.classList.add('ld'); } });
  }
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
function galList() { return sortList(galLive().filter(g => gcOf(g) === galCat), galSort, g => g.name || ''); }
function renderGal() {
  if (!D) return tokenCard();
  const list = galList();
  const cnt = {};
  for (const g of galLive()) cnt[gcOf(g)] = (cnt[gcOf(g)] || 0) + 1;
  return `<div class="card"><div class="chips gcs">${GAL_CATS.map(([n]) => `<button class="chip${galCat === n ? ' on' : ''}" onclick="setGalCat('${n}')">${n}${cnt[n] ? `<span class="gcn">${cnt[n]}</span>` : ''}</button>`).join('')}</div>${sortBar(galSort, 'setGalSort', GAL_SORTS)}</div>
  ${list.length ? `<div class="grid">${list.map(g => `<div class="gt" data-id="${esc(g.id)}">
      <div class="ph"><img data-src="${esc(g.thumb || g.img)}" alt=""></div>
      <div class="gn">${esc(g.name || '')}</div>
    </div>`).join('')}</div>` : `<div class="card empty">${ICON.gal}<span>まだない</span></div>`}`;
}
window.setGalSort = k => { galSort = k; LS.set('pr_sort_gal', k); render(); };
window.setGalCat = n => { galCat = n; LS.set('pr_galcat', n); render(); };
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
function bindFsSwipe(m, onClose, onNav, onTap) {
  const img = m.querySelector('.fsimg');
  const box = m.querySelector('.mbox.fs');
  const pic = img && img.querySelector('img');
  if (!img || !box) return;
  let sx = 0, sy = 0, dx = 0, dy = 0, moving = false, pid = 0, axis = '';
  const start = (x, y, id) => { moving = true; axis = ''; pid = id || 0; sx = x; sy = y; dx = 0; dy = 0; box.style.transition = 'none'; if (pic) pic.style.transition = 'none'; };
  const move = (x, y) => {
    if (!moving) return;
    dx = x - sx; dy = y - sy;
    if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    if (axis === 'x' && pic) {
      const can = onNav(dx < 0 ? 1 : -1, true);
      pic.style.transform = 'translateX(' + (can ? dx : dx / 4) + 'px)';
      pic.style.opacity = String(Math.max(0.35, 1 - Math.abs(dx) / 600));
    } else if (axis === 'y' && dy > 0) {
      box.style.transform = 'translateY(' + dy + 'px)';
      box.style.opacity = String(Math.max(0.3, 1 - dy / 420));
    }
  };
  const reset = () => {
    box.style.transition = 'transform .2s, opacity .2s'; box.style.transform = ''; box.style.opacity = '';
    if (pic) { pic.style.transition = 'transform .2s, opacity .2s'; pic.style.transform = ''; pic.style.opacity = ''; }
  };
  const end = () => {
    if (!moving) return;
    moving = false;
    if (axis === 'x' && Math.abs(dx) > 55) {
      const dir = dx < 0 ? 1 : -1;
      if (onNav(dir, true)) {
        if (pic) { pic.style.transition = 'transform .16s ease-in, opacity .16s'; pic.style.transform = 'translateX(' + (dir > 0 ? '-110%' : '110%') + ')'; pic.style.opacity = '0'; }
        setTimeout(() => onNav(dir, false), 150);
        return;
      }
    }
    if (axis === 'y' && dy > 90) { if (box.classList.contains('only') && onTap) { reset(); onTap(); } else onClose(); return; }
    if (!axis) { (onTap || onClose)(); return; }
    reset();
  };
  const skip = ev => ev.target.closest && ev.target.closest('.fssave');
  img.addEventListener('touchstart', ev => { if (skip(ev)) return; const t = ev.changedTouches[0]; start(t.clientX, t.clientY, t.identifier); }, { passive: true });
  img.addEventListener('touchmove', ev => { const t = [...ev.touches].find(x => x.identifier === pid) || ev.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });
  img.addEventListener('touchend', ev => { if (skip(ev)) return; if (ev.cancelable) ev.preventDefault(); end(); }, { passive: false });
  img.addEventListener('touchcancel', () => { moving = false; reset(); });
  img.addEventListener('mousedown', ev => { if (skip(ev)) return; ev.preventDefault(); start(ev.clientX, ev.clientY, -1); });
  const onMove = ev => { if (pid === -1) move(ev.clientX, ev.clientY); };
  const onUp = () => { if (pid === -1) { end(); pid = 0; } };
  const onKey = ev => { if (ev.key === 'ArrowRight') onNav(1, false); else if (ev.key === 'ArrowLeft') onNav(-1, false); else if (ev.key === 'Escape') { if (box.classList.contains('only') && onTap) onTap(); else onClose(); } };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  window.addEventListener('keydown', onKey);
  m._tidyFs = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); window.removeEventListener('keydown', onKey); };
}
let galFs = false;
const saveFiles = new Map();
function imgFile(path, name) {
  if (saveFiles.has(path)) return saveFiles.get(path);
  const pr = fetchImg(path).then(u => u ? fetch(u).then(r => r.blob()) : null).then(async b => {
    if (!b) return null;
    const h = new Uint8Array(await b.slice(0, 4).arrayBuffer());
    const png = h[0] === 0x89 && h[1] === 0x50, webp = h[0] === 0x52 && h[1] === 0x49;
    const type = png ? 'image/png' : webp ? 'image/webp' : 'image/jpeg';
    const ext = png ? 'png' : webp ? 'webp' : 'jpg';
    const base = String(name || 'image').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40) || 'image';
    return new File([b], base + '.' + ext, { type });
  }).catch(() => null);
  pr.then(f => { if (f) pr.file = f; else saveFiles.delete(path); });
  saveFiles.set(path, pr);
  return pr;
}
async function saveImg(g) {
  const pr = imgFile(g.img, g.name || g.id);
  const f = pr.file || await pr;
  if (!f) { status('画像を読めなかった', false); return; }
  if (navigator.canShare && navigator.share && navigator.canShare({ files: [f] })) {
    try { await navigator.share({ files: [f] }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  const u = URL.createObjectURL(f);
  a.href = u; a.download = f.name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 4000);
}
function openGal(id, from) {
  const g = galById(id);
  if (!g) return;
  const ids = galList().map(x => x.id);
  const ix = ids.indexOf(id);
  const m = $('modal');
  if (m._tidyFs) { m._tidyFs(); m._tidyFs = null; }
  const dots = ids.length > 1 && ids.length <= 15 ? `<div class="fsdots">${ids.map((x, i) => `<i class="${i === ix ? 'on' : ''}"></i>`).join('')}</div>` : '';
  if (!from) galFs = false;
  m.innerHTML = `<div class="mbox fs${galFs ? ' only' : ''}">
    <div class="fsimg${from ? ' in-' + (from > 0 ? 'r' : 'l') : ''}"><img data-src="${esc(g.img)}" alt="">${ids.length > 1 ? `<span class="fsnum">${ix + 1} / ${ids.length}</span>` : ''}<button class="fssave" id="gSave" aria-label="保存">${ICON.dl}</button></div>
    <div class="fschrome">
      ${dots}
      <div class="mt">${esc(g.name || '')}</div>
      <div class="prev fsprev">${esc(g.text || '')}</div>
      <div class="row five">
        <button class="sub dan" id="gDel">削除</button>
        <button class="sub" id="gEdit">編集</button>
        <button class="sub" id="gCopy">コピー</button>
        <button class="b" id="gApply">反映</button>
        <button class="sub" id="gClose">閉じる</button>
      </div>
    </div>
  </div>`;
  m.className = 'on full';
  m.onclick = ev => { if (ev.target === m) closeModal(); };
  const im = m.querySelector('img[data-src]');
  const th = imgCache.get(g.thumb);
  if (th) im.src = th;
  fetchImg(g.img).then(u => { if (u && im.isConnected) im.src = u; });
  imgFile(g.img, g.name || g.id);
  for (const d of [-1, 1]) { const n = galById(ids[ix + d]); if (n) fetchImg(n.img); }
  const box = m.querySelector('.mbox.fs');
  bindFsSwipe(m, closeModal, (dir, dry) => {
    const nid = ids[ix + dir];
    if (!nid) return false;
    if (!dry) openGal(nid, dir);
    return true;
  }, () => { galFs = !galFs; box.classList.toggle('only', galFs); });
  $('gSave').onclick = ev => { ev.stopPropagation(); saveImg(g); };
  $('gClose').onclick = ev => { ev.stopPropagation(); closeModal(); };
  $('gCopy').onclick = ev => { ev.stopPropagation(); copyText(g.text || ''); };
  $('gApply').onclick = ev => { ev.stopPropagation(); closeModal(); applyGal(id); };
  $('gEdit').onclick = ev => { ev.stopPropagation(); closeModal(); editGal(id); };
  $('gDel').onclick = async ev => {
    ev.stopPropagation();
    if (!(await ask(`「${g.name || ''}」を削除する？`, '削除', 'やめる'))) { openGal(id); return; }
    U.gallery = (U.gallery || []).filter(x => x.id !== id);
    U.galleryDel = [...new Set([...(U.galleryDel || []), id])];
    if (gEdit && gEdit.id === id) { gEdit = null; resetAttach(); }
    render();
    const ok = await saveUser(false);
    if (ok) status('削除したよ', true);
    if (tok()) { delFile(g.img).catch(() => {}); if (g.thumb) delFile(g.thumb).catch(() => {}); }
  };
}
/* text each row contributes for a gallery snap (same rule as restoreSnap) */
function snapRowText(slot, v) {
  if (!v) return '';
  if (v.text != null && v.text !== '') return v.text;
  const id = legacyId(slot.key, v);
  if (!v.custom && id) { const cur = flatOptions(slot).find(x => x.id === id); if (cur) return cur.text || ''; }
  return '';
}
function snapAssemble(snap) {
  const sel = (snap && snap.sel) || {};
  return JOIN_KEYS.map(key => {
    const slot = SLOTS.find(s => s.key === key);
    return slot ? snapRowText(slot, sel[key]) : '';
  }).filter(Boolean).join('\n');
}
function editGal(id) {
  const g = galById(id);
  if (!g) return;
  restoreSnap(g.snap);
  if (g.text && assemble() !== g.text) st.outputEdit = g.text;
  const ed = SLOTS.find(slot => st.sel[slot.key] && st.sel[slot.key].edited && resolvedText(slot.key));
  if (ed) st.open = ed.key;
  st.list = ''; st.showFull = false; hideSug();
  resetAttach();
  gEdit = { id };
  att.name = g.name || '';
  att.gc = gcOf(g);
  showGalEditImg(id);
  tab = 'make'; LS.set('pr_tab', tab);
  render(); window.scrollTo(0, 0);
}
function applyGal(id) {
  const g = galById(id);
  if (!g) return;
  if (gEdit) { gEdit = null; resetAttach(); }
  const gc = gcOf(g);
  const base = (GAL_CATS.find(c => c[0] === gc) || [])[1];
  const keys = base && gc === '服装' ? base.concat(ACC_KEYS) : base;
  if (!keys) {
    restoreSnap(g.snap);
    if (g.text && assemble() !== g.text) st.outputEdit = g.text;
    const ed = SLOTS.find(slot => st.sel[slot.key] && st.sel[slot.key].edited && resolvedText(slot.key));
    if (ed) st.open = ed.key;
  } else {
    const sel = (g.snap && g.snap.sel) || {};
    for (const k of keys) st.sel[k] = restoreRow(SLOTS.find(s => s.key === k), sel[k]);
    ensureLock();
    st.outputEdit = null;
    const ed = keys.find(k => st.sel[k] && st.sel[k].edited && resolvedText(k));
    st.open = ed || '';
  }
  st.list = ''; hideSug();
  g.n = (g.n || 0) + 1; g.last = now();
  scheduleSave();
  tab = 'make'; LS.set('pr_tab', tab);
  render(); window.scrollTo(0, 0);
  status('反映したよ', true);
}

function renderIo() {
  return `${!D ? tokenCard() : ''}
  <div class="card">
    <label class="pick slim"><span class="pi">${ICON.io}</span><span>TSVファイルで取り込む</span><input type="file" id="tsv" accept=".tsv,.txt,text/tab-separated-values" onchange="impTsv(event)"></label>
  </div>
  <div class="card">
    <div class="bt">${ICON.copy}<span>TSVテキストで取り込む</span></div>
    <textarea id="tsvTx" class="tsvtx" spellcheck="false" autocomplete="off" autocapitalize="off" oninput="setTsvDraft(this.value)">${esc(tsvDraft)}</textarea>
    <button class="b wide" id="btnTsvTx" onclick="impTsvPaste()">${ICON.io}取り込む</button>
  </div>
  <div class="card">
    <button class="b wide xl" onclick="dlXlsx()">${ICON.save}エクセルに書き出し</button>
  </div>
  ${D ? `<div class="card">
    <input id="tk" type="password" placeholder="${tok() ? '保存済み' : 'github_pat_...'}">
    <button class="sub wide" onclick="saveTok()">トークン入力</button>
  </div>` : ''}`;
}
window.setTsvDraft = v => { tsvDraft = v; };

function parseTsv(text) {
  const src = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const rows = [];
  let row = [], cell = '', i = 0, q = false, start = true;
  while (i < src.length) {
    const ch = src[i];
    if (q) {
      if (ch === '"') { if (src[i + 1] === '"') { cell += '"'; i += 2; continue; } q = false; i++; continue; }
      cell += ch; i++; continue;
    }
    if (ch === '"' && start) { q = true; start = false; i++; continue; }
    if (ch === '\t') { row.push(cell); cell = ''; start = true; i++; continue; }
    if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; start = true; i++; continue; }
    cell += ch; start = false; i++;
  }
  row.push(cell); rows.push(row);
  return rows.filter(r => r.some(c => String(c).trim()));
}
const POSE_COLS = { 'タイトル': 'title', 'プロンプト': 'body', 'ズーム': 'zoom', 'オススメ画像向き': 'orient', '人数': 'people', 'ポーズ': 'cat', 'セリフ': 'line' };
function impMode(kind, n, cats) {
  return new Promise(res => {
    const done = v => { closeModal(); res(v); };
    modal(`<div class="impHd"><span class="pi">${ICON.io}</span><div><div class="mt">${kind === 'pose' ? 'ポーズ' : '部品'}を取り込む</div><div class="impSub">${n}件${cats.length ? '・' + esc(cats.join('・')) : ''}</div></div></div>
      <button class="b wide impBtn" id="impAdd">追加・上書き</button>
      <button class="sub wide impBtn impRep" id="impRep">入れ替え</button>
      <button class="sub wide impBtn" id="impNo">やめる</button>`, 'small');
    $('impAdd').onclick = () => done('add');
    $('impRep').onclick = () => done('rep');
    $('impNo').onclick = () => done('');
    $('modal').onclick = ev => { if (ev.target === $('modal')) done(''); };
  });
}
function impResult(title, lines) {
  modal(`<div class="impHd"><span class="pi">${ICON.io}</span><div class="mt">${esc(title)}</div></div>
    <div class="impRes">${lines.map(([k, v]) => `<div><span>${esc(k)}</span><b>${v}件</b></div>`).join('')}</div>
    <button class="b wide" onclick="closeModal()">OK</button>`, 'small');
}
function refreshSel() {
  for (const s of SLOTS) {
    const v = st.sel[s.key];
    if (!v || !v.id) continue;
    const it = s.kind === 'pose' ? poseById(v.id) : partById(v.id);
    if (!it) continue;
    if (s.kind === 'pose') Object.assign(v, { label: it.title, text: it.body, zoom: it.zoom, people: it.people, line: it.line, orient: it.orient });
    else Object.assign(v, { label: it.label, text: it.text });
  }
}
function impPoses(rows, head, mode) {
  const col = {};
  head.forEach((h, i) => { if (POSE_COLS[h] && !(POSE_COLS[h] in col)) col[POSE_COLS[h]] = i; });
  U.poseEdit = U.poseEdit || {}; U.posesExtra = U.posesExtra || [];
  const groupOf = new Map(allPoses().filter(p => p.catGroup).map(p => [p.cat, p.catGroup]));
  const isExtra = id => U.posesExtra.some(x => x.id === id);
  const n = { up: 0, add: 0, del: 0 };
  const recs = rows.map(c => {
    const r = {};
    for (const k in col) { const v = String(c[col[k]] ?? '').trim(); if (v) r[k] = v; }
    if (r.cat) r.cat = poseCat(r.cat);
    return r;
  }).filter(r => r.title);
  const reuse = new Map();
  if (mode === 'rep') {
    const cats = new Set(recs.map(r => r.cat).filter(Boolean));
    const titles = new Set(recs.map(r => r.title));
    for (const p of allPoses()) {
      if (!cats.has(p.cat)) continue;
      if (titles.has(p.title) && !reuse.has(p.title)) { reuse.set(p.title, p.id); continue; }
      U.posesExtra = U.posesExtra.filter(x => x.id !== p.id);
      U.poseDelete = [...new Set([...(U.poseDelete || []), p.id])];
      n.del++;
    }
  }
  const byTitle = new Map();
  for (const p of allPoses()) if (!byTitle.has(p.title)) byTitle.set(p.title, p.id);
  for (const r of recs) {
    const id = reuse.get(r.title) || byTitle.get(r.title);
    const patch = Object.assign({}, r);
    if (r.cat && groupOf.has(r.cat)) patch.catGroup = groupOf.get(r.cat);
    if (id) {
      if (isExtra(id)) Object.assign(U.posesExtra.find(x => x.id === id), patch);
      else U.poseEdit[id] = Object.assign({}, U.poseEdit[id] || {}, patch);
      n.up++;
    } else {
      const it = Object.assign({ id: uid(), body: '', zoom: '', at: now() }, patch);
      U.posesExtra.push(it);
      byTitle.set(r.title, it.id);
      n.add++;
    }
  }
  return n;
}
function impParts(rows, head, mode) {
  const ix = n => head.indexOf(n);
  const recs = rows.map(c => {
    const get = name => { const i = ix(name); return i >= 0 ? (c[i] || '') : ''; };
    let cat = get('分類') || get('今のタブ') || '';
    let sub = get('小分類') || get('今の分類') || cat;
    const label = get('名前') || get('タイトル') || '';
    const body = get('本文') || get('新しい本文') || get('プロンプト') || '';
    if (!cat) cat = '服装';
    if (!sub) sub = cat;
    cat = normCat(cat);
    sub = normCat(sub);
    return { cat, sub, label, body, hasSub: !!(get('小分類') || get('今の分類')) };
  }).filter(r => r.label);
  const n = { up: 0, add: 0, del: 0 };
  U.partsExtra = U.partsExtra || []; U.partsEdit = U.partsEdit || {};
  if (mode === 'rep') {
    const cats = new Set(recs.map(r => r.cat));
    const keep = new Set(recs.map(r => r.cat + '\t' + r.label));
    const reused = new Map();
    for (const p of allParts()) {
      if (!cats.has(p.cat)) continue;
      const k = p.cat + '\t' + p.label;
      if (keep.has(k) && !reused.has(k)) { reused.set(k, p.id); continue; }
      U.partsExtra = U.partsExtra.filter(x => x.id !== p.id);
      U.partsDelete = [...new Set([...(U.partsDelete || []), p.id])];
      n.del++;
    }
    for (const r of recs) {
      const k = r.cat + '\t' + r.label;
      const id = reused.get(k);
      const patch = { label: r.label };
      if (r.body.trim()) patch.text = r.body;
      if (r.hasSub) patch.sub = r.sub;
      if (id) {
        const ex = U.partsExtra.find(x => x.id === id);
        if (ex) Object.assign(ex, patch); else U.partsEdit[id] = Object.assign({}, U.partsEdit[id] || {}, patch);
        n.up++;
      } else {
        const it = { id: uid(), cat: r.cat, sub: r.sub, label: r.label, text: r.body, tags: [], at: now() };
        U.partsExtra.push(it);
        reused.set(k, it.id);
        n.add++;
      }
    }
    return n;
  }
  /* 追加・上書き：従来どおり */
  const byLabel = new Map(allParts().map(p => [p.cat + '\t' + p.label, p]));
  for (const r of recs) {
    const { cat, sub, label, body } = r;
    const exist = byLabel.get(cat + '\t' + label) || allParts().find(p => p.label === label);
    if (exist) {
      if (U.partsExtra.some(x => x.id === exist.id)) {
        const e = U.partsExtra.find(x => x.id === exist.id);
        e.text = body; e.label = label;
      } else U.partsEdit[exist.id] = Object.assign({}, U.partsEdit[exist.id] || {}, { label, text: body });
      n.up++;
    } else {
      const it = { id: uid(), cat, sub, label, text: body, tags: [], at: now() };
      U.partsExtra.push(it);
      byLabel.set(cat + '\t' + label, it);
      n.add++;
    }
  }
  return n;
}
window.impTsv = async ev => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const text = await f.text();
  ev.target.value = '';
  await impTsvText(text);
};
window.impTsvPaste = async () => {
  const el = $('tsvTx');
  const v = el ? el.value : tsvDraft;
  if (!String(v || '').trim()) { status('TSVを貼り付けてね', false); return; }
  tsvDraft = v;
  if (await impTsvText(v)) { tsvDraft = ''; const e2 = $('tsvTx'); if (e2) e2.value = ''; }
};
async function impTsvText(text) {
  const all = parseTsv(text);
  if (all.length < 2) { status('取り込む行がないよ', false); return false; }
  const head = all[0].map(s => String(s).trim());
  const rows = all.slice(1);
  const ti = head.indexOf('タイトル');
  let kind = 'part';
  if (ti >= 0 && head.includes('プロンプト') && !head.includes('分類') && !head.includes('名前')) {
    if (['ズーム', 'オススメ画像向き', '人数', 'ポーズ', 'セリフ'].some(h => head.includes(h))) kind = 'pose';
    else {
      const pt = new Set(allPoses().map(p => p.title));
      const ts = rows.map(c => String(c[ti] || '').trim()).filter(Boolean);
      if (ts.length && ts.every(t => pt.has(t))) kind = 'pose';
    }
  }
  let cats;
  if (kind === 'pose') { const ci = head.indexOf('ポーズ'); cats = ci >= 0 ? [...new Set(rows.map(c => poseCat(String(c[ci] || '').trim())).filter(Boolean))] : []; }
  else { const ci = head.indexOf('分類') >= 0 ? head.indexOf('分類') : head.indexOf('今のタブ'); cats = ci >= 0 ? [...new Set(rows.map(c => normCat(String(c[ci] || '').trim() || '服装')))] : ['服装']; }
  const mode = await impMode(kind, rows.length, kind === 'pose' ? cats : cats.map(catDisp));
  if (!mode) return false;
  if (mode === 'rep') {
    if (kind === 'pose' && !cats.length) { status('ポーズ列がないと入れ替えできないよ', false); return false; }
    if (!(await ask(`${(kind === 'pose' ? cats : cats.map(catDisp)).join('・')} を入れ替えますか？`, '入れ替える', 'やめる'))) return false;
  }
  const n = kind === 'pose' ? impPoses(rows, head, mode) : impParts(rows, head, mode);
  refreshSel();
  st.list = '';
  scheduleSave();
  render();
  if (mode === 'rep') impResult('入れ替えたよ', [['削除', n.del], ['上書き', n.up], ['追加', n.add]]);
  else impResult('取り込んだよ', [['上書き', n.up], ['追加', n.add]]);
  return true;
}

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
    <div class="btns">
      <button class="b" id="btnCopy">${ICON.copy}コピー</button>
      <button class="sub" id="btnLook">${ICON.eye}確認</button>
    </div>
  </div>`;
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
  if (ev.target.closest && ev.target.closest('.lab')) return;
  if (ev.target.closest && ev.target.closest('.inp input')) return;
  st.list = '';
  hideSug();
  document.querySelectorAll('.chev.on,.lab.on').forEach(b => b.classList.remove('on'));
});
window.addEventListener('scroll', () => {
  if (st.list && !$('sug').hidden && document.activeElement && document.activeElement.tagName !== 'INPUT') {
    const inp = $('in_' + st.list);
    if (!inp) return;
    const r = inp.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { st.list = ''; hideSug(); document.querySelectorAll('.chev.on,.lab.on').forEach(b => b.classList.remove('on')); }
  }
}, { passive: true });

function bindOnce() {
  const sug = $('sug');
  sug.addEventListener('click', ev => {
    const sb = ev.target.closest && ev.target.closest('.sc');
    if (sb) { listSort = sb.dataset.sort; LS.set('pr_sort_list', listSort); showSug(sug.dataset.key, st.listQ, !st.listQ); return; }
    const gh = ev.target.closest && ev.target.closest('.gh');
    if (gh) {
      const g = gh.dataset.g;
      if (st.og.has(g)) st.og.delete(g); else st.og.add(g);
      showSug(sug.dataset.key, st.listQ, !st.listQ);
    }
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
  app.addEventListener('click', ev => {
    const gt = ev.target.closest && ev.target.closest('.gt');
    if (gt && app.contains(gt)) openGal(gt.dataset.id);
  });
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
    migrateQuality();
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
