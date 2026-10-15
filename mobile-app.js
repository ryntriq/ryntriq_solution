const appState = { language: 'en', screen: 'home', lastTool: 'apps' };
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(() => {}), { once: true });
}
const screens = [...document.querySelectorAll('.app-screen')];
const tabs = [...document.querySelectorAll('.bottom-nav [data-tab]')];
const toast = document.querySelector('.toast');
const serviceInfo = {
  web: {
    title: ['Website design & development', 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট'],
    body: ['A responsive website planned around your brand, audience and goals—from clear page structure to a thoughtful launch.', 'আপনার ব্র্যান্ড, দর্শক ও লক্ষ্য অনুযায়ী রেসপনসিভ ওয়েবসাইট—পরিষ্কার পেজ পরিকল্পনা থেকে যত্নশীলভাবে চালু করা পর্যন্ত।'],
    points: [['Page planning · UI design · responsive development', 'পেজ পরিকল্পনা · UI ডিজাইন · রেসপনসিভ ডেভেলপমেন্ট'], ['A practical handoff for updates and next steps', 'আপডেট ও পরবর্তী কাজের জন্য ব্যবহারিক handoff']]
  },
  data: {
    title: ['Data entry, cleaning & matching', 'ডেটা এন্ট্রি, পরিষ্কার ও মিলানো'],
    body: ['Organize spreadsheets and records with careful entry, consistent formatting, duplicate cleanup and practical matching.', 'যত্নসহকারে ডেটা এন্ট্রি, একরকম ফরম্যাট, ডুপ্লিকেট পরিষ্কার ও প্রয়োজনমতো রেকর্ড মিলিয়ে স্প্রেডশিট গুছিয়ে নিন।'],
    points: [['Spreadsheet and record cleanup', 'স্প্রেডশিট ও রেকর্ড পরিষ্কার'], ['Matching rules agreed to your task', 'আপনার কাজ অনুযায়ী মিলানোর নিয়ম ঠিক করা']]
  },
  automation: {
    title: ['Custom task automation', 'নিজস্ব কাজের অটোমেশন'],
    body: ['Small scripts and purpose-built tools can reduce repeated steps in your daily process. We start by understanding the exact workflow.', 'ছোট স্ক্রিপ্ট ও নির্দিষ্ট টুল দিয়ে দৈনন্দিন কাজের পুনরাবৃত্ত ধাপ কমানো যায়। আমরা আগে আপনার কাজের ধাপগুলো বুঝে নিই।'],
    points: [['Repeat task review and automation plan', 'পুনরাবৃত্ত কাজ দেখা ও অটোমেশন পরিকল্পনা'], ['Lightweight tools shaped around your process', 'আপনার প্রক্রিয়া অনুযায়ী হালকা টুল']]
  }
};

function t(en, bn) { return appState.language === 'bn' ? bn : en; }
function translate(root = document) {
  root.querySelectorAll('[data-en][data-bn]').forEach(el => {
    el.innerHTML = appState.language === 'bn' ? el.dataset.bn : el.dataset.en;
  });
  document.documentElement.lang = appState.language === 'bn' ? 'bn' : 'en';
  document.querySelector('.language-toggle').innerHTML = appState.language === 'bn' ? 'বাংলা <span>/</span> EN' : 'EN <span>/</span> বাংলা';
  document.querySelector('.language-toggle').setAttribute('aria-label', t('Switch to Bangla', 'ইংরেজিতে বদলান'));
  try { localStorage.setItem('ryntriq-app-language', appState.language); } catch (_) {}
}
try { appState.language = localStorage.getItem('ryntriq-app-language') || 'en'; } catch (_) {}
translate();

function showScreen(name, updateHash = true) {
  appState.screen = name;
  screens.forEach(screen => {
    const active = screen.id === `screen-${name}`;
    screen.hidden = !active;
    screen.classList.toggle('active', active);
  });
  const tabName = name === 'tool' ? 'apps' : name;
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
  document.querySelector('.app-main').scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  if (updateHash) history.replaceState(null, '', name === 'home' ? location.pathname : `#${name}`);
}

tabs.forEach(tab => tab.addEventListener('click', () => showScreen(tab.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.go)));
document.querySelector('.language-toggle').addEventListener('click', () => {
  appState.language = appState.language === 'en' ? 'bn' : 'en';
  translate();
});

function say(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(say.timer);
  say.timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function showService(key) {
  const info = serviceInfo[key];
  const panel = document.getElementById('service-detail');
  panel.innerHTML = `<h3>${info.title[appState.language === 'bn' ? 1 : 0]}</h3><p>${info.body[appState.language === 'bn' ? 1 : 0]}</p><p>${info.points.map(point => `• ${point[appState.language === 'bn' ? 1 : 0]}`).join('<br>')}</p><a href="https://wa.me/8801977835719?text=${encodeURIComponent(t(`Hello RYNTRIQ, I would like to ask about ${info.title[0]}.`, `আসসালামু আলাইকুম RYNTRIQ, ${info.title[1]} নিয়ে কথা বলতে চাই।`))}" target="_blank" rel="noopener">${t('Ask about this service ↗', 'এই সার্ভিস নিয়ে কথা বলুন ↗')}</a>`;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
  showScreen('services');
  showService(button.dataset.service);
}));

