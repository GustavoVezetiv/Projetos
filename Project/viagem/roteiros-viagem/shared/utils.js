// Format money
function formatMoney(val) {
  if (val === 0 || val === '0') return 'Gratuito';
  if (!val) return 'A confirmar';
  return `R$ ${parseFloat(val).toFixed(2).replace('.', ',')}`;
}

// Ensure an array
function toArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return [val];
  return [];
}

// Get the price based on standard keys (some data has valorAprox, some price_per_person)
function getPrice(item) {
  if (item.price_per_person !== undefined) return item.price_per_person;
  if (item.valorAprox !== undefined) return item.valorAprox;
  return null;
}

// Get category
function getCategories(item) {
  return toArray(item.category || item.categoria);
}

// Get images
function getImages(item) {
  return toArray(item.images || item.imagens);
}

// Provide a fallback for missing external images
function handleImageError(imgElement) {
  imgElement.onerror = null;
  imgElement.style.display = 'none';
  const parent = imgElement.parentElement;
  if (!parent.querySelector('.fallback')) {
    const fb = document.createElement('div');
    fb.className = 'fallback';
    fb.innerHTML = 'Imagem indisponível<br><small>Sem sinal</small>';
    parent.appendChild(fb);
  }
}
