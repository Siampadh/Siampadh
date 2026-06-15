const tabs = document.getElementById('menuTabs');
const weekSelect = document.getElementById('weekSelect');
const calendar = document.getElementById('weeklyCalendar');
const menuTitle = document.getElementById('menuTitle');
const downloadPdf = document.getElementById('downloadPdf');
const openPdf = document.getElementById('openPdf');
const mobileToggle = document.getElementById('mobileToggle');
const mainNav = document.getElementById('mainNav');
const contactForm = document.getElementById('contactForm');

let currentMenu = 0;
let currentWeek = 0;

function renderTabs(){
  tabs.innerHTML = MENU_DATA.map((m, i) => `<button class="tab ${i === currentMenu ? 'active' : ''} ${m.color}" data-index="${i}">${m.label}</button>`).join('');
}

function renderWeeks(){
  const menu = MENU_DATA[currentMenu];
  weekSelect.innerHTML = menu.weeks.map((w, i) => `<option value="${i}">${w.label}</option>`).join('');
  weekSelect.value = currentWeek;
}

function renderCalendar(){
  const menu = MENU_DATA[currentMenu];
  const week = menu.weeks[currentWeek];
  menuTitle.textContent = `${menu.label} · ${week.label}`;
  downloadPdf.href = menu.pdf;
  downloadPdf.setAttribute('download', menu.pdf.split('/').pop());
  openPdf.href = menu.pdf;
  calendar.innerHTML = week.days.map(day => `
    <article class="day-card">
      <h4>${day.day}</h4>
      ${Object.entries(day.items).map(([cat, items]) => `
        <section class="meal-block">
          <strong>${cat}</strong>
          <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
        </section>
      `).join('')}
    </article>
  `).join('');
}

function refresh(){
  renderTabs();
  renderWeeks();
  renderCalendar();
}

tabs.addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if(!btn) return;
  currentMenu = Number(btn.dataset.index);
  currentWeek = 0;
  refresh();
});

weekSelect.addEventListener('change', e => {
  currentWeek = Number(e.target.value);
  renderCalendar();
});

mobileToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();
  const body = `Bonjour,\n\nNom : ${name}\nTéléphone : ${phone || 'Non renseigné'}\nE-mail : ${email || 'Non renseigné'}\n\nMessage :\n${message}\n\nCordialement,\n${name}`;
  window.location.href = `mailto:siampadh77@essaimgatinais.asso.fr?subject=${encodeURIComponent('Site SIAMPADH - ' + subject)}&body=${encodeURIComponent(body)}`;
});

refresh();


// AJOUT UNIQUEMENT : ouverture / fermeture de la fenêtre Notre équipe
const teamModal = document.getElementById('teamModal');
const teamButtons = [
  document.getElementById('openTeamNav'),
  document.getElementById('openTeamHero'),
  document.getElementById('openTeamSection')
].filter(Boolean);
function openTeam(){
  if(!teamModal) return;
  teamModal.classList.add('open');
  teamModal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(mainNav) mainNav.classList.remove('open');
}
function closeTeam(){
  if(!teamModal) return;
  teamModal.classList.remove('open');
  teamModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
teamButtons.forEach(btn => btn.addEventListener('click', openTeam));
document.querySelectorAll('[data-close-team]').forEach(el => el.addEventListener('click', closeTeam));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeTeam(); });

