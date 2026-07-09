document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  setupUI();
  applyFilters();
});

let currentEditingId = null;

function setupUI() {
  document.getElementById('trip-title').textContent = window.TRIP_CONFIG.title;
  
  // Storage actions
  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('btn-clear').addEventListener('click', clearLocalData);
  const importInput = document.getElementById('input-import');
  document.getElementById('btn-import').addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', importData);
  
  const btnPdf = document.getElementById('btn-pdf');
  if(btnPdf) btnPdf.addEventListener('click', () => window.print());

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`view-${btn.dataset.target}`).classList.add('active');
      
      if (btn.dataset.target === 'kanban') {
        renderKanban(filteredData);
      }
    });
  });

  // Filters populate
  const cities = new Set();
  const categories = new Set();
  itemsData.forEach(p => {
    if (p.city) cities.add(p.city);
    if (p.cidade) cities.add(p.cidade);
    getCategories(p).forEach(c => categories.add(c));
  });

  const citySelect = document.getElementById('filter-cidade');
  [...cities].sort().forEach(c => {
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c; citySelect.appendChild(opt);
  });
  
  const catSelect = document.getElementById('filter-categoria');
  [...categories].sort().forEach(c => {
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c; catSelect.appendChild(opt);
  });

  // Filter events
  document.querySelectorAll('.control input, .control select').forEach(el => {
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  // Modal events
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('btn-save').addEventListener('click', saveModal);
  
  const btnNewItem = document.getElementById('btn-new-item');
  if (btnNewItem) btnNewItem.addEventListener('click', createNewItemPrompt);
  
  // Close modal when clicking outside
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
  });
}

let filteredData = [];

function applyFilters() {
  const search = document.getElementById('search').value.toLowerCase().trim();
  const city = document.getElementById('filter-cidade').value;
  const category = document.getElementById('filter-categoria').value;
  const price = document.getElementById('filter-price').value;
  const prime = document.getElementById('filter-prime').value;
  const date = document.getElementById('filter-date').value;
  const status = document.getElementById('filter-status').value;
  const fav = document.getElementById('filter-fav').value;

  filteredData = itemsData.filter(p => {
    const name = (p.name || p.nome || '').toLowerCase();
    if (search && !name.includes(search)) return false;
    
    const pCity = p.city || p.cidade;
    if (city && pCity !== city) return false;
    
    const pCats = getCategories(p);
    if (category && !pCats.includes(category)) return false;

    if (date && p.plannedDate !== date) return false;
    if (status && p.status !== status) return false;
    if (fav === 'sim' && !p.favorite) return false;
    if (fav === 'nao' && p.favorite) return false;

    const pPrime = (p.prime_gourmet || 'não').toLowerCase();
    if (prime && pPrime !== prime) return false;

    if (price) {
      const val = getPrice(p);
      if (price === 'free' && val !== 0 && val !== '0') return false;
      // Cumulativo
      if (price === '50' && (val === null || val > 50)) return false;
      if (price === '100' && (val === null || val > 100)) return false;
      if (price === '200' && (val === null || val > 200)) return false;
      if (price === '200+' && (val !== null && val <= 200)) return false;
    }

    return true;
  });

  document.getElementById('count').textContent = `${filteredData.length} passeios listados`;

  renderGrid(filteredData);
  renderByDate(filteredData);
  if (document.querySelector('.tab-btn[data-target="kanban"]').classList.contains('active')) {
    renderKanban(filteredData);
  }
}

