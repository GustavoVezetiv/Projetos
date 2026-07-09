window.TRIP_CONFIG = {
  title: "Barra do Garças, Pontal do Araguaia e Região",
  storageKey: "tripPlanner_barra",
  dates: ["11/07", "12/07", "13/07", "14/07", "15/07 opcional"],
  defaultSuggestions: {}
};

window.TRIP_DATA.forEach((item, index) => {
  if (item.id === undefined) item.id = index + 1;

  if (item.plannedDate) {
    window.TRIP_CONFIG.defaultSuggestions[item.id] = item.plannedDate;
    return;
  }
  
  const name = (item.name || item.nome || '').toLowerCase();
  const cat = (item.category || item.categoria || []).join(' ').toLowerCase();
  
  let date = "";
  
  if (name.includes('serra azul') || name.includes('mirante') || name.includes('cristo')) {
    date = "11/07";
  } else if (cat.includes('cachoeira') && !name.includes('distante') && !name.includes('cânion') && !name.includes('canion')) {
    date = "12/07";
  } else if (cat.includes('cânion') || cat.includes('canion') || cat.includes('trilha') || cat.includes('aventura')) {
    date = "13/07";
  } else if (cat.includes('rafting') || cat.includes('rio') || cat.includes('banho')) {
    date = "14/07";
  }
  
  if (date) {
    window.TRIP_CONFIG.defaultSuggestions[item.id] = date;
  }
});
