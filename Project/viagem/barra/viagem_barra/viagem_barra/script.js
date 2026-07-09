// Carrega dados e inicializa filtros e cards
let passeios = [];

function loadData() {
  fetch('dados-passeios.json')
    .then((resp) => resp.json())
    .then((data) => {
      passeios = data;
      populateFilterOptions();
      applyFilters();
    })
    .catch((err) => console.error('Erro ao carregar dados:', err));
}

function populateFilterOptions() {
  // extrai cidades e categorias únicas
  const cidades = new Set();
  const categorias = new Set();
  passeios.forEach((p) => {
    cidades.add(p.cidade);
    p.categoria.forEach((cat) => categorias.add(cat));
  });
  // insere opções de cidade
  const selectCidade = document.getElementById('filter-cidade');
  [...cidades].sort().forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    selectCidade.appendChild(opt);
  });
  // insere opções de categoria
  const selectCategoria = document.getElementById('filter-categoria');
  [...categorias].sort().forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    selectCategoria.appendChild(opt);
  });
}

function getAccessCategory(tipo) {
  const lower = tipo.toLowerCase();
  if (lower.includes('4x4')) return '4x4';
  if (lower.includes('estrada de chão')) return 'estrada de chão';
  if (lower.includes('trilha') || lower.includes('escadaria')) return 'trilha';
  return 'carro';
}

function getPeriodoList(periodoStr) {
  const list = [];
  const lower = periodoStr.toLowerCase();
  if (lower.includes('manhã')) list.push('manhã');
  if (lower.includes('tarde')) list.push('tarde');
  if (lower.includes('noite')) list.push('noite');
  if (lower.includes('dia inteiro')) list.push('dia inteiro');
  return list.length ? list : ['dia inteiro'];
}

function dificuldadeValue(diff) {
  const lower = (diff || '').toLowerCase();
  if (lower.includes('fácil')) return 1;
  if (lower.includes('média')) return 2;
  if (lower.includes('difícil')) return 3;
  return 4;
}

function applyFilters() {
  const search = document.getElementById('search').value.toLowerCase().trim();
  const cidade = document.getElementById('filter-cidade').value;
  const periodo = document.getElementById('filter-periodo').value;
  const preco = document.getElementById('filter-preco').value;
  const categoria = document.getElementById('filter-categoria').value;
  const dificuldade = document.getElementById('filter-dificuldade').value;
  const guia = document.getElementById('filter-guia').value;
  const acesso = document.getElementById('filter-acesso').value;
  const sortBy = document.getElementById('sort-by').value;

  let filtered = passeios.filter((p) => {
    // pesquisa por nome
    if (search && !p.nome.toLowerCase().includes(search)) return false;
    // filtro cidade
    if (cidade && p.cidade !== cidade) return false;
    // filtro periodo
    if (periodo) {
      const periods = getPeriodoList(p.periodoRecomendado);
      if (!periods.includes(periodo)) return false;
    }
    // filtro preco
    if (preco) {
      const valor = p.valorAprox;
      if (preco === '0' && valor !== 0) return false;
      if (preco === '50' && !(valor !== null && valor <= 50 && valor > 0)) return false;
      if (preco === '100' && !(valor !== null && valor <= 100 && valor > 50)) return false;
      if (preco === '200' && !(valor !== null && valor <= 200 && valor > 100)) return false;
      if (preco === '201' && !(valor !== null && valor > 200)) return false;
    }
    // filtro categoria
    if (categoria && !p.categoria.includes(categoria)) return false;
    // filtro dificuldade
    if (dificuldade) {
      if (!p.dificuldade.toLowerCase().includes(dificuldade)) return false;
    }
    // filtro guia
    if (guia) {
      if (guia === 'sim' && p.guia !== 'sim') return false;
      if (guia === 'não' && p.guia !== 'não') return false;
    }
    // filtro acesso
    if (acesso) {
      const ac = getAccessCategory(p.tipoEstrada);
      if (ac !== acesso) return false;
    }
    return true;
  });

  // Ordenação
  if (sortBy) {
    filtered.sort((a, b) => {
      if (sortBy === 'valor') {
        const va = a.valorAprox ?? Infinity;
        const vb = b.valorAprox ?? Infinity;
        return va - vb;
      }
      if (sortBy === 'distancia') {
        // extrai número da distância (ex.: "≈50 km" -> 50)
        const da = parseFloat(a.distancia.replace(/[^0-9,\.]/g, '').replace(',', '.')) || Infinity;
        const db = parseFloat(b.distancia.replace(/[^0-9,\.]/g, '').replace(',', '.')) || Infinity;
        return da - db;
      }
      if (sortBy === 'dificuldade') {
        return dificuldadeValue(a.dificuldade) - dificuldadeValue(b.dificuldade);
      }
      if (sortBy === 'prioridade') {
        return b.notaPrioridade - a.notaPrioridade;
      }
      return 0;
    });
  }

  renderCards(filtered);
}

