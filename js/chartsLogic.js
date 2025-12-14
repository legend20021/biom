let inputChartData = {
  labels: [],
  datasets: [
    {
      label: "Temperatura Masa (°C)",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.4)",
      borderWidth: 2,
      radius: 2,
      tension: 0.4,
      yAxisID: "y_temp",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderWidth: 0,
      pointHoverRadius: 2,
    },
    {
      label: "Temperatura Lixiviados (°C)",
      data: [],
            borderColor: "rgb(255, 159, 64)",
      backgroundColor: "rgba(255, 159, 64, 0.4)",
      borderWidth: 2,
      radius: 2,
      tension: 0.4,
      yAxisID: "y_temp",
      pointBackgroundColor: "rgb(255, 159, 64)",
      pointBorderWidth: 0,
      pointHoverRadius: 2,
    },
    {
      label: "Presión (psi)",
      data: [],
            borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.4)",
      borderWidth: 2,
      radius: 2,
      tension: 0.4,
      yAxisID: "y_presion",
      pointBackgroundColor: "rgb(54, 162, 235)",
      pointBorderWidth: 0,
      pointHoverRadius: 2,
    },
    {
      label: "pH",
      data: [],
            borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.4)",
      borderWidth: 2,
      radius: 2,
      tension: 0.4,
      yAxisID: "y_ph",
      pointBackgroundColor: "rgb(75, 192, 192)",
      pointBorderWidth: 0,
      pointHoverRadius: 2,
    },
  ],
};

// Almacén de datos originales completos - NUNCA se modifica por filtros
const originalData = {
  labels: [],
  datasets: []
};


let graphLocalData = null;
let graphHeaderData = null;

// Variable para trackear si estamos en modo filtrado
let isFiltered = false;
// Variable para trackear la cantidad de puntos filtrados actualmente
let currentFilterPoints = null;
// Variable para recordar qué datasets están intencionalmente ocultos por el usuario
let userHiddenDatasets = new Set();

// Variables para control de granularidad
let currentGranularity = 1; // 1 = cada 10min, 3 = cada 30min, 6 = cada hora, etc.
let aggregatedData = {
  labels: [],
  datasets: []
};

// ============ VARIABLES PARA ACTUALIZACIÓN AUTOMÁTICA ============
let autoRefreshInterval = null;
let lastExecutedFunction = null;
let lastExecutedParams = null;
const AUTO_REFRESH_TIME = 1 * (60 * 1000); // 10 minutos en milisegundos

// Función para iniciar la actualización automática
function startAutoRefresh(functionName, params = null) {
  console.log(`🔄 Iniciando auto-refresh para función: ${functionName}`);
  
  // Limpiar cualquier intervalo previo
  stopAutoRefresh();
  
  // Guardar la función y parámetros actuales
  lastExecutedFunction = functionName;
  lastExecutedParams = params;
  
  // Configurar nuevo intervalo
  autoRefreshInterval = setInterval(() => {
    // Solo ejecutar si el proceso está iniciado
    if (state.start === true) {
      console.log(`⏰ Auto-refresh ejecutando: ${functionName}`, params);
      
      // Mostrar notificación discreta
      if (typeof notificationManager.show === 'function') {
        const functionNames = {
          'getInitialChartData': 'datos iniciales',
          'cargarTodosLosDatos': 'todos los datos',
          'filtrarPuntos': 'datos filtrados'
        };
        const friendlyName = functionNames[functionName] || functionName;
        notificationManager.show(`Actualizando ${friendlyName}...`, 'info', 3000);
      }
      
      switch (functionName) {
        case 'getInitialChartData':
          getInitialChartData();
          break;
        case 'cargarTodosLosDatos':
          cargarTodosLosDatos();
          break;
        case 'filtrarPuntos':
          if (params && params.cantidad) {
            filtrarPuntos(params.cantidad);
          }
          break;
        default:
          console.warn(`⚠️ Función de auto-refresh no reconocida: ${functionName}`);
      }
    } else {
      console.log(`⏸️ Auto-refresh pausado - state.start = ${state.start}`);
    }
  }, AUTO_REFRESH_TIME);
  
  console.log(`✅ Auto-refresh configurado cada ${AUTO_REFRESH_TIME / (1000 * 60)} minutos`);
  
  // // Mostrar notificación de confirmación
  // if (typeof notificationManager.show === 'function') {
  //   const functionNames = {
  //     'getInitialChartData': 'datos iniciales',
  //     'cargarTodosLosDatos': 'todos los datos', 
  //     'filtrarPuntos': 'datos filtrados'
  //   };
  //   const friendlyName = functionNames[functionName] || functionName;
  //   notificationManager.show(`Auto-actualización cada 10min: ${friendlyName}`, 'success');
  // }
}

// Función para detener la actualización automática
function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    console.log(`🛑 Auto-refresh detenido`);
  }
  lastExecutedFunction = null;
  lastExecutedParams = null;
}

// Función para pausar el auto-refresh (cuando se detiene el proceso)
function pauseAutoRefresh() {
  stopAutoRefresh();
}

// Función para reanudar el auto-refresh (cuando se inicia el proceso)
function resumeAutoRefresh() {
  console.log("▶️ Reanudando auto-refresh - proceso iniciado");
  
  // Solo reanudar si teníamos una función previamente ejecutada
  if (lastExecutedFunction) {
    console.log(`🔄 Reanudando auto-refresh para: ${lastExecutedFunction}`);
    startAutoRefresh(lastExecutedFunction, lastExecutedParams);
    
    // Mostrar notificación informativa
    if (typeof notificationManager.show === 'function') {
      const functionNames = {
        'getInitialChartData': 'datos iniciales',
        'cargarTodosLosDatos': 'todos los datos',
        'filtrarPuntos': 'datos filtrados'
      };
      const friendlyName = functionNames[lastExecutedFunction] || lastExecutedFunction;
      notificationManager.show(`Auto-actualización cada 10min: ${friendlyName}`, 'success');
    }
  } else {
    console.log("ℹ️ No hay función previa para reanudar auto-refresh");
  }
}

// Hacer las funciones disponibles globalmente para uso externo
window.pauseAutoRefresh = pauseAutoRefresh;
window.resumeAutoRefresh = resumeAutoRefresh;