// AJOUT : équipe modifiable avec accès administrateur (stockage local dans le navigateur)
const TEAM_PASSWORD = 'gobelets';
const TEAM_STORAGE_KEY = 'siampadhEquipeDataV1';
const defaultTeamData = (window.TEAM_DATA && Array.isArray(window.TEAM_DATA)) ? window.TEAM_DATA : [
  {group:'Les petits mots des intervenants', type:'intervenante', name:'Intervenante 1', role:'Aide au quotidien', initial:'1', photo:'', text:'J’accompagne les bénéficiaires dans les actes essentiels de la vie quotidienne : aide au lever, au coucher, à l’habillage, aux repas et présence rassurante.'},
  {group:'Les petits mots des intervenants', type:'intervenante', name:'Intervenante 2', role:'Entretien du domicile', initial:'2', photo:'', text:'J’interviens pour l’entretien courant du logement, le linge, le repassage et les petites tâches quotidiennes afin de préserver un cadre de vie agréable.'},
  {group:'Les petits mots des intervenants', type:'intervenante', name:'Intervenante 3', role:'Accompagnement extérieur', initial:'3', photo:'', text:'J’accompagne les bénéficiaires aux courses, aux rendez-vous, en promenade ou lors de sorties pour maintenir l’autonomie et le lien social.'},
  {group:'Les petits mots des intervenants', type:'intervenante', name:'Intervenante 4', role:'Portage de repas et vigilance', initial:'4', photo:'', text:'Je participe au bien-être des bénéficiaires avec une attention particulière lors des passages à domicile, notamment autour des repas et des besoins du quotidien.'},
  {group:'Équipe du bureau', type:'bureau', name:'Sophie Leudière', role:'Directrice', initial:'D', photo:'', text:'Je veille au bon fonctionnement du SIAMPADH, au suivi de la qualité des prestations et à l’écoute des bénéficiaires, des familles et des professionnels.'},
  {group:'Équipe du bureau', type:'bureau', name:'Eddy Lila', role:'Responsable de secteur', initial:'R', photo:'', text:'J’organise les plannings, je coordonne les interventions à domicile, je suis les besoins des bénéficiaires et j’accompagne les équipes terrain.'},
  {group:'Présidence de l’association', type:'president', name:'Pierre Bacqué', role:'Président de l’association', initial:'P', photo:'', text:'J’accompagne les orientations de l’association Essaim Gâtinais et je veille aux valeurs de respect, de solidarité, de dignité et d’équité.'}
];

const teamPublicContent = document.getElementById('teamPublicContent');
const teamInlinePublic = document.getElementById('teamInlinePublic');
const openTeamAdmin = document.getElementById('openTeamAdmin');
const teamAdminPanel = document.getElementById('teamAdminPanel');
const adminLoginBox = document.getElementById('adminLoginBox');
const teamPassword = document.getElementById('teamPassword');
const teamLoginBtn = document.getElementById('teamLoginBtn');
const teamLoginError = document.getElementById('teamLoginError');
const teamEditForm = document.getElementById('teamEditForm');
const teamEditorList = document.getElementById('teamEditorList');
const teamSaveMessage = document.getElementById('teamSaveMessage');
const resetTeamBtn = document.getElementById('resetTeamBtn');
let teamData = loadTeamData();