function renderGrid(list) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';
  
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openModal(p.id);
    
    const images = getImages(p);
    const imgUrl = images.length ? (images[0].startsWith('http') ? images[0] : `imagens/${images[0]}`) : '';
    
    const primeHtml = p.prime_gourmet && p.prime_gourmet !== 'não' 
      ? `<span class="prime">Prime: ${p.prime_gourmet}</span>` : '';
      
    const favHtml = p.favorite ? `<div class="fav-icon">★</div>` : '';

    const formattedPrice = formatMoney(getPrice(p));
    
    card.innerHTML = `
      ${favHtml}
      <div class="photo">
        <img src="${imgUrl}" alt="${p.name || p.nome}" onerror="handleImageError(this)">
      </div>
      <div class="content">
        <h3 class="title">${p.name || p.nome}</h3>
        <div class="sub">${p.city || p.cidade}</div>
        <div class="chips">
          <span class="chip status ${p.status}">${p.status.replace('_', ' ')}</span>
          ${getCategories(p).map(c => `<span class="chip">${c}</span>`).join('')}
        </div>
        <div class="row" style="margin-top:auto; padding-top:10px;">
          <span class="price">${formattedPrice}</span>
          ${primeHtml}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderByDate(list) {
  const container = document.getElementById('date-container');
  container.innerHTML = '';

  const groups = {};
  list.forEach(p => {
    const d = p.plannedDate || 'Sem data definida';
    if (!groups[d]) groups[d] = [];
    groups[d].push(p);
  });

  const sortedDates = Object.keys(groups).sort((a, b) => {
    if (a === 'Sem data definida') return -1;
    if (b === 'Sem data definida') return 1;
    // Basic string sort works for DD/MM if they are same month, otherwise custom parse needed.
    // Assuming DD/MM format
    const [d1, m1] = a.split('/');
    const [d2, m2] = b.split('/');
    if (m1 !== m2) return m1 - m2;
    return d1 - d2;
  });

  sortedDates.forEach(date => {
    const items = groups[date];
    // Sort by time within date
    items.sort((a, b) => {
      const t1 = a.plannedTime || '24:00';
      const t2 = b.plannedTime || '24:00';
      return t1.localeCompare(t2);
    });

    let total = 0;
    items.forEach(i => {
      const v = getPrice(i);
      if (v) total += parseFloat(v);
    });

    const gDiv = document.createElement('div');
    gDiv.className = 'date-group';
    
    gDiv.innerHTML = `
      <div class="date-header">
        <h2>${date}</h2>
        <div class="date-stats">
          ${items.length} itens • Estimado: ${formatMoney(total)}
        </div>
      </div>
      <div class="date-list">
        ${items.map(p => {
          const images = getImages(p);
          const imgUrl = images.length ? (images[0].startsWith('http') ? images[0] : `imagens/${images[0]}`) : '';
          return `
            <div class="list-item" onclick="openModal(${p.id})">
              <img src="${imgUrl}" onerror="handleImageError(this)">
              <div class="list-time">${p.plannedTime || '--:--'}</div>
              <div class="list-info">
                <h4>${p.name || p.nome}</h4>
                <p>${p.city || p.cidade} • <span class="chip status ${p.status}" style="font-size:10px; padding:2px 4px;">${p.status.replace('_', ' ')}</span></p>
              </div>
              <div class="list-price">${formatMoney(getPrice(p))}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    container.appendChild(gDiv);
  });
}

function renderKanban(list) {
  const container = document.getElementById('kanban-container');
  container.innerHTML = '';
  
  const cols = ['Sem data definida', ...window.TRIP_CONFIG.dates];
  
  cols.forEach(colDate => {
    const colDiv = document.createElement('div');
    colDiv.className = 'kanban-col';
    
    let items = list.filter(p => (p.plannedDate || 'Sem data definida') === colDate);
    // Sort by kanban order
    items.sort((a, b) => (a.kanbanOrder || 0) - (b.kanbanOrder || 0));

    colDiv.innerHTML = `
      <div class="kanban-header">${colDate}</div>
      <div class="kanban-cards" data-date="${colDate === 'Sem data definida' ? '' : colDate}">
      </div>
    `;
    
    const cardsContainer = colDiv.querySelector('.kanban-cards');
    
    // SortableJS integration
    if (typeof Sortable !== 'undefined') {
      new Sortable(cardsContainer, {
        group: 'kanban', // set both lists to same group
        animation: 150,
        ghostClass: 'dragging',
        forceFallback: true,
        scroll: true,
        bubbleScroll: true,
        scrollSensitivity: 100,
        scrollSpeed: 20,
        onEnd: function (evt) {
          updateAllKanbanOrders();
        }
      });
    }

    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'k-card';
      card.dataset.id = p.id;
      
      const images = getImages(p);
      const imgUrl = images.length ? (images[0].startsWith('http') ? images[0] : `imagens/${images[0]}`) : '';
      
      card.innerHTML = `
        <img src="${imgUrl}" onerror="handleImageError(this)">
        <div class="k-title">${p.name || p.nome}</div>
        <div class="k-info">
          <span>${p.city || p.cidade}</span>
          <span>${formatMoney(getPrice(p))}</span>
        </div>
      `;
      
      card.addEventListener('dblclick', () => openModal(p.id));
      
      cardsContainer.appendChild(card);
    });

    container.appendChild(colDiv);
  });
}

function updateAllKanbanOrders() {
  document.querySelectorAll('.kanban-cards').forEach(container => {
    const newDate = container.dataset.date;
    const cards = container.querySelectorAll('.k-card');
    
    cards.forEach((cardEl, index) => {
      const id = parseInt(cardEl.dataset.id);
      const item = itemsData.find(i => i.id === id);
      if (item) {
        item.plannedDate = newDate;
        item.kanbanOrder = index;
      }
    });
  });
  saveData();
}

function openModal(id) {
  currentEditingId = id;
  const item = itemsData.find(i => i.id === id);
  if (!item) return;

  const images = getImages(item);
  const imgUrl = images.length ? (images[0].startsWith('http') ? images[0] : `imagens/${images[0]}`) : '';
  
  document.getElementById('modal-image').src = imgUrl;
  document.getElementById('modal-title').textContent = item.name || item.nome;
  
  const officialLink = item.official_link || item.linkReserva || item.linkInfo;
  let linkHtml = '';
  if (officialLink) {
    linkHtml = `<a href="${officialLink}" target="_blank" class="btn btn-primary" style="text-decoration:none; display:block; margin-top: 15px; text-align: center;">🌐 Acessar Site Oficial / Ingressos</a>`;
  }
  
  const mDetails = document.getElementById('modal-details');
  mDetails.innerHTML = `
    <p><strong>Cidade:</strong> ${item.city || item.cidade}</p>
    <p><strong>Categoria:</strong> ${getCategories(item).join(', ')}</p>
    <p><strong>Valor:</strong> ${formatMoney(getPrice(item))}</p>
    <p><strong>Duração:</strong> ${item.duration_hours || item.tempoMedio || '--'} h</p>
    <p><strong>Observações:</strong> ${item.observation || item.observacoes || ''}</p>
    <div style="margin-top: 15px; padding: 10px; background: #fff1f2; border-left: 4px solid #e11d48; color: #9f1239; border-radius: 4px;">
      <strong>⚠️ Lembrete Importante:</strong> Se for utilizar o Prime Gourmet ou mesmo para garantir a sua entrada e evitar filas longas, verifique a necessidade de <strong>comprar os ingressos antecipadamente!</strong>
    </div>
    ${linkHtml}
  `;
  
  document.getElementById('m-date').value = item.plannedDate || '';
  
  // Populate select dynamically to ensure config dates exist
  const mDateSelect = document.getElementById('m-date');
  mDateSelect.innerHTML = '<option value="">Sem data</option>';
  window.TRIP_CONFIG.dates.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = d;
    if(item.plannedDate === d) opt.selected = true;
    mDateSelect.appendChild(opt);
  });

  document.getElementById('m-time').value = item.plannedTime || '';
  document.getElementById('m-status').value = item.status || 'quero_ir';
  document.getElementById('m-notes').value = item.notes || '';
  document.getElementById('m-fav').checked = !!item.favorite;

  const tipBox = document.getElementById('m-tips-box');
  if (tipBox) {
    if (item.tips) {
      tipBox.innerHTML = `<strong>Dicas/Reviews:</strong> ${item.tips}`;
      tipBox.style.display = 'block';
    } else {
      tipBox.style.display = 'none';
    }
  }

  const onlineBox = document.getElementById('m-online-box');
  if (onlineBox) {
    if (item.worthBuyingOnline) {
      onlineBox.innerHTML = `🛒 <strong>Recomendado comprar online!</strong> (Evita filas ou é mais barato)`;
      onlineBox.style.display = 'block';
    } else {
      onlineBox.style.display = 'none';
    }
  }

  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  currentEditingId = null;
}

function saveModal() {
  if (!currentEditingId) return;
  const item = itemsData.find(i => i.id === currentEditingId);
  if (item) {
    item.plannedDate = document.getElementById('m-date').value;
    item.plannedTime = document.getElementById('m-time').value;
    item.status = document.getElementById('m-status').value;
    item.notes = document.getElementById('m-notes').value;
    item.favorite = document.getElementById('m-fav').checked;
    saveData();
    applyFilters();
  }
  closeModal();
}

function createNewItemPrompt() {
  const name = prompt("Nome do Passeio:");
  if (!name) return;
  const city = prompt("Cidade:");
  if (!city) return;
  const price = prompt("Valor aproximado (R$):");
  const imgUrl = prompt("URL da Imagem (opcional):");
  
  const newItem = {
    id: 'custom_' + Date.now(),
    name: name,
    city: city,
    category: ["Personalizado"],
    price_per_person: parseFloat(price) || 0,
    observation: "Item adicionado manualmente.",
    isCustom: true,
    plannedDate: "Sem data definida",
    status: "quero_ir"
  };
  
  if (imgUrl) {
    newItem.images = [imgUrl];
  }
  
  itemsData.push(newItem);
  saveData();
  applyFilters();
}