function actualizarGrafica() {
  // Si estamos en estado de carga y llegan datos, ocultar el loading
  if (isLoadingChartData && (
    (state.grafica_temperatura_masa && state.grafica_temperatura_masa.length > 0) ||
    (state.grafica_temperatura_lixiviados && state.grafica_temperatura_lixiviados.length > 0) ||
    (state.grafica_presion && state.grafica_presion.length > 0) ||
    (state.grafica_ph && state.grafica_ph.length > 0)
  )) {
    hideChartLoading();
    notificationManager.show('Datos de gráfica cargados correctamente', 'success');
  }
  
  // Siempre actualizar inputChartData y originalData con los nuevos datos del state
  if (state.grafica_temperatura_masa) {
    inputChartData.datasets[0].data = [...state.grafica_temperatura_masa];
  }
  if (state.grafica_temperatura_lixiviados) {
    inputChartData.datasets[1].data = [...state.grafica_temperatura_lixiviados];
  }
  if (state.grafica_presion) {
    inputChartData.datasets[2].data = [...state.grafica_presion];
  }
  if (state.grafica_ph) {
    inputChartData.datasets[3].data = [...state.grafica_ph];
  }

  // Actualizar originalData con los datos nuevos del state
  updateOriginalData();
  
  // Actualizar rangos Y sin hacer update del chart aún
  updateYAxisRanges(false);
  
  // Si estamos en modo filtrado, reaplicar el filtro con los datos actualizados
  if (isFiltered && currentFilterPoints !== null) {
    applyCurrentFilter();
    updateChartTitle();
    // Usar una animación más suave para actualizaciones de datos filtrados
    myChart.update('active');
  } else {
    // Aplicar granularidad a todos los datos
    applyGranularity(currentGranularity);
  }
}

// Función para actualizar originalData solo con datos nuevos del state
function updateOriginalData() {
  // Actualizar inputChartData.labels para que coincida con la cantidad de datos
  if (inputChartData.datasets[0] && inputChartData.datasets[0].data.length > 0) {
    const numPuntos = inputChartData.datasets[0].data.length;
    inputChartData.labels = Array.from({ length: numPuntos }, (_, i) => {
      return parseInt(i / 6) + "h " + (i % 6) * 10 + "m";
    });
  }
  
  // Solo actualizar si tenemos datos válidos
  if (inputChartData.labels && inputChartData.labels.length > 0) {
    originalData.labels = [...inputChartData.labels];
    originalData.datasets = inputChartData.datasets.map((ds) => ({
      ...ds,
      data: [...ds.data],
    }));
  }
}

// Función para inicializar originalData cuando haya datos disponibles
function initializeOriginalData() {
  // Actualizar inputChartData.labels para que coincida con la cantidad de datos
  if (inputChartData.datasets[0] && inputChartData.datasets[0].data.length > 0) {
    const numPuntos = inputChartData.datasets[0].data.length;
    inputChartData.labels = Array.from({ length: numPuntos }, (_, i) => {
      return parseInt(i / 6) + "h " + (i % 6) * 10 + "m";
    });
  }
  
  if (inputChartData.labels && inputChartData.labels.length > 0) {
    originalData.labels = [...inputChartData.labels];
    originalData.datasets = inputChartData.datasets.map((ds) => ({
      ...ds,
      data: [...ds.data],
    }));
  }
}

// Función para agregar datos según granularidad
function aggregateData(sourceData, granularity) {
  if (granularity === 1 || !sourceData.labels || sourceData.labels.length === 0) {
    return {
      labels: [...sourceData.labels],
      datasets: sourceData.datasets.map(ds => ({
        ...ds,
        data: [...ds.data]
      }))
    };
  }

  const aggregatedLabels = [];
  const aggregatedDatasets = sourceData.datasets.map(ds => ({
    ...ds,
    data: []
  }));

  // Agregar datos en grupos según granularidad
  for (let i = 0; i < sourceData.labels.length; i += granularity) {
    const group = sourceData.labels.slice(i, i + granularity);
    if (group.length > 0) {
      // Usar el primer label del grupo para representar el período
      aggregatedLabels.push(group[0]);
      
      // Calcular promedio para cada dataset
      sourceData.datasets.forEach((dataset, datasetIndex) => {
        const groupData = dataset.data.slice(i, i + granularity);
        const validData = groupData.filter(val => val !== null && !isNaN(val) && val !== undefined);
        
        if (validData.length > 0) {
          const average = validData.reduce((sum, val) => sum + val, 0) / validData.length;
          aggregatedDatasets[datasetIndex].data.push(Math.round(average * 100) / 100); // Redondear a 2 decimales
        } else {
          aggregatedDatasets[datasetIndex].data.push(null);
        }
      });
    }
  }

  return {
    labels: aggregatedLabels,
    datasets: aggregatedDatasets
  };
}

// Función para aplicar granularidad y actualizar gráfica
function applyGranularity(granularity) {
  currentGranularity = granularity;
  
  // Determinar qué datos usar como fuente
  let sourceData;
  if (isFiltered && currentFilterPoints !== null) {
    // Si estamos filtrados, usar los datos filtrados como fuente
    const total = originalData.labels.length;
    const inicio = Math.max(total - currentFilterPoints, 0);
    sourceData = {
      labels: originalData.labels.slice(inicio),
      datasets: originalData.datasets.map(ds => ({
        ...ds,
        data: ds.data.slice(inicio)
      }))
    };
  } else {
    // Usar todos los datos originales
    sourceData = originalData;
  }
  
  // Agregar datos según granularidad
  aggregatedData = aggregateData(sourceData, granularity);
  
  // Actualizar gráfica con datos agregados
  myChart.data.labels = [...aggregatedData.labels];
  myChart.data.datasets.forEach((dataset, index) => {
    if (aggregatedData.datasets[index]) {
      dataset.data = [...aggregatedData.datasets[index].data];
    }
  });
  
  updateChartTitle();
  updateYAxisRanges();
  myChart.update();
  
  // Actualizar indicador de granularidad en el UI
  updateGranularityUI();
}