function loadTeamData(){
  return JSON.parse(JSON.stringify(defaultTeamData));
}
function saveTeamData(){
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
}
function photoOrInitial(person){
  return person.photo ? `<img class="photo-avatar" src="${person.photo}" alt="Photo de ${person.name}">` : `<div class="avatar">${person.initial || person.name.charAt(0)}</div>`;
}
function buildTeamPublicHtml(){
  const groups = [...new Set(teamData.map(p => p.group))];
  return groups.map(group => {
    const people = teamData.filter(p => p.group === group);
    const displayGroup = group === '4 intervenantes à domicile' ? 'Les petits mots des intervenants' : group;
    const cls = (group.includes('intervenantes') || group.includes('petits mots')) ? 'four' : (group.includes('bureau') ? 'two' : 'one');
    const cards = people.map(p => `
      <article class="team-person ${p.type === 'bureau' || p.type === 'president' ? 'strong' : ''}">
        ${photoOrInitial(p)}
        <span class="team-role">${p.role}</span>
        <h4>${p.name}</h4>
        <p>${p.text}</p>
      </article>
    `).join('');
    return `<div class="team-zone ${people[0]?.type || ''}"><h3>${displayGroup}</h3><div class="team-grid ${cls}">${cards}</div></div>`;
  }).join('');
}
function renderTeamPublic(){
  const html = buildTeamPublicHtml();
  if(teamPublicContent) teamPublicContent.innerHTML = html;
  if(teamInlinePublic) teamInlinePublic.innerHTML = html;
}
function renderTeamEditor(){
  if(!teamEditorList) return;
  teamEditorList.innerHTML = teamData.map((p, index) => `
    <article class="editor-card" data-index="${index}">
      <div class="editor-photo-box">
        <div class="editor-preview" id="preview-${index}">${p.photo ? `<img src="${p.photo}" alt="Photo">` : (p.initial || index + 1)}</div>
        <label>Photo de profil
          <input type="file" accept="image/*" data-field="photo" data-index="${index}">
        </label>
      </div>
      <div>
        <label>Nom
          <input value="${escapeAttr(p.name)}" data-field="name" data-index="${index}">
        </label>
        <label>Poste / rôle
          <input value="${escapeAttr(p.role)}" data-field="role" data-index="${index}">
        </label>
        <label>Mot à afficher
          <textarea data-field="text" data-index="${index}">${escapeHtml(p.text)}</textarea>
        </label>
      </div>
    </article>
  `).join('');
}
function escapeHtml(str){return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
function escapeAttr(str){return escapeHtml(str).replaceAll('"','&quot;');}

openTeamAdmin?.addEventListener('click', () => {
  teamAdminPanel.hidden = !teamAdminPanel.hidden;
  teamLoginError.textContent = '';
});
teamLoginBtn?.addEventListener('click', () => {
  if(teamPassword.value.trim() === TEAM_PASSWORD){
    teamPassword.value = '';
    adminLoginBox.hidden = true;
    teamEditForm.hidden = false;
    renderTeamEditor();
  }else{
    teamLoginError.textContent = 'Mot de passe incorrect.';
  }
});
teamPassword?.addEventListener('keydown', e => { if(e.key === 'Enter') teamLoginBtn.click(); });
teamEditorList?.addEventListener('input', e => {
  const field = e.target.dataset.field;
  const index = Number(e.target.dataset.index);
  if(!field || Number.isNaN(index) || field === 'photo') return;
  teamData[index][field] = e.target.value;
});
teamEditorList?.addEventListener('change', e => {
  if(e.target.dataset.field !== 'photo') return;
  const index = Number(e.target.dataset.index);
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    teamData[index].photo = reader.result;
    const preview = document.getElementById(`preview-${index}`);
    if(preview) preview.innerHTML = `<img src="${reader.result}" alt="Photo">`;
  };
  reader.readAsDataURL(file);
});
teamEditForm?.addEventListener('submit', e => {
  e.preventDefault();
  saveTeamData();
  renderTeamPublic();
  teamSaveMessage.textContent = 'Modifications enregistrées. Elles restent visibles sur cet ordinateur / navigateur.';
  setTimeout(() => teamSaveMessage.textContent = '', 3500);
});
resetTeamBtn?.addEventListener('click', () => {
  if(!confirm('Réinitialiser les textes et photos de l’équipe ?')) return;
  localStorage.removeItem(TEAM_STORAGE_KEY);
  teamData = JSON.parse(JSON.stringify(defaultTeamData));
  renderTeamPublic();
  renderTeamEditor();
});

renderTeamPublic();

// AJOUT SIMPLE : panneau direct dans la page pour modifier les 7 photos de profil + textes
const openTeamEditDirect = document.getElementById('openTeamEditDirect');
const teamEditDirect = document.getElementById('teamEditDirect');
const directLoginBox = document.getElementById('directLoginBox');
const directPassword = document.getElementById('directPassword');
const directLoginBtn = document.getElementById('directLoginBtn');
const directLoginError = document.getElementById('directLoginError');
const directTeamEditForm = document.getElementById('directTeamEditForm');
const directTeamEditorList = document.getElementById('directTeamEditorList');
const directTeamSaveMessage = document.getElementById('directTeamSaveMessage');
const directResetTeamBtn = document.getElementById('directResetTeamBtn');

function renderDirectTeamEditor(){
  if(!directTeamEditorList) return;
  directTeamEditorList.innerHTML = teamData.map((p, index) => `
    <article class="editor-card photo-card-big" data-index="${index}">
      <div class="editor-photo-box">
        <div class="editor-preview big-preview" id="direct-preview-${index}">${p.photo ? `<img src="${p.photo}" alt="Photo">` : `<span>${p.initial || index + 1}</span>`}</div>
        <label class="photo-upload-label">📸 Ajouter / changer la photo
          <input type="file" accept="image/*" data-field="photo" data-index="${index}">
        </label>
      </div>
      <div class="editor-fields">
        <p class="editor-person-type">${p.group}</p>
        <label>Nom
          <input value="${escapeAttr(p.name)}" data-field="name" data-index="${index}">
        </label>
        <label>Fonction
          <input value="${escapeAttr(p.role)}" data-field="role" data-index="${index}">
        </label>
        <label>Mot de présentation
          <textarea rows="5" data-field="text" data-index="${index}">${escapeHtml(p.text)}</textarea>
        </label>
      </div>
    </article>
  `).join('');
}

