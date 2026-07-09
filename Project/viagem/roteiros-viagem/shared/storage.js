// Storage module
// Depends on window.TRIP_CONFIG and window.TRIP_DATA

let itemsData = [];

function initializeData() {
  const localDataStr = localStorage.getItem(window.TRIP_CONFIG.storageKey);
  let localData = {};
  if (localDataStr) {
    try {
      localData = JSON.parse(localDataStr);
    } catch (e) {
      console.error('Error parsing local storage data', e);
    }
  }

  const customStr = localStorage.getItem(window.TRIP_CONFIG.storageKey + '_custom');
  let customItems = [];
  if (customStr) {
    try { customItems = JSON.parse(customStr); } catch (e) {}
  }

  const allData = window.TRIP_DATA.concat(customItems);

  itemsData = allData.map((item, index) => {
    // Generate an ID if it doesn't exist
    if (item.id === undefined) item.id = (item.isCustom ? item.id : index + 1);
    // Merge base data with local modifications
    const id = item.id.toString();
    const mods = localData[id] || {};
    
    return {
      ...item,
      plannedDate: mods.plannedDate !== undefined ? mods.plannedDate : (item.plannedDate || window.TRIP_CONFIG.defaultSuggestions[id] || ''),
      plannedTime: mods.plannedTime !== undefined ? mods.plannedTime : (item.plannedTime || ''),
      status: mods.status || 'quero_ir',
      notes: mods.notes || '',
      favorite: !!mods.favorite,
      kanbanOrder: mods.kanbanOrder || 0
    };
  });
}

function saveData() {
  const localData = {};
  const customItems = itemsData.filter(i => i.isCustom);
  localStorage.setItem(window.TRIP_CONFIG.storageKey + '_custom', JSON.stringify(customItems));

  itemsData.forEach(item => {
    const id = item.id.toString();
    localData[id] = {
      plannedDate: item.plannedDate,
      plannedTime: item.plannedTime,
      status: item.status,
      notes: item.notes,
      favorite: item.favorite,
      kanbanOrder: item.kanbanOrder
    };
  });
  localStorage.setItem(window.TRIP_CONFIG.storageKey, JSON.stringify(localData));
}

function exportData() {
  const dataStr = localStorage.getItem(window.TRIP_CONFIG.storageKey);
  if (!dataStr) {
    alert("Nenhuma alteração local para exportar.");
    return;
  }
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${window.TRIP_CONFIG.storageKey}_backup.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      localStorage.setItem(window.TRIP_CONFIG.storageKey, JSON.stringify(json));
      alert("Dados importados com sucesso! A página será recarregada.");
      location.reload();
    } catch (err) {
      alert("Arquivo inválido.");
    }
  };
  reader.readAsText(file);
}

function clearLocalData() {
  if (confirm("Tem certeza que deseja apagar todas as alterações e restaurar o plano original?")) {
    localStorage.removeItem(window.TRIP_CONFIG.storageKey);
    location.reload();
  }
}