// Función para actualizar el UI de granularidad
function updateGranularityUI() {
  // Actualizar botones de granularidad
  document.querySelectorAll('.granularity-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Marcar el botón activo
  const activeBtn = document.querySelector(`[data-granularity="${currentGranularity}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Función para actualizar la UI de los botones de filtro
function updateFilterUI(cantidad) {
  // Actualizar botones de filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Marcar el botón activo
  const activeBtn = document.querySelector(`[data-filter="${cantidad}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Función para cambiar granularidad manualmente
function setGranularity(granularity) {
  applyGranularity(granularity);
  
  const granularityNames = {
    1: '10 min',
    3: '30 min', 
    6: '1 hora',
    12: '2 horas',
    18: '3 horas'
  };
  
  notificationManager.show(`Granularidad cambiada a: ${granularityNames[granularity]}`, 'success');
}

// Función helper para reaplicar el filtro actual cuando llegan datos nuevos
function applyCurrentFilter() {
  if (!currentFilterPoints || !originalData.labels || originalData.labels.length === 0) {
    return;
  }
  
  // Usar la función de granularidad que ya maneja filtros
  applyGranularity(currentGranularity);
}

function updateYAxisRanges(shouldUpdate = true) {
  const activeDatasets = myChart.data.datasets.filter((dataset, idx) => 
    !myChart.getDatasetMeta(idx).hidden
  );

  if (activeDatasets.length > 0) {
    // Función helper para calcular rango dinámico
    function calculateDynamicRange(values) {
      if (values.length === 0) return { min: 0, max: 10 };
      
      const validValues = values.filter(val => val !== null && !isNaN(val) && val !== undefined);
      if (validValues.length === 0) return { min: 0, max: 10 };
      
      const min = Math.min(...validValues);
      const max = Math.max(...validValues);
      
      // Si todos los valores son iguales, crear un rango simétrico
      if (min === max) {
        const center = min;
        const margin = Math.max(Math.abs(center * 0.2), 5); // 20% del valor o mínimo 5
        return {
          min: Math.max(0, center - margin),
          max: center + margin
        };
      }
      
      // Calcular el rango de datos
      const range = max - min;
      const margin = Math.max(range * 0.15, Math.max(max * 0.1, 2)); // 15% del rango o 10% del max, mínimo 2
      
      return {
        min: Math.max(0, min - margin),
        max: max + margin
      };
    }

    // Ajustar escala de temperatura
    const tempDatasets = activeDatasets.filter(ds => ds.yAxisID === 'y_temp');
    if (tempDatasets.length > 0) {
      const allTempValues = tempDatasets.flatMap(ds => ds.data);
      const tempRange = calculateDynamicRange(allTempValues);
      myChart.options.scales.y_temp.min = Math.floor(tempRange.min);
      myChart.options.scales.y_temp.max = Math.ceil(tempRange.max);
    }

    // Ajustar escala de presión
    const presionDatasets = activeDatasets.filter(ds => ds.yAxisID === 'y_presion');
    if (presionDatasets.length > 0) {
      const allPresionValues = presionDatasets.flatMap(ds => ds.data);
      const presionRange = calculateDynamicRange(allPresionValues);
      myChart.options.scales.y_presion.min = Math.floor(presionRange.min);
      myChart.options.scales.y_presion.max = Math.ceil(presionRange.max);
    }

    // Ajustar escala de pH con rango más ajustado
    const phDatasets = activeDatasets.filter(ds => ds.yAxisID === 'y_ph');
    if (phDatasets.length > 0) {
      const allPhValues = phDatasets.flatMap(ds => ds.data);
      const validPhValues = allPhValues.filter(val => val !== null && !isNaN(val) && val !== undefined);
      
      if (validPhValues.length > 0) {
        const minPh = Math.min(...validPhValues);
        const maxPh = Math.max(...validPhValues);
        
        // Para pH, usar rangos más ajustados
        if (minPh === maxPh) {
          // Si todos los valores son iguales, crear un rango de ±0.5
          const center = minPh;
          myChart.options.scales.y_ph.min = Math.max(0, Math.floor((center - 0.5) * 10) / 10);
          myChart.options.scales.y_ph.max = Math.ceil((center + 0.5) * 10) / 10;
        } else {
          // Calcular rango con margen más pequeño para pH
          const range = maxPh - minPh;
          const margin = Math.max(range * 0.2, 0.3); // 20% del rango o mínimo 0.3
          
          myChart.options.scales.y_ph.min = Math.max(0, Math.floor((minPh - margin) * 10) / 10);
          myChart.options.scales.y_ph.max = Math.ceil((maxPh + margin) * 10) / 10;
        }
      } else {
        // Valores por defecto si no hay datos válidos
        myChart.options.scales.y_ph.min = 0;
        myChart.options.scales.y_ph.max = 7;
      }
    }
  }

  // Solo actualizar si se solicita explícitamente
  if (shouldUpdate) {
    myChart.update();
  }
}

// Función para actualizar colores de la gráfica según el tema
function updateChartTheme() {
  // Verificar que myChart esté definido y correctamente inicializado
  if (typeof myChart === 'undefined' || !myChart || !myChart.options) {

    return;
  }
  
  try {
    const isDark = document.documentElement.hasAttribute('data-theme') && 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Colores para el título y texto
    const titleColor = isDark ? '#ffffff' : '#333333';
    const textColor = isDark ? '#e2e8f0' : '#666666';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    
    // Verificar que las propiedades existan antes de actualizarlas
    if (myChart.options.plugins && myChart.options.plugins.title) {
      myChart.options.plugins.title.color = titleColor;
    }
    
    // Actualizar colores de las leyendas
    if (myChart.options.plugins && myChart.options.plugins.legend && myChart.options.plugins.legend.labels) {
      myChart.options.plugins.legend.labels.color = textColor;
    }
    
    // Actualizar colores de los ejes si existen
    if (myChart.options.scales) {
      if (myChart.options.scales.x) {
        if (myChart.options.scales.x.title) myChart.options.scales.x.title.color = textColor;
        if (myChart.options.scales.x.ticks) myChart.options.scales.x.ticks.color = textColor;
        if (myChart.options.scales.x.grid) myChart.options.scales.x.grid.color = gridColor;
      }
      
      if (myChart.options.scales.y_temp) {
        if (myChart.options.scales.y_temp.title) myChart.options.scales.y_temp.title.color = textColor;
        if (myChart.options.scales.y_temp.ticks) myChart.options.scales.y_temp.ticks.color = textColor;
        if (myChart.options.scales.y_temp.grid) myChart.options.scales.y_temp.grid.color = gridColor;
      }
      
      if (myChart.options.scales.y_presion) {
        if (myChart.options.scales.y_presion.title) myChart.options.scales.y_presion.title.color = textColor;
        if (myChart.options.scales.y_presion.ticks) myChart.options.scales.y_presion.ticks.color = textColor;
      }
      
      if (myChart.options.scales.y_ph) {
        if (myChart.options.scales.y_ph.title) myChart.options.scales.y_ph.title.color = textColor;
        if (myChart.options.scales.y_ph.ticks) myChart.options.scales.y_ph.ticks.color = textColor;
      }
    }
    
    // Actualizar tooltip si existe
    if (myChart.options.plugins && myChart.options.plugins.tooltip) {
      myChart.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
      myChart.options.plugins.tooltip.titleColor = titleColor;
      myChart.options.plugins.tooltip.bodyColor = textColor;
      myChart.options.plugins.tooltip.borderColor = isDark ? '#4a5568' : '#e0e0e0';
    }
    
    // Actualizar la gráfica
    myChart.update('none');
    

  } catch (error) {
    console.error('BIOMASTER: Error al actualizar tema del chart:', error);
  }
}

// Función para actualizar el título con el conteo de puntos
function updateChartTitle() {
  if (!myChart || !myChart.data.datasets[0]) return;
  
  const totalPuntos = myChart.data.datasets[0].data.length;
  const mainTitle = "Temperatura, Presión y pH en el tiempo";
  
  // Calcular el tiempo total mostrado en el gráfico
  const minutosBase = 10; // Cada punto original representa 10 minutos
  const granularityMultiplier = {
    1: 1,   // 10 min por punto
    3: 3,   // 30 min por punto
    6: 6,   // 1 hora por punto
    12: 12, // 2 horas por punto
    18: 18  // 3 horas por punto
  };
  
  // Calcular total de minutos mostrados
  const totalMinutos = totalPuntos * minutosBase * (granularityMultiplier[currentGranularity] || 1);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  
  // Formatear el tiempo total
  let tiempoTotal = "";
  if (horas > 0 && minutos > 0) {
    tiempoTotal = `${horas}h ${minutos}min`;
  } else if (horas > 0) {
    tiempoTotal = `${horas}h`;
  } else {
    tiempoTotal = `${minutos}min`;
  }
  
  // Determinar el texto de granularidad
  const granularityText = {
    1: "10 min",
    3: "30 min",
    6: "1 hora", 
    12: "2 horas",
    18: "3 horas"
  };
  
  const currentGranularityText = granularityText[currentGranularity] || "10 min";
  const subtitle = `${tiempoTotal} - Granularidad: ${currentGranularityText}`;
  
  myChart.options.plugins.title.text = [mainTitle, subtitle];
}

// Hacer las funciones disponibles globalmente
window.updateChartTheme = updateChartTheme;
window.updateChartTitle = updateChartTitle;
window.setGranularity = setGranularity;
window.applyGranularity = applyGranularity;

const config = {
  type: "line",
  data: inputChartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: [
          "Temperatura, Presión y pH en el tiempo",
          "0 puntos mostrados - Un punto = 10 min"
        ],
        color: '#333333', // Color inicial para tema claro
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      legend: {
        position: "bottom",
        align: "center",
        onClick: function(e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const width = window.innerWidth;
          const isMobile = width < 768;

          if (isMobile) {
            ci.data.datasets.forEach((dataset, idx) => {
              const otherMeta = ci.getDatasetMeta(idx);
              otherMeta.hidden = idx !== index;
            });
            
            // Actualizar escalas Y para el nuevo dataset visible en mobile
            updateResponsiveDisplay();
          } else {
            const meta = ci.getDatasetMeta(index);
            const wasHidden = meta.hidden;
            meta.hidden = !meta.hidden;
            
            // Trackear qué datasets están intencionalmente ocultos por el usuario
            if (meta.hidden) {
              userHiddenDatasets.add(index);
            } else {
              userHiddenDatasets.delete(index);
            }
          }

          updateYAxisRanges();
          ci.update();
        },
        labels: {
          usePointStyle: true,
          padding: 15,
          color: '#666666', // Color inicial para tema claro
          font: {
            size: 12,
            weight: '600'
          }
        },
        padding: {
          bottom: 20 // Añadir espacio entre la leyenda y la gráfica
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 2,
        displayColors: true
      },
      zoom: {
        limits: {
          y: {min: 'original', max: 'original'},
          y_temp: {min: 'original', max: 'original'},
          y_presion: {min: 'original', max: 'original'},
          y_ph: {min: 'original', max: 'original'},
          x: {
            min: 0,
            max: function(chart) {
              // Permitir zoom hasta que se muestren mínimo 6 puntos
              const totalPoints = chart.data.labels ? chart.data.labels.length : 0;
              return Math.max(totalPoints - 1, 5); // Asegurar que el máximo sea al menos 5 (índice del punto 6)
            },
            minRange: 5 // Rango mínimo de 6 puntos (índices 0-5)
          }
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: false,
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          },
          mode: 'x',
        }
      }
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Tiempo",
          color: '#666666', // Color inicial para tema claro
          font: {
            size: 13,
            weight: '600'
          }
        },
        grid: {
          display: true,
          drawBorder: false,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          callback: function(value, index) {
            const totalLabels = this.chart.data.labels.length;
            let interval;
            
            // Si no hay datos, no mostrar nada
            if (totalLabels === 0) return "";
            
            // Si solo hay 1 o 2 datos, mostrar todos
            if (totalLabels <= 2) return this.getLabelForValue(value);
            
            // Determinar el intervalo según la cantidad total de datos
            if (totalLabels <= 6) { // 1 hora o menos
              interval = 1; // Mostrar todos los labels disponibles
            } else if (totalLabels <= 12) { // 2 horas o menos
              interval = 3; // Mostrar cada 30 minutos (cada 3 puntos)
            } else if (totalLabels <= 36) { // 6 horas o menos
              interval = 6; // Mostrar cada hora (cada 6 puntos)
            } else if (totalLabels <= 72) { // 12 horas o menos
              interval = 12; // Mostrar cada 2 horas (cada 12 puntos)
            } else {
              interval = 18; // Mostrar cada 3 horas (cada 18 puntos)
            }
            
            // Garantizar que siempre se muestre al menos el primer y último label
            if (index === 0 || index === totalLabels - 1) {
              return this.getLabelForValue(value);
            }
            
            return index % interval === 0 ? this.getLabelForValue(value) : "";
          },
          maxRotation: 45,
          minRotation: 0,
          color: '#666666', // Color inicial para tema claro
          font: {
            size: 11
          }
        }
      },
      y_temp: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Temperatura (°C)",
          color: '#666666', // Color inicial para tema claro
          font: {
            size: 13,
            weight: '600'
          }
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: '#666666' // Color inicial para tema claro
        }
      },
      y_presion: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Presión (psi)",
          color: '#666666', // Color inicial para tema claro
          font: {
            size: 13,
            weight: '600'
          }
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false
        },
        ticks: {
          color: '#666666' // Color inicial para tema claro
        }
      },
      y_ph: {
        type: "linear",
        position: "right",
        offset: true,
        title: {
          display: true,
          text: "pH",
          color: '#666666', // Color inicial para tema claro
          font: {
            size: 13,
            weight: '600'
          }
        },
        grid: {
          drawOnChartArea: false,
          drawBorder: false
        },
        ticks: {
          color: '#666666' // Color inicial para tema claro
        }
      }
    }
  }
};

