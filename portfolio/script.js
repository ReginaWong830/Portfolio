const state = { language: 'en', project: 'echo' };
const cursor = document.querySelector('.cursor');
const preview = document.querySelector('.preview-image');
const previewNumber = document.querySelector('.preview-meta b');
const projectRows = [...document.querySelectorAll('.project-row')];
const previewImages = {
  echo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
  abreath: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80',
  mengxi: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80',
  bodhisattva: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  healing: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80',
  pattern: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=900&q=80'
};
const previewAccents = { echo: '#00f060', abreath: '#4d8f73', mengxi: '#f035a5', bodhisattva: '#a8b7ff', healing: '#f239ac', pattern: '#69d4d0' };

function setProject(project) {
  state.project = project;
  const row = projectRows.find(item => item.dataset.project === project);
  const index = projectRows.indexOf(row) + 1;
  preview.style.backgroundImage = `linear-gradient(135deg, ${previewAccents[project]}b8, transparent 48%), url('${previewImages[project]}')`;
  preview.style.setProperty('--project-accent', previewAccents[project]);
  previewNumber.textContent = String(index).padStart(2, '0');
  preview.style.clipPath = 'inset(0 100% 0 0)';
  requestAnimationFrame(() => { preview.style.clipPath = 'inset(0 0 0 0)'; });
}

projectRows.forEach(row => {
  row.addEventListener('mouseenter', () => setProject(row.dataset.project));
  row.addEventListener('focus', () => setProject(row.dataset.project));
  row.addEventListener('mousemove', event => {
    if (window.innerWidth <= 800) return;
    const bounds = row.getBoundingClientRect();
    const shift = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
    preview.style.transform = `translateY(${shift}px) scale(1.01)`;
  });
  row.addEventListener('mouseleave', () => { preview.style.transform = ''; });
});

function updateLanguage(language) {
  state.language = language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.body.classList.add('is-switching');
  document.querySelectorAll('.lang-button').forEach(button => button.classList.toggle('is-active', button.dataset.lang === language));
  window.setTimeout(() => {
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
      const value = element.dataset[language];
      if (value.includes('<br>')) element.innerHTML = value;
      else element.textContent = value;
    });
    document.body.classList.remove('is-switching');
  }, 220);
}

document.querySelectorAll('.lang-button').forEach(button => button.addEventListener('click', () => updateLanguage(button.dataset.lang)));

document.addEventListener('mousemove', event => {
  document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  if (window.innerWidth > 800) {
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

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.scroll-progress').style.width = `${(window.scrollY / scrollable) * 100}%`;
});

const timeline = document.querySelector('.timeline');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: .14 });
observer.observe(timeline);

window.addEventListener('load', () => {
  window.setTimeout(() => document.querySelector('.loading-screen').classList.add('is-done'), 850);
});

// PROJECT IMAGE REPLACE HERE: replace previewImages URLs with files from assets/projects/.
// CV FILE REPLACE HERE: update the # link on .cv-link when a PDF is added to assets/cv/.