openTeamEditDirect?.addEventListener('click', () => {
  teamEditDirect.hidden = !teamEditDirect.hidden;
  if(!teamEditDirect.hidden){
    teamEditDirect.scrollIntoView({behavior:'smooth', block:'start'});
  }
});

directLoginBtn?.addEventListener('click', () => {
  if(directPassword.value.trim() === TEAM_PASSWORD){
    directPassword.value = '';
    directLoginBox.hidden = true;
    directTeamEditForm.hidden = false;
    renderDirectTeamEditor();
  }else{
    directLoginError.textContent = 'Mot de passe incorrect.';
  }
});

directPassword?.addEventListener('keydown', e => { if(e.key === 'Enter') directLoginBtn.click(); });

directTeamEditorList?.addEventListener('input', e => {
  const field = e.target.dataset.field;
  const index = Number(e.target.dataset.index);
  if(!field || Number.isNaN(index) || field === 'photo') return;
  teamData[index][field] = e.target.value;
});

directTeamEditorList?.addEventListener('change', e => {
  if(e.target.dataset.field !== 'photo') return;
  const index = Number(e.target.dataset.index);
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    teamData[index].photo = reader.result;
    const preview = document.getElementById(`direct-preview-${index}`);
    if(preview) preview.innerHTML = `<img src="${reader.result}" alt="Photo">`;
  };
  reader.readAsDataURL(file);
});

directTeamEditForm?.addEventListener('submit', e => {
  e.preventDefault();
  saveTeamData();
  renderTeamPublic();
  renderDirectTeamEditor();
  directTeamSaveMessage.textContent = 'Enregistré ✅ Les photos et les textes apparaissent dans la présentation équipe.';
  setTimeout(() => directTeamSaveMessage.textContent = '', 4500);
});

directResetTeamBtn?.addEventListener('click', () => {
  if(!confirm('Réinitialiser les photos et textes de l’équipe ?')) return;
  localStorage.removeItem(TEAM_STORAGE_KEY);
  teamData = JSON.parse(JSON.stringify(defaultTeamData));
  renderTeamPublic();
  renderDirectTeamEditor();
});

// AJOUT : page Actualités visible par tous + modification avec mot de passe
const NEWS_STORAGE_KEY = 'siampadhActualitesV1';
const defaultNewsData = (window.NEWS_DATA && Array.isArray(window.NEWS_DATA)) ? window.NEWS_DATA : [
  {
    title: 'Bienvenue sur les actualités du SIAMPADH',
    date: '',
    text: 'Cette page permet de partager les informations importantes, les événements, les sorties et les moments de vie de l’association.',
    photo: ''
  }
];
let newsData = loadNewsData();
let editingNewsIndex = null;
let pendingNewsPhoto = '';

const openNewsAdmin = document.getElementById('openNewsAdmin');
const newsAdminPanel = document.getElementById('newsAdminPanel');
const newsLoginBox = document.getElementById('newsLoginBox');
const newsPassword = document.getElementById('newsPassword');
const newsLoginBtn = document.getElementById('newsLoginBtn');
const newsLoginError = document.getElementById('newsLoginError');
const newsEditorBox = document.getElementById('newsEditorBox');
const closeNewsAdmin = document.getElementById('closeNewsAdmin');
const newsForm = document.getElementById('newsForm');
const newsPublicList = document.getElementById('newsPublicList');
const newsManageList = document.getElementById('newsManageList');
const newsPhotoInput = document.getElementById('newsPhotoInput');
const newsPhotoPreview = document.getElementById('newsPhotoPreview');
const newsTitleInput = document.getElementById('newsTitleInput');
const newsDateInput = document.getElementById('newsDateInput');
const newsTextInput = document.getElementById('newsTextInput');
const cancelNewsEdit = document.getElementById('cancelNewsEdit');
const newsSaveMessage = document.getElementById('newsSaveMessage');