function renderCards(list) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';
  if (!list.length) {
    const noResult = document.createElement('p');
    noResult.textContent = 'Nenhum passeio encontrado.';
    container.appendChild(noResult);
    return;
  }
  list.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';
    // imagem principal
    const mainImg = document.createElement('img');
    mainImg.className = 'main-image';
    mainImg.src = `imagens/${p.imagens[0]}`;
    mainImg.alt = p.nome;
    card.appendChild(mainImg);
    // conteúdo
    const content = document.createElement('div');
    content.className = 'content';
    // título
    const title = document.createElement('h3');
    title.textContent = p.nome;
    content.appendChild(title);
    // tags categorias
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';
    p.categoria.forEach((cat) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = cat;
      tagsDiv.appendChild(span);
    });
    content.appendChild(tagsDiv);
    // informações
    const infoList = document.createElement('ul');
    infoList.className = 'info-list';
    const infoItems = [];
    infoItems.push(`<strong>Cidade/Região:</strong> ${p.cidade}`);
    infoItems.push(`<strong>Período:</strong> ${p.periodoRecomendado}`);
    infoItems.push(`<strong>Tempo médio:</strong> ${p.tempoMedio}`);
    infoItems.push(`<strong>Distância:</strong> ${p.distancia}`);
    infoItems.push(`<strong>Dificuldade:</strong> ${p.dificuldade}`);
    if (p.valorAprox !== null) {
      infoItems.push(`<strong>Valor:</strong> R$ ${p.valorAprox}`);
    } else {
      infoItems.push(`<strong>Valor:</strong> a confirmar`);
    }
    infoItems.push(`<strong>Guia:</strong> ${p.guia}`);
    infoItems.push(`<strong>Reserva:</strong> ${p.reserva}`);
    // assemble list items
    infoItems.forEach((html) => {
      const li = document.createElement('li');
      li.innerHTML = html;
      infoList.appendChild(li);
    });
    content.appendChild(infoList);
    // ações
    const actions = document.createElement('div');
    actions.className = 'actions';
    if (p.linkGoogleMaps) {
      const mapLink = document.createElement('a');
      mapLink.href = p.linkGoogleMaps;
      mapLink.target = '_blank';
      mapLink.rel = 'noopener noreferrer';
      mapLink.textContent = 'Abrir no Google Maps';
      actions.appendChild(mapLink);
    }
    if (p.linkInfo) {
      const infoLink = document.createElement('a');
      infoLink.href = p.linkInfo;
      infoLink.target = '_blank';
      infoLink.rel = 'noopener noreferrer';
      infoLink.textContent = 'Mais informações';
      actions.appendChild(infoLink);
    }
    if (p.linkReserva) {
      const resLink = document.createElement('a');
      resLink.href = p.linkReserva;
      resLink.target = '_blank';
      resLink.rel = 'noopener noreferrer';
      resLink.textContent = 'Reservar';
      actions.appendChild(resLink);
    }
    content.appendChild(actions);
    // observações
    const obs = document.createElement('p');
    obs.style.marginTop = '0.5rem';
    obs.style.fontSize = '0.75rem';
    obs.textContent = p.observacoes;
    content.appendChild(obs);
    // galeria
    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    p.imagens.forEach((imgName) => {
      const img = document.createElement('img');
      img.src = `imagens/${imgName}`;
      img.alt = p.nome;
      gallery.appendChild(img);
    });
    content.appendChild(gallery);
    card.appendChild(content);
    container.appendChild(card);
  });
}

// Eventos de filtro
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  const inputs = document.querySelectorAll('#filters input, #filters select');
  inputs.forEach((el) => el.addEventListener('change', applyFilters));
  document.getElementById('search').addEventListener('input', applyFilters);
});