const toolTemplates = {
  list: () => `<div class="tool-panel-heading"><span class="tool-logo logo-clean">Aa</span><div><h1 id="tool-title">${t('List Cleaner', 'লিস্ট ক্লিনার')}</h1><p>${t('Remove extra spaces, empty lines and duplicate entries.', 'বাড়তি স্পেস, ফাঁকা লাইন ও ডুপ্লিকেট আইটেম সরান।')}</p></div></div><label for="list-input">${t('Paste your list (one item per line)', 'আপনার লিস্ট পেস্ট করুন (প্রতি লাইনে একটি আইটেম)')}</label><textarea id="list-input" placeholder="${t('Example:\n  RYNTRIQ\n  Website\n  Website', 'উদাহরণ:\n  RYNTRIQ\n  Website\n  Website')}"></textarea><div class="tool-actions"><button type="button" id="clean-list">${t('Clean list', 'লিস্ট পরিষ্কার করুন')}</button><button type="button" id="copy-list" class="secondary-action">${t('Copy result', 'ফল কপি করুন')}</button></div><div class="tool-stats" id="list-stats"></div><div class="tool-output" id="list-output" aria-live="polite">${t('Your cleaned list will appear here.', 'পরিষ্কার করা লিস্ট এখানে দেখা যাবে।')}</div><p class="tool-help">${t('Duplicates are compared without case differences. Your text stays on this device.', 'বড়-ছোট হাতের অক্ষর উপেক্ষা করে ডুপ্লিকেট মেলানো হয়। আপনার লেখা এই ডিভাইসেই থাকে।')}</p>`,
  csv: () => `<div class="tool-panel-heading"><span class="tool-logo logo-csv">▦</span><div><h1 id="tool-title">${t('CSV Cleaner', 'CSV ক্লিনার')}</h1><p>${t('Clean a CSV file locally in your browser.', 'ব্রাউজারেই আপনার CSV ফাইল পরিষ্কার করুন।')}</p></div></div><label for="csv-file">${t('Choose a CSV file', 'CSV ফাইল বাছুন')}</label><input id="csv-file" type="file" accept=".csv,text/csv"><p class="tool-help">${t('Trims spaces, removes blank rows and exact duplicate rows, then prepares a cleaned CSV to download. The file is not uploaded.', 'স্পেস ও ফাঁকা সারি সরিয়ে হুবহু ডুপ্লিকেট সারি বাদ দিয়ে পরিষ্কার CSV ডাউনলোডের জন্য তৈরি করে। ফাইল আপলোড হয় না।')}</p><div class="tool-stats" id="csv-stats"></div><div class="tool-actions"><button type="button" id="download-csv" disabled>${t('Download cleaned CSV', 'পরিষ্কার CSV ডাউনলোড')}</button></div><div class="tool-output" id="csv-output" aria-live="polite">${t('Choose a CSV file to begin.', 'শুরু করতে CSV ফাইল বাছুন।')}</div>`,
  match: () => `<div class="tool-panel-heading"><span class="tool-logo logo-match">⇄</span><div><h1 id="tool-title">${t('List Matcher', 'লিস্ট ম্যাচার')}</h1><p>${t('Compare two lists and find what matches.', 'দুটি লিস্ট তুলনা করে মিলগুলো খুঁজুন।')}</p></div></div><label for="match-left">${t('First list', 'প্রথম লিস্ট')}</label><textarea id="match-left" placeholder="${t('One item per line', 'প্রতি লাইনে একটি আইটেম')}"></textarea><label for="match-right">${t('Second list', 'দ্বিতীয় লিস্ট')}</label><textarea id="match-right" placeholder="${t('One item per line', 'প্রতি লাইনে একটি আইটেম')}"></textarea><div class="tool-actions"><button type="button" id="run-match">${t('Compare lists', 'লিস্ট তুলনা করুন')}</button><button type="button" id="copy-match" class="secondary-action">${t('Copy result', 'ফল কপি করুন')}</button></div><div class="tool-stats" id="match-stats"></div><div class="tool-output" id="match-output" aria-live="polite">${t('Matched items will appear here.', 'মিলে যাওয়া আইটেম এখানে দেখা যাবে।')}</div><p class="tool-help">${t('Comparison ignores letter case and surrounding spaces. All processing stays in this browser.', 'তুলনার সময় বড়-ছোট অক্ষর ও দুই পাশের স্পেস উপেক্ষা করা হয়। সব কাজ এই ব্রাউজারেই হয়।')}</p>`
};

