const projects = [
  { id: 'echo', title: 'ECHO CHAMBER ARCHIVE', subtitle: '回声室档案', year: '2025—2026', accent: '#00f060', image: 'assets/projects/echo/cover.svg', tags: 'Information Visualization / Interactive Media / TouchDesigner' },
  { id: 'abreath', title: 'ABREATH', subtitle: '一息 · 永春', year: '2025', accent: '#4d8f73', image: 'assets/projects/abreath/cover.svg', tags: 'Brand Identity / Packaging / Visual Identity' },
  { id: 'mengxi', title: 'MENGXI BITAN', subtitle: '梦溪笔谈', year: '2025', accent: '#f035a5', image: 'assets/projects/mengxi/cover.svg', tags: 'Information Visualization / Editorial Design' },
  { id: 'bodhisattva', title: 'DIGITAL BODHISATTVA', subtitle: '数字观音', year: '2024', accent: '#a8b7ff', image: 'assets/projects/bodhisattva/cover.svg', tags: 'Digital Art / Editorial Design' },
  { id: 'healing', title: 'HEALING TRANSFORMATION', subtitle: '重塑疗愈手册', year: '2024', accent: '#f239ac', image: 'assets/projects/healing/cover.svg', tags: 'Information Visualization / Illustration' },
  { id: 'pattern', title: 'CULTURAL PATTERN', subtitle: '文化纹样', year: '2024', accent: '#69d4d0', image: 'assets/projects/pattern/cover.svg', tags: 'Cultural Design / Pattern Design / Merchandise' }
];
const state = { language: localStorage.getItem('portfolio-language') || 'en', project: 'echo' };
const cursor = document.querySelector('.cursor');
const preview = document.querySelector('.preview-image');
const previewNumber = document.querySelector('.preview-meta b');
const projectRows = [...document.querySelectorAll('.project-row')];
const projectDetail = document.querySelector('#project-detail');
const finePointer = window.matchMedia('(pointer: fine) and (min-width: 801px)');
const roleTranslations = { 'New Media Operations Intern': '新媒体运营实习生' };
let languageTimer;

function setProject(project) {
  state.project = project;
  const item = projects.find(entry => entry.id === project);
  const index = projects.indexOf(item) + 1;
  preview.src = item.image;
  preview.alt = `${item.title} / ${item.subtitle}`;
  preview.style.setProperty('--project-accent', item.accent);
  previewNumber.textContent = String(index).padStart(2, '0');
  preview.style.clipPath = 'inset(0 100% 0 0)';
  requestAnimationFrame(() => { preview.style.clipPath = 'inset(0 0 0 0)'; });
}

projectRows.forEach(row => {
  row.addEventListener('mouseenter', () => setProject(row.dataset.project));
  row.addEventListener('focus', () => setProject(row.dataset.project));
  row.addEventListener('click', event => { event.preventDefault(); openProject(row.dataset.project); });
  row.addEventListener('mousemove', event => {
    if (!finePointer.matches) return;
    const bounds = row.getBoundingClientRect();
    const shift = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
    preview.style.transform = `translateY(${shift}px) scale(1.01)`;
  });
  row.addEventListener('mouseleave', () => { preview.style.transform = ''; });
});

function updateDetail(projectId) {
  const item = projects.find(entry => entry.id === projectId) || projects[0];
  const index = projects.indexOf(item);
  state.project = item.id;
  document.querySelector('.detail-index b').textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#detail-title').textContent = item.title;
  document.querySelector('#detail-subtitle').textContent = item.subtitle;
  document.querySelector('#detail-year').textContent = item.year;
  document.querySelector('#detail-tools').textContent = item.tags;
  document.querySelector('#detail-role').textContent = state.language === 'zh' ? '待补充' : 'To be confirmed';
  const detailImage = document.querySelector('#detail-image');
  detailImage.src = item.image;
  detailImage.alt = `${item.title} / ${item.subtitle}`;
  document.querySelector('#previous-project strong').textContent = projects[(index - 1 + projects.length) % projects.length].title;
  document.querySelector('#next-project strong').textContent = projects[(index + 1) % projects.length].title;
  document.querySelector('#previous-project').dataset.project = projects[(index - 1 + projects.length) % projects.length].id;
  document.querySelector('#next-project').dataset.project = projects[(index + 1) % projects.length].id;
}

function openProject(projectId) {
  updateDetail(projectId);
  projectDetail.hidden = false;
  document.body.classList.add('detail-open');
  history.pushState({ project: projectId }, '', `#project-detail-${projectId}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeProject() {
  projectDetail.hidden = true;
  document.body.classList.remove('detail-open');
  history.pushState({}, '', '#work');
}

document.querySelector('.back-to-works').addEventListener('click', event => { event.preventDefault(); closeProject(); });
document.querySelectorAll('.detail-navigation a').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openProject(link.dataset.project); }));
window.addEventListener('popstate', () => { if (!location.hash.startsWith('#project-detail-')) closeProject(); });

function updateLanguage(language) {
  state.language = language;
  localStorage.setItem('portfolio-language', language);
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.body.classList.add('is-switching');
  document.querySelectorAll('.lang-button').forEach(button => {
    const active = button.dataset.lang === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  window.clearTimeout(languageTimer);
  languageTimer = window.setTimeout(() => {
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
      const value = element.dataset[language];
      if (value.includes('<br>')) element.innerHTML = value;
      else element.textContent = value;
    });
    document.querySelectorAll('.timeline-item .role').forEach(role => {
      const englishRole = role.dataset.en || role.textContent;
      role.dataset.en = englishRole;
      role.textContent = language === 'zh' ? (roleTranslations[englishRole] || englishRole) : englishRole;
    });
    updateDetail(state.project);
    document.body.classList.remove('is-switching');
  }, 220);
}

document.querySelectorAll('.lang-button').forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));

document.addEventListener('mousemove', event => {
  document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  if (finePointer.matches) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }
});

document.querySelectorAll('a, button').forEach(element => {
  element.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
  element.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
});
projectRows.forEach(row => {
  row.addEventListener('mouseenter', () => cursor.classList.add('is-view'));
  row.addEventListener('mouseleave', () => cursor.classList.remove('is-view'));
});

let scrollFrame;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('.scroll-progress').style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
    scrollFrame = null;
  });
}, { passive: true });

const timeline = document.querySelector('.timeline');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: .14 });
observer.observe(timeline);

function initializeCursor() {
  if (!finePointer.matches || !cursor) return;
  document.body.classList.add('cursor-ready');
}

initializeCursor();
finePointer.addEventListener('change', initializeCursor);
updateLanguage(state.language);
setProject('echo');
const initialProject = location.hash.match(/^#project-detail-(.+)$/)?.[1];
if (projects.some(project => project.id === initialProject)) openProject(initialProject);

window.addEventListener('load', () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) loadingScreen.classList.add('is-done');
  else requestAnimationFrame(() => loadingScreen.classList.add('is-done'));
  const loadedProject = location.hash.match(/^#project-detail-(.+)$/)?.[1];
  if (projects.some(project => project.id === loadedProject) && projectDetail.hidden) openProject(loadedProject);
});