const myChart = new Chart(document.getElementById("multiAxisChart"), config);

// Notificar al theme manager que el chart está listo
function notifyChartReady() {

  
  // Notificar al theme manager si está disponible
  if (typeof themeManager !== 'undefined' && themeManager) {

    themeManager.updateChartThemeIfAvailable();
  }
  
  // Crear evento personalizado para otros módulos
  document.dispatchEvent(new CustomEvent('chartReady', { detail: { chart: myChart } }));
}

// Usar múltiples métodos para asegurar que se ejecute
requestAnimationFrame(() => {
  setTimeout(notifyChartReady, 50);
});

// También verificar cuando el DOM esté completamente listo
if (document.readyState === 'complete') {
  setTimeout(notifyChartReady, 100);
} else {
  window.addEventListener('load', () => {
    setTimeout(notifyChartReady, 100);
  });
}

function addZoomListener() {
  const canvas = document.getElementById('multiAxisChart');
  let dragStart = null;
  let dragEnd = null;
  let isDragging = false;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    dragStart = {
      x: e.clientX - rect.left
    };
    isDragging = true;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const rect = canvas.getBoundingClientRect();
      dragEnd = {
        x: e.clientX - rect.left
      };
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (isDragging && dragStart && dragEnd) {
      const chart = Chart.getChart(canvas);
      const xAxis = chart.scales.x;

      const xStart = xAxis.getValueForPixel(dragStart.x);
      const xEnd = xAxis.getValueForPixel(dragEnd.x);

      chart.zoomScale('x', {min: Math.min(xStart, xEnd), max: Math.max(xStart, xEnd)});
      chart.update();
    }
    isDragging = false;
    dragStart = null;
    dragEnd = null;
  });
}