function openTool(name) {
  appState.lastTool = 'apps';
  const content = document.getElementById('tool-content');
  content.innerHTML = toolTemplates[name]();
  showScreen('tool');
  if (name === 'list') setupListTool();
  if (name === 'csv') setupCsvTool();
  if (name === 'match') setupMatchTool();
}
document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => openTool(button.dataset.tool)));
document.querySelector('[data-back]').addEventListener('click', () => showScreen('apps'));

function setStats(el, items) {
  el.innerHTML = items.map(([en, bn]) => `<span>${appState.language === 'bn' ? bn : en}</span>`).join('');
}
async function copyText(text) {
  if (!text) return say(t('Nothing to copy yet.', 'কপি করার মতো ফল নেই।'));
  try { await navigator.clipboard.writeText(text); say(t('Copied to clipboard.', 'কপি হয়েছে।')); }
  catch (_) { say(t('Copy is not available here. Select the result and copy it.', 'এখানে কপি করা যাচ্ছে না। ফল নির্বাচন করে কপি করুন।')); }
}
function setupListTool() {
  let cleaned = '';
  document.getElementById('clean-list').addEventListener('click', () => {
    const raw = document.getElementById('list-input').value.split(/\r?\n/);
    const seen = new Set();
    const result = raw.map(line => line.trim()).filter(line => {
      if (!line) return false;
      const key = line.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    cleaned = result.join('\n');
    document.getElementById('list-output').textContent = cleaned || t('No items found. Paste a list above and try again.', 'কোনো আইটেম পাওয়া যায়নি। উপরে লিস্ট পেস্ট করে আবার চেষ্টা করুন।');
    setStats(document.getElementById('list-stats'), [[`${raw.length} lines received`, `${raw.length}টি লাইন এসেছে`], [`${result.length} kept`, `${result.length}টি রাখা হয়েছে`], [`${raw.filter(x => x.trim()).length - result.length} duplicates removed`, `${raw.filter(x => x.trim()).length - result.length}টি ডুপ্লিকেট সরানো হয়েছে`]]);
  });
  document.getElementById('copy-list').addEventListener('click', () => copyText(cleaned));
}

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell.length === 0) quoted = true;
    else if (ch === ',') { row.push(cell.trim()); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell.length || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows;
}
function stringifyCsv(rows) {
  return rows.map(row => row.map(value => {
    const cell = String(value ?? '').trim();
    return /[",\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
  }).join(',')).join('\r\n');
}
function setupCsvTool() {
  let csvOutput = '';
  const input = document.getElementById('csv-file');
  const download = document.getElementById('download-csv');
  input.addEventListener('change', async () => {
    const file = input.files?.[0]; if (!file) return;
    try {
      const rows = parseCsv((await file.text()).replace(/^\uFEFF/, ''));
      if (!rows.length) throw new Error('empty');
      const header = rows[0];
      const body = rows.slice(1).filter(row => row.some(cell => cell.trim()));
      const seen = new Set(); const unique = body.filter(row => {
        const key = JSON.stringify(row.map(cell => cell.trim().toLocaleLowerCase()));
        if (seen.has(key)) return false; seen.add(key); return true;
      });
      const result = [header, ...unique];
      csvOutput = stringifyCsv(result);
      document.getElementById('csv-output').textContent = t(`Ready: ${unique.length} data rows. Download to save the cleaned file.`, `তৈরি: ${unique.length}টি ডেটা সারি। পরিষ্কার ফাইলটি ডাউনলোড করুন।`);
      setStats(document.getElementById('csv-stats'), [[`${body.length} data rows`, `${body.length}টি ডেটা সারি`], [`${unique.length} kept`, `${unique.length}টি রাখা হয়েছে`], [`${body.length - unique.length} duplicate rows removed`, `${body.length - unique.length}টি ডুপ্লিকেট সরানো হয়েছে`]]);
      download.disabled = false;
    } catch (_) {
      csvOutput = ''; download.disabled = true;
      document.getElementById('csv-output').textContent = t('This file could not be read as CSV. Check the file and try again.', 'ফাইলটি CSV হিসেবে পড়া যাচ্ছে না। ফাইলটি দেখে আবার চেষ্টা করুন।');
    }
  });
  download.addEventListener('click', () => {
    if (!csvOutput) return;
    const blob = new Blob(['\uFEFF', csvOutput], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'ryntriq-cleaned.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say(t('Cleaned CSV downloaded.', 'পরিষ্কার CSV ডাউনলোড হয়েছে।'));
  });
}
function setupMatchTool() {
  let matchOutput = '';
  document.getElementById('run-match').addEventListener('click', () => {
    const left = document.getElementById('match-left').value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const right = document.getElementById('match-right').value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const rightSet = new Set(right.map(x => x.toLocaleLowerCase()));
    const leftSet = new Set(left.map(x => x.toLocaleLowerCase()));
    const matches = [...new Map(left.filter(x => rightSet.has(x.toLocaleLowerCase())).map(x => [x.toLocaleLowerCase(), x])).values()];
    const leftOnly = [...new Map(left.filter(x => !rightSet.has(x.toLocaleLowerCase())).map(x => [x.toLocaleLowerCase(), x])).values()];
    const rightOnly = [...new Map(right.filter(x => !leftSet.has(x.toLocaleLowerCase())).map(x => [x.toLocaleLowerCase(), x])).values()];
    matchOutput = `${t('MATCHED', 'মিলেছে')} (${matches.length})\n${matches.join('\n') || '—'}\n\n${t('ONLY IN FIRST LIST', 'শুধু প্রথম লিস্টে')} (${leftOnly.length})\n${leftOnly.join('\n') || '—'}\n\n${t('ONLY IN SECOND LIST', 'শুধু দ্বিতীয় লিস্টে')} (${rightOnly.length})\n${rightOnly.join('\n') || '—'}`;
    document.getElementById('match-output').textContent = matchOutput;
    setStats(document.getElementById('match-stats'), [[`${matches.length} matched`, `${matches.length}টি মিলেছে`], [`${leftOnly.length} first-only`, `${leftOnly.length}টি শুধু প্রথমে`], [`${rightOnly.length} second-only`, `${rightOnly.length}টি শুধু দ্বিতীয়টিতে`]]);
  });
  document.getElementById('copy-match').addEventListener('click', () => copyText(matchOutput));
}

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
  document.querySelectorAll('.app-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
document.querySelector('.search-launch').addEventListener('click', () => { showScreen('apps'); document.querySelector('[data-filter="all"]').focus(); });
document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); showScreen('apps'); } });

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(() => {}), { once: true });
}
