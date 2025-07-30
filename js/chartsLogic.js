let inputChartData = {
  labels: labels,
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
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
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
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    },
    {
      label: "Presión (bar)",
      data: [],
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.4)",
      borderWidth: 2,
      radius: 2,
      tension: 0.4,
      yAxisID: "y_presion",
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
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
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    },
  ],
};

// Almacén de datos originales completos - NUNCA se modifica por filtros
const originalData = {
  labels: [],
  datasets: []
};

// Variable para trackear si estamos en modo filtrado
let isFiltered = false;

function actualizarGrafica() {
  // Solo actualizar con datos del state si no estamos en modo filtrado
  if (!isFiltered) {
    inputChartData.datasets[0].data = [...state.grafica_temperatura_masa];
    inputChartData.datasets[1].data = [...state.grafica_temperatura_lixiviados];
    inputChartData.datasets[2].data = [...state.grafica_presion];
    inputChartData.datasets[3].data = [...state.grafica_ph];
    
    // Actualizar originalData SOLO cuando recibimos datos nuevos del state
    updateOriginalData();
  }
  
  myChart.update();
  updateYAxisRanges();
}

// Función para actualizar originalData solo con datos nuevos del state
function updateOriginalData() {
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
  if (inputChartData.labels && inputChartData.labels.length > 0) {
    originalData.labels = [...inputChartData.labels];
    originalData.datasets = inputChartData.datasets.map((ds) => ({
      ...ds,
      data: [...ds.data],
    }));
  }
}

function findMaxValue(data) {
  return Math.max(...data.filter(val => val !== null && !isNaN(val)), 0);
}

function updateYAxisRanges() {
  const activeDatasets = myChart.data.datasets.filter((dataset, idx) => 
    !myChart.getDatasetMeta(idx).hidden
  );

  if (activeDatasets.length > 0) {
    const tempDatasets = activeDatasets.filter(ds => ds.yAxisID === 'y_temp');
    if (tempDatasets.length > 0) {
      const maxTemp = Math.max(...tempDatasets.map(ds => findMaxValue(ds.data)));
      myChart.options.scales.y_temp.min = 0;
      myChart.options.scales.y_temp.max = maxTemp + 5;
    }

    const presionDatasets = activeDatasets.filter(ds => ds.yAxisID === 'y_presion');
    if (presionDatasets.length > 0) {
      const maxPresion = Math.max(...presionDatasets.map(ds => findMaxValue(ds.data)));
      myChart.options.scales.y_presion.min = 0;
      myChart.options.scales.y_presion.max = maxPresion + 5;
    }

    const phDatasets = activeDatasets.filter(ds => ds.yAxisID === 'y_ph');
    if (phDatasets.length > 0) {
      const maxPh = Math.max(...phDatasets.map(ds => findMaxValue(ds.data)));
      myChart.options.scales.y_ph.min = 0;
      myChart.options.scales.y_ph.max = maxPh + 5;
    }
  }

  myChart.update();
}

// Función para actualizar colores de la gráfica según el tema
function updateChartTheme() {
  if (!myChart) return;
  
  const isDark = document.documentElement.hasAttribute('data-theme') && 
                 document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Colores para el título y texto
  const titleColor = isDark ? '#ffffff' : '#333333';
  const textColor = isDark ? '#e2e8f0' : '#666666';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  
  // Actualizar colores del título
  myChart.options.plugins.title.color = titleColor;
  
  // Actualizar colores de las leyendas
  myChart.options.plugins.legend.labels.color = textColor;
  
  // Actualizar colores de los ejes
  myChart.options.scales.x.title.color = textColor;
  myChart.options.scales.x.ticks.color = textColor;
  myChart.options.scales.x.grid.color = gridColor;
  
  myChart.options.scales.y_temp.title.color = textColor;
  myChart.options.scales.y_temp.ticks.color = textColor;
  myChart.options.scales.y_temp.grid.color = gridColor;
  
  myChart.options.scales.y_presion.title.color = textColor;
  myChart.options.scales.y_presion.ticks.color = textColor;
  
  myChart.options.scales.y_ph.title.color = textColor;
  myChart.options.scales.y_ph.ticks.color = textColor;
  
  // Actualizar tooltip
  myChart.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  myChart.options.plugins.tooltip.titleColor = titleColor;
  myChart.options.plugins.tooltip.bodyColor = textColor;
  myChart.options.plugins.tooltip.borderColor = isDark ? '#4a5568' : '#e0e0e0';
  
  // Actualizar la gráfica
  myChart.update('none');
}