function updateResponsiveDisplay() {
  const width = window.innerWidth;
  const isMobile = width < 768;

  myChart.data.datasets.forEach(dataset => {
    dataset.radius = isMobile ? 1 : 1;
    dataset.pointHoverRadius = isMobile ? 1 : 1;
  });

  if (isMobile) {
    // En mobile, asegurar que solo un dataset esté visible
    let foundActive = false;
    myChart.data.datasets.forEach((dataset, idx) => {
      const meta = myChart.getDatasetMeta(idx);
      if (!meta.hidden) {
        if (foundActive) {
          meta.hidden = true;
        } else {
          foundActive = true;
        }
      }
    });

    // Mostrar solo la escala Y del dataset visible
    const visibleDataset = myChart.data.datasets.find((dataset, idx) => 
      !myChart.getDatasetMeta(idx).hidden
    );

    if (visibleDataset) {
      const visibleYAxisID = visibleDataset.yAxisID;
      
      // Ocultar todas las escalas Y primero
      myChart.options.scales.y_temp.display = false;
      myChart.options.scales.y_presion.display = false;
      myChart.options.scales.y_ph.display = false;
      
      // Mostrar solo la escala del dataset visible
      if (myChart.options.scales[visibleYAxisID]) {
        myChart.options.scales[visibleYAxisID].display = true;
        
        // En mobile, posicionar la escala siempre a la izquierda para mejor UX
        myChart.options.scales[visibleYAxisID].position = 'left';
      }
    }
  } else {
    // En desktop, restaurar datasets pero respetar los que el usuario ocultó intencionalmente
    myChart.data.datasets.forEach((dataset, idx) => {
      const meta = myChart.getDatasetMeta(idx);
      // Solo mostrar si no está intencionalmente oculto por el usuario
      if (!userHiddenDatasets.has(idx)) {
        meta.hidden = false;
      }
    });

    // En desktop, mostrar escalas según datasets visibles
    myChart.options.scales.y_presion.display = myChart.data.datasets.some((ds, idx) => 
      ds.yAxisID === 'y_presion' && !myChart.getDatasetMeta(idx).hidden
    );
    
    myChart.options.scales.y_ph.display = myChart.data.datasets.some((ds, idx) => 
      ds.yAxisID === 'y_ph' && !myChart.getDatasetMeta(idx).hidden
    );

    myChart.options.scales.y_temp.display = myChart.data.datasets.some((ds, idx) => 
      ds.yAxisID === 'y_temp' && !myChart.getDatasetMeta(idx).hidden
    );

    // Restaurar posiciones originales en desktop
    myChart.options.scales.y_temp.position = 'left';
    myChart.options.scales.y_presion.position = 'right';
    myChart.options.scales.y_ph.position = 'right';
  }

  myChart.options.scales.x.ticks.callback = function(value, index) {
    const totalLabels = this.chart.data.labels.length;
    let interval;
    
    // Si no hay datos, no mostrar nada
    if (totalLabels === 0) return "";
    
    // Si solo hay 1 o 2 datos, mostrar todos
    if (totalLabels <= 2) return this.getLabelForValue(value);
    
    // Determinar el intervalo según la cantidad total de datos y si es móvil
    if (totalLabels <= 6) { // 1 hora o menos
      interval = 1; // Mostrar todos los labels disponibles
    } else if (totalLabels <= 12) { // 2 horas o menos
      interval = isMobile ? 2 : 3; // Mobile: cada 20min, Desktop: cada 30 min
    } else if (totalLabels <= 36) { // 6 horas o menos
      interval = isMobile ? 4 : 6; // Mobile: cada 40min, Desktop: cada hora
    } else if (totalLabels <= 72) { // 12 horas o menos
      interval = isMobile ? 4 : 12; // Mobile: cada hora, Desktop: cada 2 horas
    } else {
      interval = isMobile ? 4 : 18; // Mobile: cada 80min, Desktop: cada 3 horas
    }
    
    // Garantizar que siempre se muestre al menos el primer y último label
    if (index === 0 || index === totalLabels - 1) {
      return this.getLabelForValue(value);
    }
    
    return index % interval === 0 ? this.getLabelForValue(value) : "";
  };

  myChart.options.plugins.title.font.size = isMobile ? 14 : 16;
  myChart.options.plugins.legend.labels.font.size = isMobile ? 10 : 12;
  myChart.options.plugins.legend.padding.bottom = isMobile ? 15 : 20; // Menos padding en móvil

  updateYAxisRanges();
  updateChartTitle(); // Actualizar título con conteo inicial
  myChart.update('none');
}

