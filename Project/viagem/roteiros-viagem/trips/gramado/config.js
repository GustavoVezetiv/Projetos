window.TRIP_CONFIG = {
  title: "Gramado, Canela, Torres e Porto Alegre",
  storageKey: "tripPlanner_gramado",
  dates: ["19/07", "20/07", "21/07", "22/07", "23/07", "24/07 extra", "25/07 extra"],
  defaultSuggestions: {}
};

// Generate default suggestions based on rules
window.TRIP_DATA.forEach(item => {
  if (item.plannedDate) {
    window.TRIP_CONFIG.defaultSuggestions[item.id] = item.plannedDate;
    return;
  }
  
  const name = (item.name || '').toLowerCase();
  const cat = (item.category || []).join(' ').toLowerCase();
  const city = (item.city || '').toLowerCase();
  
  let date = "";
  
  if (city === 'porto alegre' || city === 'torres') {
    date = "22/07";
  } else if (city === 'canela' && (cat.includes('natureza') || cat.includes('aventura') || name.includes('caracol') || name.includes('alpen') || name.includes('skyglass'))) {
    date = "21/07";
  } else if (name.includes('lago negro') || name.includes('rua coberta') || name.includes('igreja') || name.includes('mini mundo')) {
    date = "19/07";
  } else if (city === 'canela') {
    date = "20/07";
  } else if (cat.includes('compras') || name.includes('shopping') || name.includes('centro')) {
    date = "23/07";
  }
  
  if (date) {
    window.TRIP_CONFIG.defaultSuggestions[item.id] = date;
  }
});