// Hacer la función disponible globalmente
window.updateChartTheme = updateChartTheme;

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
        text: "Temperatura, Presión y pH en el tiempo (cada punto = 10 min)",
        color: '#333333', // Color inicial para tema claro
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      legend: {
        position: "top",
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
          } else {
            const meta = ci.getDatasetMeta(index);
            meta.hidden = !meta.hidden;
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
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 4,
        displayColors: true
      },
      zoom: {
        limits: {
          y: {min: 'original', max: 'original'},
          y_temp: {min: 'original', max: 'original'},
          y_presion: {min: 'original', max: 'original'},
          y_ph: {min: 'original', max: 'original'}
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
            enabled: true,
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
            return index % 6 === 0 ? this.getLabelForValue(value) : "";
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
        beginAtZero: true,
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
        beginAtZero: true,
        title: {
          display: true,
          text: "Presión (bar)",
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
        beginAtZero: true,
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
    dataset.radius = isMobile ? 0 : 2;
    dataset.pointHoverRadius = isMobile ? 4 : 6;
  });

  myChart.options.scales.y_presion.display = !isMobile || 
    (isMobile && myChart.data.datasets.some((ds, idx) => 
      ds.yAxisID === 'y_presion' && !myChart.getDatasetMeta(idx).hidden
    ));
  
  myChart.options.scales.y_ph.display = !isMobile || 
    (isMobile && myChart.data.datasets.some((ds, idx) => 
      ds.yAxisID === 'y_ph' && !myChart.getDatasetMeta(idx).hidden
    ));

  if (isMobile) {
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
  }

  myChart.options.scales.x.ticks.callback = function(value, index) {
    return index % (isMobile ? 12 : 6) === 0 ? this.getLabelForValue(value) : "";
  };

  myChart.options.plugins.title.font.size = isMobile ? 14 : 16;
  myChart.options.plugins.legend.labels.font.size = isMobile ? 10 : 12;

  updateYAxisRanges();
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
  
  const exportConfig = {
    type: "line",
    data: {
      labels: myChart.data.labels,
      datasets: myChart.data.datasets.map((dataset) => ({
        ...dataset,
        hidden: false 
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
          font: {
            size: 24,
            weight: 'bold'
          }
        },
        legend: {
          ...config.options.plugins.legend,
          labels: {
            font: {
              size: 20,
              weight: 'bold'
            }
          }
        }
      },
      scales: {
        ...config.options.scales,
        x: {
          ...config.options.scales.x,
          ticks: {
            ...config.options.scales.x.ticks,
            callback: function(value, index) {
              
              return index % 6 === 0 ? this.getLabelForValue(value) : "";
            }
          }
        }
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
    
    showNotification('Se ha descargado la imagen en formato JPG con fondo blanco');
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

  showNotification(`Se ha descargado el archivo`);
}

function resetZoom() {
  myChart.resetZoom();
  myChart.update('none');
}

function filtrarPuntos(cantidad) {
  // Verificar que originalData tenga datos
  if (!originalData.labels || originalData.labels.length === 0) {
    console.warn('No hay datos disponibles para filtrar');
    showNotification('No hay datos disponibles para filtrar', 'warning');
    return;
  }
  
  const total = originalData.labels.length;
  const inicio = Math.max(total - cantidad, 0);
  
  // Verificar que tengamos suficientes datos
  if (inicio >= total) {
    console.warn('No hay suficientes datos para mostrar');
    showNotification('No hay suficientes datos para mostrar el filtro solicitado', 'warning');
    return;
  }
  
  // Marcar que estamos en modo filtrado
  isFiltered = true;
  
  // Aplicar filtro solo a los datos mostrados en el chart, NO a originalData
  const nuevasLabels = originalData.labels.slice(inicio);
  const nuevosDatasets = originalData.datasets.map((dataset) => ({
    ...dataset,
    data: dataset.data.slice(inicio),
  }));
  
  // Verificar que tengamos labels después del filtro
  if (nuevasLabels.length === 0) {
    console.warn('El filtro resultó en datos vacíos');
    showNotification('El filtro no produjo datos para mostrar', 'warning');
    isFiltered = false; // Resetear el flag si falló
    return;
  }
  
  // Actualizar solo los datos del chart mostrado
  myChart.data.labels = nuevasLabels;
  myChart.data.datasets = nuevosDatasets;
  updateYAxisRanges();
  myChart.update();
  
  // Mostrar notificación de éxito
  showNotification(`Mostrando últimos ${cantidad} puntos (${Math.round(cantidad/6)} horas aprox.)`, 'success');
}

function restaurarDatos() {
  // Verificar que originalData tenga datos
  if (!originalData.labels || originalData.labels.length === 0) {
    console.warn('No hay datos originales para restaurar');
    showNotification('No hay datos originales para restaurar', 'warning');
    return;
  }
  
  // Desmarcar modo filtrado
  isFiltered = false;
  
  // Restaurar datos completos desde originalData
  myChart.data.labels = [...originalData.labels];
  myChart.data.datasets = originalData.datasets.map((ds) => ({
    ...ds,
    data: [...ds.data],
  }));
  
  // También restaurar inputChartData para sincronización
  inputChartData.labels = [...originalData.labels];
  inputChartData.datasets = originalData.datasets.map((ds) => ({
    ...ds,
    data: [...ds.data],
  }));
  
  updateYAxisRanges();
  myChart.update();
  
  showNotification('Mostrando todos los datos disponibles', 'success');
}

function filtrarPorHoras() {
  const horas = parseInt(document.getElementById("horasInput").value);
  if (!isNaN(horas) && horas > 0) {
    const puntos = horas * 6; // 6 puntos por hora (cada 10 minutos)
    filtrarPuntos(puntos);
    
    // Limpiar el input después de aplicar el filtro
    document.getElementById("horasInput").value = "";
  } else {
    showNotification("Por favor, ingresa un número válido de horas mayor a 0.", 'warning');
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
  addZoomListener();
  updateResponsiveDisplay();
  updateYAxisRanges();
  updateChartTheme(); // Aplicar tema inicial
  
  window.addEventListener('resize', () => {
    updateChartDimensions();
    updateResponsiveDisplay();
  });
});

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