function descargarGrafica() {
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 1800; 
  tempCanvas.height = 1050; 
  const tempCtx = tempCanvas.getContext('2d');

  // Rellenar el canvas con fondo blanco antes de dibujar la gráfica
  tempCtx.fillStyle = '#FFFFFF';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
  // Colores fijos para exportación (siempre oscuros para mejor legibilidad en fondo blanco)
  const exportColors = {
    title: '#333333',
    text: '#666666', 
    grid: 'rgba(0,0,0,0.1)'
  };
  
  // Obtener el estado de visibilidad actual de cada dataset
  const datasetVisibility = myChart.data.datasets.map((dataset, idx) => 
    !myChart.getDatasetMeta(idx).hidden
  );

  const exportConfig = {
    type: "line",
    data: {
      labels: myChart.data.labels,
      datasets: myChart.data.datasets.map((dataset, idx) => ({
        ...dataset,
        hidden: !datasetVisibility[idx] // Aplicar el estado de visibilidad actual
      }))
    },
    options: {
      ...config.options,
      responsive: false, 
      animation: false,
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50
        }
      },
      plugins: {
        ...config.options.plugins,
        title: {
          ...config.options.plugins.title,
          text: myChart.options.plugins.title.text, // Usar el título actual con el conteo
          color: exportColors.title, // Forzar color oscuro
          font: {
            size: 24,
            weight: 'bold'
          }
        },
        legend: {
          ...config.options.plugins.legend,
          labels: {
            ...config.options.plugins.legend.labels,
            color: exportColors.text, // Forzar color oscuro
            font: {
              size: 20,
              weight: 'bold'
            }
          },
          padding: {
            bottom: 25 // Más espacio en la exportación
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: exportColors.title,
          bodyColor: exportColors.text,
          borderColor: '#e0e0e0',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ...config.options.scales.x,
          title: {
            ...config.options.scales.x.title,
            color: exportColors.text // Forzar color oscuro
          },
          ticks: {
            ...config.options.scales.x.ticks,
            color: exportColors.text, // Forzar color oscuro
            callback: function(value, index) {
              const totalLabels = this.chart.data.labels.length;
              let interval;
              
              // Determinar el intervalo según la cantidad total de datos
              if (totalLabels <= 12) { // 2 horas o menos
                interval = 3; // Mostrar cada 30 minutos (cada 3 puntos)
              } else if (totalLabels <= 36) { // 6 horas o menos
                interval = 6; // Mostrar cada hora (cada 6 puntos)
              } else {
                interval = 12; // Mostrar cada 2 horas (cada 12 puntos)
              }
              
              return index % interval === 0 ? this.getLabelForValue(value) : "";
            }
          },
          grid: {
            ...config.options.scales.x.grid,
            color: exportColors.grid
          }
        },
        // Solo incluir escalas Y para los datasets visibles
        ...(myChart.data.datasets.some((ds, idx) => ds.yAxisID === 'y_temp' && datasetVisibility[idx]) && {
          y_temp: {
            ...config.options.scales.y_temp,
            title: {
              ...config.options.scales.y_temp.title,
              color: exportColors.text // Forzar color oscuro
            },
            ticks: {
              ...config.options.scales.y_temp.ticks,
              color: exportColors.text // Forzar color oscuro
            },
            grid: {
              ...config.options.scales.y_temp.grid,
              color: exportColors.grid
            }
          }
        }),
        ...(myChart.data.datasets.some((ds, idx) => ds.yAxisID === 'y_presion' && datasetVisibility[idx]) && {
          y_presion: {
            ...config.options.scales.y_presion,
            title: {
              ...config.options.scales.y_presion.title,
              color: exportColors.text // Forzar color oscuro
            },
            ticks: {
              ...config.options.scales.y_presion.ticks,
              color: exportColors.text // Forzar color oscuro
            }
          }
        }),
        ...(myChart.data.datasets.some((ds, idx) => ds.yAxisID === 'y_ph' && datasetVisibility[idx]) && {
          y_ph: {
            ...config.options.scales.y_ph,
            title: {
              ...config.options.scales.y_ph.title,
              color: exportColors.text // Forzar color oscuro
            },
            ticks: {
              ...config.options.scales.y_ph.ticks,
              color: exportColors.text // Forzar color oscuro
            }
          }
        })
      }
    }
  };

  // Crear el chart en el canvas temporal
  const tempChart = new Chart(tempCtx, exportConfig);
  
  // Esperar a que se renderice completamente y luego descargar
  setTimeout(() => {
    // Crear un nuevo canvas para el resultado final con fondo blanco
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = tempCanvas.width;
    finalCanvas.height = tempCanvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    
    // Rellenar con blanco el canvas final
    finalCtx.fillStyle = '#FFFFFF';
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    // Dibujar la gráfica encima del fondo blanco
    finalCtx.drawImage(tempCanvas, 0, 0);
    
    const link = document.createElement('a');
    link.download = `grafica_multi_eje_${new Date().toISOString().slice(0, 10)}.jpg`;
    link.href = finalCanvas.toDataURL('image/jpeg', 0.95); // JPG con calidad 95%
    link.click();
    
    // Limpiar el chart temporal
    tempChart.destroy();
    
    notificationManager.show('Se ha descargado la imagen en formato JPG con fondo blanco');
  }, 100);
}

function descargarCSV() {
  const labels = myChart.data.labels;
  const datasets = myChart.data.datasets;
  const visibles = datasets.filter(
    (dataset, idx) => !myChart.getDatasetMeta(idx).hidden
  );
  let headers = ["Tiempo", ...visibles.map((ds) => ds.label)];
  let csv = headers.join(";") + "\n";

  for (let i = 0; i < labels.length; i++) {
    let fila = [labels[i]];
    visibles.forEach((ds) => {
      fila.push(ds.data[i]);
    });
    csv += fila.join(";") + "\n";
  }

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "datos_grafica.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  notificationManager.show(`Se ha descargado el archivo`);
}

function resetZoom() {
  myChart.resetZoom();
  myChart.update('none');
}

function filtrarPuntos(cantidad) {

  let fileNameParam = null;
  if (graphLocalData !== null && graphHeaderData !== null && graphHeaderData.filename !== null && graphHeaderData.filename !== '') {
    fileNameParam = graphHeaderData.filename;
  }
  // Mostrar animación de carga
  showChartLoading();
  
  // Actualizar el estado activo de los botones de filtro
  updateFilterUI(cantidad);
  
  // Marcar que estamos en modo filtrado y guardar la cantidad
  isFiltered = true;
  currentFilterPoints = cantidad;
  
  // ============ INICIAR AUTO-REFRESH PARA FILTRADO ============
  // solo sin no hay un proceso activo
  if (graphHeaderData == null) {
    startAutoRefresh('filtrarPuntos', { cantidad: cantidad });
  }
  
  // ============ NUEVA LÓGICA CON API ============
  
  // Variables para controlar cuándo ocultar el loading
  let completedRequests = 0;
  const totalRequests = 2; // loadFilteredGraphData + loadGraphStats
  
  function checkAndHideLoading() {
    completedRequests++;
    if (completedRequests >= totalRequests) {
      hideChartLoading();
    }
  }
  
  async function loadFilteredGraphData() {
    try {
      
      // Llamar al endpoint optimizado con el límite específico usando ApiManager
      const data = await apiManager.getRecentGraphData(cantidad, fileNameParam);
      
      // Mapear los datos del endpoint a las gráficas del estado
      const graphData = {
        grafica_presion: data.presion_reciente || [],
        grafica_temperatura_masa: data.temp_masa_reciente || [],
        grafica_temperatura_lixiviados: data.temp_lix_reciente || [],
        grafica_ph: data.ph_reciente || []
      };
      
      
      // Actualizar UI con los datos filtrados
      updateChartsNewData(graphData);
      
    } catch (error) {
      console.error("❌ Error cargando datos filtrados de gráficas:", error);
      
      if (typeof notificationManager.show === 'function') {
        notificationManager.show("Error cargando datos filtrados", "error");
      }
    } finally {
      checkAndHideLoading();
    }
  }
  // Ejecutar ambas cargas con delay
  setTimeout(loadFilteredGraphData, 300);
  
  // Mostrar notificación de éxito
  const horas = Math.round(cantidad/6);
  notificationManager.show(`Cargando últimos ${cantidad} puntos (${horas} horas aprox.) desde API`, 'info');
}