function loadNewsData(){
  return JSON.parse(JSON.stringify(defaultNewsData));
}
function saveNewsData(){
  try{
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(newsData));
    return true;
  }catch(e){
    alert('Impossible d’enregistrer : la photo est sûrement trop lourde. Essayez avec une photo plus petite.');
    return false;
  }
}
function resizeImageForStorage(file, callback){
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const maxW = 1100;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function formatNewsDate(value){
  if(!value) return 'Actualité SIAMPADH';
  const parts = value.split('-');
  if(parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
function renderNewsPublic(){
  if(!newsPublicList) return;
  if(!newsData.length){
    newsPublicList.innerHTML = `<article class="news-card empty"><h3>Aucune actualité pour le moment</h3><p>Les prochaines informations du SIAMPADH apparaîtront ici.</p></article>`;
    return;
  }
  newsPublicList.innerHTML = newsData.map((n, i) => `
    <article class="news-card">
      <div class="news-photo">${n.photo ? `<img src="${n.photo}" alt="Photo actualité ${escapeAttr(n.title)}">` : `<span>📰</span>`}</div>
      <div class="news-body">
        <p class="news-date">${formatNewsDate(n.date)}</p>
        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.text).replaceAll('\n','<br>')}</p>
      </div>
    </article>
  `).join('');
}
function renderNewsManage(){
  if(!newsManageList) return;
  newsManageList.innerHTML = newsData.map((n, i) => `
    <article class="news-manage-card">
      <div class="news-manage-thumb">${n.photo ? `<img src="${n.photo}" alt="Photo">` : '📰'}</div>
      <div>
        <strong>${escapeHtml(n.title)}</strong>
        <p>${formatNewsDate(n.date)}</p>
      </div>
      <div class="news-manage-actions">
        <button class="mini-btn" type="button" data-news-edit="${i}">Modifier</button>
        <button class="mini-btn danger" type="button" data-news-delete="${i}">Supprimer</button>
      </div>
    </article>
  `).join('');
}
function resetNewsForm(){
  editingNewsIndex = null;
  pendingNewsPhoto = '';
  if(newsForm) newsForm.reset();
  if(newsPhotoPreview) newsPhotoPreview.innerHTML = '📸';
  if(cancelNewsEdit) cancelNewsEdit.hidden = true;
  if(newsSaveMessage) newsSaveMessage.textContent = '';
}
function fillNewsForm(index){
  const n = newsData[index];
  editingNewsIndex = index;
  pendingNewsPhoto = n.photo || '';
  newsTitleInput.value = n.title || '';
  newsDateInput.value = n.date || '';
  newsTextInput.value = n.text || '';
  newsPhotoPreview.innerHTML = pendingNewsPhoto ? `<img src="${pendingNewsPhoto}" alt="Photo actualité">` : '📸';
  cancelNewsEdit.hidden = false;
  newsForm.scrollIntoView({behavior:'smooth', block:'center'});
}

openNewsAdmin?.addEventListener('click', () => {
  newsAdminPanel.hidden = !newsAdminPanel.hidden;
  if(!newsAdminPanel.hidden){
    newsAdminPanel.scrollIntoView({behavior:'smooth', block:'start'});
  }
});
newsLoginBtn?.addEventListener('click', () => {
  if(newsPassword.value.trim() === TEAM_PASSWORD){
    newsPassword.value = '';
    newsLoginBox.hidden = true;
    newsEditorBox.hidden = false;
    newsLoginError.textContent = '';
    renderNewsManage();
  }else{
    newsLoginError.textContent = 'Mot de passe incorrect.';
  }
});
newsPassword?.addEventListener('keydown', e => { if(e.key === 'Enter') newsLoginBtn.click(); });
closeNewsAdmin?.addEventListener('click', () => { newsAdminPanel.hidden = true; resetNewsForm(); });

newsPhotoInput?.addEventListener('change', e => {
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  newsPhotoPreview.innerHTML = 'Chargement...';
  resizeImageForStorage(file, dataUrl => {
    pendingNewsPhoto = dataUrl;
    newsPhotoPreview.innerHTML = `<img src="${dataUrl}" alt="Photo actualité">`;
  });
});

newsForm?.addEventListener('submit', e => {
  e.preventDefault();
  const item = {
    title: newsTitleInput.value.trim(),
    date: newsDateInput.value,
    text: newsTextInput.value.trim(),
    photo: pendingNewsPhoto
  };
  if(editingNewsIndex === null){
    newsData.unshift(item);
  }else{
    newsData[editingNewsIndex] = item;
  }
  if(!saveNewsData()) return;
  renderNewsPublic();
  renderNewsManage();
  resetNewsForm();
  newsSaveMessage.textContent = 'Actualité enregistrée ✅ Elle reste visible même après actualisation de la page.';
  setTimeout(() => newsSaveMessage.textContent = '', 5000);
});

cancelNewsEdit?.addEventListener('click', resetNewsForm);
newsManageList?.addEventListener('click', e => {
  const editBtn = e.target.closest('[data-news-edit]');
  const deleteBtn = e.target.closest('[data-news-delete]');
  if(editBtn){
    fillNewsForm(Number(editBtn.dataset.newsEdit));
  }
  if(deleteBtn){
    const index = Number(deleteBtn.dataset.newsDelete);
    if(confirm('Supprimer cette actualité ?')){
      newsData.splice(index, 1);
      if(!saveNewsData()) return;
      renderNewsPublic();
      renderNewsManage();
      resetNewsForm();
    }
  }
});

renderNewsPublic();

// Lecture audio du livret d'accueil (Web Speech API)
const listenLivretBtn = document.getElementById('listenLivret');
const pauseLivretBtn = document.getElementById('pauseLivret');
const resumeLivretBtn = document.getElementById('resumeLivret');
const stopLivretBtn = document.getElementById('stopLivret');
const livretStatus = document.getElementById('livretStatus');
let livretUtterance = null;
let livretChunks = [];
let livretChunkIndex = 0;

function setLivretStatus(message){
  if(livretStatus) livretStatus.textContent = message;
}

function splitLivretText(text){
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if(!clean) return [];
  const parts = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const chunks = [];
  let current = '';
  parts.forEach(part => {
    const next = (current + ' ' + part).trim();
    if(next.length > 900){
      if(current) chunks.push(current.trim());
      current = part.trim();
    } else {
      current = next;
    }
  });
  if(current) chunks.push(current.trim());
  return chunks;
}

function speakLivretChunk(){
  if(!('speechSynthesis' in window)){
    setLivretStatus('La lecture audio n’est pas disponible sur ce navigateur.');
    return;
  }
  if(livretChunkIndex >= livretChunks.length){
    setLivretStatus('Lecture terminée.');
    livretUtterance = null;
    return;
  }
  livretUtterance = new SpeechSynthesisUtterance(livretChunks[livretChunkIndex]);
  livretUtterance.lang = 'fr-FR';
  livretUtterance.rate = 0.92;
  livretUtterance.pitch = 1;
  livretUtterance.onend = () => {
    livretChunkIndex += 1;
    speakLivretChunk();
  };
  livretUtterance.onerror = () => setLivretStatus('La lecture audio a été interrompue.');
  setLivretStatus(`Lecture du livret en cours... partie ${livretChunkIndex + 1} / ${livretChunks.length}`);
  window.speechSynthesis.speak(livretUtterance);
}

if(listenLivretBtn){
  listenLivretBtn.addEventListener('click', () => {
    if(!('speechSynthesis' in window)){
      setLivretStatus('La lecture audio n’est pas disponible sur ce navigateur.');
      return;
    }
    window.speechSynthesis.cancel();
    livretChunks = splitLivretText(typeof LIVRET_TEXT !== 'undefined' ? LIVRET_TEXT : '');
    livretChunkIndex = 0;
    if(!livretChunks.length){
      setLivretStatus('Aucun texte disponible à lire.');
      return;
    }
    speakLivretChunk();
  });
}
if(pauseLivretBtn){
  pauseLivretBtn.addEventListener('click', () => {
    if('speechSynthesis' in window){
      window.speechSynthesis.pause();
      setLivretStatus('Lecture en pause.');
    }
  });
}
if(resumeLivretBtn){
  resumeLivretBtn.addEventListener('click', () => {
    if('speechSynthesis' in window){
      window.speechSynthesis.resume();
      setLivretStatus('Lecture reprise.');
    }
  });
}
if(stopLivretBtn){
  stopLivretBtn.addEventListener('click', () => {
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      livretUtterance = null;
      livretChunkIndex = 0;
      setLivretStatus('Lecture arrêtée.');
    }
  });
}