function restaurarDatos() {
  // Verificar que originalData tenga datos
  if (!originalData.labels || originalData.labels.length === 0) {
    console.warn('No hay datos originales para restaurar');
    notificationManager.show('No hay datos originales para restaurar', 'warning');
    return;
  }
  
  // Desmarcar modo filtrado y limpiar filtro guardado
  isFiltered = false;
  currentFilterPoints = null;
  
  // Quitar el estado activo de todos los botones de filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // También restaurar inputChartData para sincronización
  inputChartData.labels = [...originalData.labels];
  inputChartData.datasets = originalData.datasets.map((ds) => ({
    ...ds,
    data: [...ds.data],
  }));
  
  // Aplicar granularidad a todos los datos restaurados
  applyGranularity(currentGranularity);
  
  // Resetear el zoom para mostrar todos los datos restaurados
  myChart.resetZoom();
  
  // Verificar si estamos en modo móvil y ajustar visibilidad de datasets
  const width = window.innerWidth;
  const isMobile = width < 768;
  
  if (isMobile) {
    // En móvil, asegurar que solo un dataset esté visible después de restaurar
    let foundActive = false;
    myChart.data.datasets.forEach((dataset, idx) => {
      const meta = myChart.getDatasetMeta(idx);
      if (foundActive) {
        meta.hidden = true;
      } else {
        meta.hidden = false;
        foundActive = true;
      }
    });
    updateResponsiveDisplay();
  }
  
  notificationManager.show('Mostrando todos los datos disponibles', 'success');
}

function filtrarPorHoras() {
  const horas = parseInt(document.getElementById("horasInput").value);
  if (!isNaN(horas) && horas > 0) {
    const puntos = horas * 6; // 6 puntos por hora (cada 10 minutos)
    filtrarPuntos(puntos);
    
    // Limpiar el input después de aplicar el filtro
    document.getElementById("horasInput").value = "";
  } else {
    notificationManager.show("Por favor, ingresa un número válido de horas mayor a 0.", 'warning');
  }
}

function updateChartDimensions() {
  const container = document.querySelector('.chart-container');
  const width = window.innerWidth;
  const maxHeight = width < 768 ? 
    Math.min(window.innerHeight * 0.7, 600) : 
    Math.min(window.innerHeight * 0.7, 600);
  
  container.style.height = `${maxHeight}px`;
  myChart.resize();
}

document.addEventListener('DOMContentLoaded', () => {
  
  updateResponsiveDisplay();
  updateYAxisRanges();
  updateChartTheme(); // Aplicar tema inicial
  updateChartTitle(); // Aplicar conteo inicial de puntos
  updateGranularityUI(); // Actualizar UI de granularidad
  
  window.addEventListener('resize', () => {
    updateChartDimensions();
    updateResponsiveDisplay();
  });
});


// Variables para controlar el estado de carga
let isLoadingChartData = false;
let loadingAnimationId = null;
let loadingMessageIndex = 0;

function showChartLoading() {
  isLoadingChartData = true;
  const canvas = document.getElementById('multiAxisChart');
  const ctx = canvas.getContext('2d');
  
  const loadingMessages = [
    'Cargando datos de pH',
    'Cargando temperatura de lixiviados',
    'Cargando temperatura de masa',
    'Cargando datos de presión'
  ];
  
  let startTime = Date.now();
  
  function animateLoading() {
    if (!isLoadingChartData) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurar estilos
    const isDark = document.documentElement.hasAttribute('data-theme') && 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#333333';
    const spinnerColor = isDark ? '#60a5fa' : '#3b82f6';
    const backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = (Date.now() - startTime) * 0.005;
    
    // Círculo de fondo
    ctx.strokeStyle = backgroundColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 25, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Círculo giratorio
    ctx.strokeStyle = spinnerColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 25, time, time + Math.PI * 1.5);
    ctx.stroke();
    
    // Texto del proceso actual
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    const currentMessage = loadingMessages[loadingMessageIndex % loadingMessages.length];
    ctx.fillText(currentMessage, centerX, centerY + 20);
    
    // Porcentaje
    const percentage = Math.round(((loadingMessageIndex + 1) / loadingMessages.length) * 100);
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText(`${percentage}%`, centerX, centerY + 45);
    ctx.globalAlpha = 1;
    
    loadingAnimationId = requestAnimationFrame(animateLoading);
  }
  
  animateLoading();
}

function hideChartLoading() {
  isLoadingChartData = false;
  if (loadingAnimationId) {
    cancelAnimationFrame(loadingAnimationId);
    loadingAnimationId = null;
  }
  loadingMessageIndex = 0;
  
  // Restaurar la gráfica normal
  myChart.update('none');
}

function getInitialChartData(curveDetail = null) {
  // Resetear las gráficas
    myChart.data.labels = [];
    myChart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    myChart.update('none');
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Mostrar animación de carga
    showChartLoading();
    
    // ============ INICIAR AUTO-REFRESH ============
    startAutoRefresh('getInitialChartData');
    
    // ============ USANDO ENDPOINT OPTIMIZADO graph/recent ============
    async function loadInitialGraphData() {
      try {
        
        // Usar el endpoint optimizado que trae todas las gráficas en una sola llamada con ApiManager
        const data = await apiManager.getRecentGraphData(50);
        
        // Mapear los datos del endpoint a las gráficas del estado
        const graphData = {
          grafica_presion: data.presion_reciente || [],
          grafica_temperatura_masa: data.temp_masa_reciente || [],
          grafica_temperatura_lixiviados: data.temp_lix_reciente || [],
          grafica_ph: data.ph_reciente || []
        };
        
        
        // Actualizar UI con todos los datos de una vez
        updateChartsNewData(graphData);
        
        
      } catch (error) {
        console.error("❌ Error cargando datos iniciales de gráficas:", error);
        
        if (typeof notificationManager.show === 'function') {
          notificationManager.show("Error cargando gráficas iniciales", "error");
        }
      } finally {
        hideChartLoading(); // Verificar si ya se completaron ambos requests
      }
    }

    function loadDataFromObject(curveDetail) {
      try {
        // Mapear los datos del objeto curveDetail a las gráficas del estado

        graphLocalData = {
          grafica_presion: curveDetail.dataPoints.map(point => (point.presion)),
          grafica_temperatura_masa: curveDetail.dataPoints.map(point => (point.temp_masa)),
          grafica_temperatura_lixiviados: curveDetail.dataPoints.map(point => (point.temp_lixiviados)),
          grafica_ph: curveDetail.dataPoints.map(point => (point.ph))
        };
        graphHeaderData = {
          processName: curveDetail.processName,
          recipeName: curveDetail.recipeName,
          coffeeType: curveDetail.coffeeType,
          coffeeKg: curveDetail.coffeeKg,
          pressureType: curveDetail.pressureType,
          comments: curveDetail.comments,
          filename: curveDetail.filename,
          duration: curveDetail.duration
        };

        //crea un template html para agregar como primer hijo del elemento con clase .chart-page donde se encuentra toda la información de graphHeaderData
        const headerHtml = `
          <div class="chart-header-info" id="chart-header-info">
            <div class="process-header">
              <div class="process-header-content">
                <button class="back-button" onclick="navigateToSection('curvas')" title="Volver a Curvas">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                  </svg>
                </button>
                <h2 class="process-name">${graphHeaderData.processName || 'Proceso Desconocido'}</h2>
              </div>
            </div>
            
            <div class="header-details">
              <div class="details-grid">
                <div class="detail-card">
                  <span class="detail-icon">📋</span>
                  <div class="detail-content">
                    <span class="detail-label">Receta</span>
                    <span class="detail-value">${graphHeaderData.recipeName || 'No especificada'}</span>
                  </div>
                </div>
                
                <div class="detail-card">
                  <span class="detail-icon">☕</span>
                  <div class="detail-content">
                    <span class="detail-label">Tipo de Café</span>
                    <span class="detail-value">${graphHeaderData.coffeeType || 'No especificado'} (${graphHeaderData.coffeeKg || 0} kg)</span>
                  </div>
                </div>
                
                <div class="detail-card">
                  <span class="detail-icon">⚙️</span>
                  <div class="detail-content">
                    <span class="detail-label">Presión</span>
                    <span class="detail-value">${graphHeaderData.pressureType || 'No especificado'}</span>
                  </div>
                </div>
                
                <div class="detail-card">
                  <span class="detail-icon">⏱️</span>
                  <div class="detail-content">
                    <span class="detail-label">Duración total</span>
                    <span class="detail-value">${graphHeaderData.duration || 'No disponible'}</span>
                  </div>
                </div>
              </div>
              
              ${graphHeaderData.comments && graphHeaderData.comments !== 'Sin comentarios' ? `
                <div class="comments-section">
                  <div class="detail-card">
                    <span class="detail-icon">💬</span>
                    <div class="detail-content">
                      <span class="detail-label">Comentarios</span>
                      <span class="detail-value comment-text">${graphHeaderData.comments}</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        `;

        // Agregar el template al DOM
        const chartPage = document.querySelector('.chart-page');
        chartPage.insertAdjacentHTML('afterbegin', headerHtml);

        // Actualizar UI con los datos del objeto
        updateChartsNewData(graphLocalData);
      } catch (error) {
        console.error("❌ Error cargando datos desde objeto curveDetail:", error);
      } finally {
        hideChartLoading();
      }
    }
    
    // Ejecutar ambas cargas: datos iniciales y estadísticas
    //elimina el elemento con id chart-header-info si existe
    const existingHeader = document.getElementById('chart-header-info');
    if (existingHeader) {
      existingHeader.remove();
    }
    if (curveDetail == null) {
      graphHeaderData = null;
      graphLocalData = null;
      setTimeout(loadInitialGraphData, 300);
    } else {
      loadDataFromObject(curveDetail);
    }
}

// ============ NUEVA FUNCIÓN: UPDATE UI ELEMENTS ============
function updateChartsNewData(graphData) {
  
  // Mapear los datos recibidos al state global
  if (graphData.grafica_presion) {
    state.grafica_presion = [...graphData.grafica_presion];
  }
  
  if (graphData.grafica_temperatura_masa) {
    state.grafica_temperatura_masa = [...graphData.grafica_temperatura_masa];
  }
  
  if (graphData.grafica_temperatura_lixiviados) {
    state.grafica_temperatura_lixiviados = [...graphData.grafica_temperatura_lixiviados];
  }
  
  if (graphData.grafica_ph) {
    state.grafica_ph = [...graphData.grafica_ph];
  }
  
  // Actualizar las gráficas usando el método existente
  actualizarGrafica();
  
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.style.display === 'block') {
      updateChartDimensions();
      updateResponsiveDisplay();
    }
  });
});

const graficasDiv = document.getElementById('graficas');
observer.observe(graficasDiv, { attributes: true, attributeFilter: ['style'] });

function cargarTodosLosDatos() {

  let fileNameParam = null;
  if (graphLocalData !== null && graphHeaderData !== null && graphHeaderData.filename !== null && graphHeaderData.filename !== '') {
    fileNameParam = graphHeaderData.filename;
  }
  
  // Mostrar animación de carga
  showChartLoading();
  
  // Actualizar el estado de filtrado
  isFiltered = false;
  currentFilterPoints = 0;
  
  // Actualizar botones de filtro (ninguno seleccionado)
  updateFilterUI(0);
  
  // ============ INICIAR AUTO-REFRESH PARA TODOS LOS DATOS ============
  //solo si no hay un proceso activo
  if (graphHeaderData == null) {
    startAutoRefresh('cargarTodosLosDatos');
  }
  
  // Variables para controlar cuándo ocultar el loading
  let completedRequests = 0;
  const totalRequests = 2; // loadAllHistoricalData + loadGraphStats
  
  function checkAndHideLoading() {
    completedRequests++;
    if (completedRequests >= totalRequests) {
      hideChartLoading();
      console.log("🎯 Ambos requests históricos completados - Loading ocultado");
    }
  }
  
  async function loadAllHistoricalData() {
    try {
      
      const data = await apiManager.getAllGraphData(fileNameParam);
      
      // Mapear los datos del endpoint unificado al formato esperado
      const graphData = {
        grafica_presion: data.presion || [],
        grafica_temperatura_masa: data.temperatura_masa || [],
        grafica_temperatura_lixiviados: data.temperatura_lixiviados || [],
        grafica_ph: data.ph || []
      };
      
      // Actualizar UI con todos los datos históricos
      updateChartsNewData(graphData);
      
      const totalPoints = Object.values(graphData).reduce((sum, arr) => sum + arr.length, 0);
      
      // Mostrar información adicional del endpoint
      if (data.total_points !== undefined) {
        
        const processStatus = data.proceso_activo ? "🔄 ACTIVO" : "⏹️ FINALIZADO";
        notificationManager.show(`${totalPoints} puntos cargados - Proceso ${processStatus}`, 'success');
      } else {
        notificationManager.show(`${totalPoints} puntos históricos cargados desde API unificada`, 'success');
      }
      
    } catch (error) {
      console.error("❌ Error cargando TODOS los datos históricos:", error);
      
      if (typeof notificationManager.show === 'function') {
        notificationManager.show("Error cargando datos históricos desde API unificada", "error");
      }
    } finally {
      checkAndHideLoading();
    }
  }
  
  
  // Ejecutar ambas cargas con delay
  setTimeout(loadAllHistoricalData, 300);
  
  // Mostrar notificación
  notificationManager.show("Cargando TODOS los datos históricos desde API...", 'info');
}