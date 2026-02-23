
let pollingInterval = null;
let userInteractionLock = false;
let simulationInterval = null;
let isDemoMode = false;
let automatic_updates_demo = {
      automatic_updates: {
        presion: parseFloat((Math.random() * (60 - 35) + 35).toFixed(1)),
        temperatura_masa: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
        temperatura_lixiviados: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
        pH: parseFloat((Math.random() * (14 - 7) + 7).toFixed(1)),
        setpoint_presion: 21,
        setpoint_temperatura: 28,
        recirculacion: false,
        presion_natural: false,
        maceracion: false,
        control_temperatura: false,
        start: false,
        tiempo_horas: 2,
        tiempo_minutos: 15,
        temperatura_sp: 90,
        num_clientes_conectados: 1,
        nombre_ultimo_proceso: "",
        wifi_sta_connected: true,
        ssid_sta: 'WiFi_Casa_Demo'
      }
    };
// Configuración de polling
const POLLING_CONFIG = {
  interval: 10000,
  timeout: 10000,
  retryDelay: 10000
};
// ============ CLASE PARA GESTIÓN DE API ============
class ApiManager {
  constructor(_notificationManager) {
    this.apiNotificationManager = _notificationManager;
    this.API_BASE_URL = `http://${window.location.hostname}`;
    this.ENDPOINTS = {
      sensors: `${this.API_BASE_URL}/api/sensors`,
      commands: `${this.API_BASE_URL}/api/commands`,
      graphAll: `${this.API_BASE_URL}/api/graph/all`,
      graphRecent: `${this.API_BASE_URL}/api/graph/recent`,
      filesCurvas: `${this.API_BASE_URL}/api/files/curvas`,
      filesRecetas: `${this.API_BASE_URL}/api/files/recetas`,
      recipeDetail: `${this.API_BASE_URL}/api/receta/detail`,
      curveDetail: `${this.API_BASE_URL}/api/curva/detail`,
      deletefile: `${this.API_BASE_URL}/api/files/delete`,
      createRecipe: `${this.API_BASE_URL}/api/receta/create`,
      startAutomatic: `${this.API_BASE_URL}/api/process/start-automatic`,
      updateRecipe: `${this.API_BASE_URL}/api/recipe/update`,
      updateProcess: `${this.API_BASE_URL}/api/process/update`,
      setDate: `${this.API_BASE_URL}/api/config/date`,
      calibrationDate: `${this.API_BASE_URL}/api/config/calibration-date`,
      wifiConfig: `${this.API_BASE_URL}/api/config/wifi`,
      wifiScan: `${this.API_BASE_URL}/api/wifi/scan`,
      wifiConnect: `${this.API_BASE_URL}/api/wifi/connect`,
      wifiDisconnect: `${this.API_BASE_URL}/api/wifi/disconnect`,
      wifiStatus: `${this.API_BASE_URL}/api/wifi/status`,
      logs: `${this.API_BASE_URL}/api/logs`,
      authLogin: `${this.API_BASE_URL}/api/auth/login`
    };
    this.config = {
      timeout: 20000,
      retryDelay: 20000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };
    this.ApiDemoMode = false;
  }

  setDemoMode(isDemo) {
    this.ApiDemoMode = isDemo;
    console.log(`🎭 Modo DEMO ${isDemo ? 'activado' : 'desactivado'}`);
  }

  // ============ MÉTODO DE AUTENTICACIÓN ============
  async login(username, password) {
    if (this.ApiDemoMode) {
       // En demo, credenciales hardcodeadas para pruebas
       if(username === 'admin' && password === 'admin') {
         return { success: true, message: "Login demo exitoso", token: "DEMO_TOKEN_123" };
       }
       throw new Error("Credenciales inválidas (Demo: use admin/admin)");
    }
    
    console.log("🔐 Autenticando usuario:", username);
    return await this.makeRequest(this.ENDPOINTS.authLogin, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  // ============ MÉTODO DE CAMBIO DE CONTRASEÑA ============
  async changePassword(oldPassword, newPassword) {
    if (this.ApiDemoMode) {
        if(oldPassword === 'admin') {
            return { success: true, message: "Contraseña cambiada (Simulación)" };
        }
        throw new Error("Contraseña anterior incorrecta (Demo)");
    }

    console.log("🔐 Solicitando cambio de contraseña...");
    return await this.makeRequest('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
    });
  }

  // ============ MÉTODOS BÁSICOS DE API ============
  async makeRequest(url, options = {}, customTimeout = null) {
    const timeoutValue = customTimeout || this.config.timeout;
    const defaultOptions = {
      headers: this.config.headers,
      signal: AbortSignal.timeout(timeoutValue)
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response: ${url}`, data);
      return data;
      
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);
      throw error;
    }
  }

  // ============ MÉTODOS PARA SENSORES ============
  
  async getSensorData() {
    if (this.ApiDemoMode) {
      return {
        presion: parseFloat((Math.random() * (60 - 35) + 35).toFixed(1)),
        temperatura_masa: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
        temperatura_lixiviados: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
        pH: parseFloat((Math.random() * (14 - 7) + 7).toFixed(1)),
        setpoint_presion: automatic_updates_demo.automatic_updates.setpoint_presion,
        setpoint_temperatura: automatic_updates_demo.automatic_updates.setpoint_temperatura,
        recirculacion: automatic_updates_demo.automatic_updates.recirculacion,
        presion_natural: automatic_updates_demo.automatic_updates.presion_natural,
        maceracion: automatic_updates_demo.automatic_updates.maceracion,
        control_temperatura: automatic_updates_demo.automatic_updates.control_temperatura,
        start: automatic_updates_demo.automatic_updates.start,
        tiempo_horas: automatic_updates_demo.automatic_updates.tiempo_horas,
        tiempo_minutos: automatic_updates_demo.automatic_updates.tiempo_minutos,
        temperatura_sp: automatic_updates_demo.automatic_updates.temperatura_sp,
        num_clientes_conectados: automatic_updates_demo.automatic_updates.num_clientes_conectados,
        modo: 0,
        etapa: 1,
        total_etapas: 3,
        nombre_ultimo_proceso: automatic_updates_demo.automatic_updates.nombre_ultimo_proceso,
        wifi_sta_connected: automatic_updates_demo.automatic_updates.wifi_sta_connected,
        ssid_sta: automatic_updates_demo.automatic_updates.ssid_sta
      };
    }

    // Modo real - hacer request HTTP
    return await this.makeRequest(this.ENDPOINTS.sensors, {
      method: 'GET'
    });
  }

  // ============ MÉTODOS PARA COMANDOS ============
  
  async sendCommand(command, success = false, text = "") {
    try {
        console.log("✅ Comando enviado:", command);
        if (this.ApiDemoMode) {
            this.sendDemoApiCommand(command);
        } else {
            const result = await this.sendApiCommand(command);
            console.log("✅ Comando enviado exitosamente:", result);
        }

        if (success && text) {
            this.apiNotificationManager.show(text, "success", 5000);
        }

    } catch (error) {
        console.error("❌ Error enviando comando:", error);
        const errorText = text || "Error al enviar el comando";
        this.apiNotificationManager.show(errorText, "error");
    }
  }

  async sendApiCommand(command) {
    return await this.makeRequest(this.ENDPOINTS.commands, {
      method: 'POST',
      body: JSON.stringify(command)
    });
  }

  sendDemoApiCommand(command){
    
    if (command.CMD_recirculacion !== undefined && command.CMD_recirculacion !== null) {
        automatic_updates_demo.automatic_updates.recirculacion = command.CMD_recirculacion;
    }
    
    if (command.start !== undefined && command.start !== null) {
        automatic_updates_demo.automatic_updates.start = command.start;
    }
    
    if (command.stop !== undefined && command.stop !== null) {
        automatic_updates_demo.automatic_updates.start = false;
    }
    
    if (command.cancelar !== undefined && command.cancel !== null) {
        automatic_updates_demo.automatic_updates.start = false;
    }
    if (command.CMD_presion_natural !== undefined && command.CMD_presion_natural !== null) {
        automatic_updates_demo.automatic_updates.presion_natural = command.CMD_presion_natural;
    }
    if (command.CMD_maceracion !== undefined && command.CMD_maceracion !== null) {
        automatic_updates_demo.automatic_updates.maceracion = command.CMD_maceracion;
    }
    if (command.CMD_control_temperatura !== undefined && command.CMD_control_temperatura !== null) {
        automatic_updates_demo.automatic_updates.control_temperatura = command.CMD_control_temperatura;
    }
    
  }

  // ============ MÉTODOS PARA GRÁFICAS ============
  
  async getAllGraphData(filename = null) {
    if (this.ApiDemoMode) {
      // Retornar datos demo simulados para todas las gráficas
      console.log(`🎭 Retornando datos de gráficas completas DEMO${filename ? ` para archivo: ${filename}` : ''}`);
      const demoGraphData = this._generateDemoGraphData(50); // 50 puntos demo
      return {
        temperatura_masa: demoGraphData.temperatura_masa,
        temperatura_lixiviados: demoGraphData.temperatura_lixiviados,
        presion: demoGraphData.presion,
        ph: demoGraphData.ph,
        timestamps: demoGraphData.timestamps,
        total_points: 50,
        source_file: filename ? `/curvas/${filename}_data.dat` : "/temporales/proceso_actual.dat",
        is_curve_file: !!filename,
        proceso_activo: filename ? false : automatic_updates_demo.automatic_updates.start,
        process_name: filename ? `Proceso Demo ${filename}` : "Proceso Actual",
        recipe_name: filename ? "Receta Demo" : null,
        start_time: "2025-09-06 08:00:00",
        end_time: automatic_updates_demo.automatic_updates.start ? null : "2025-09-06 16:00:00"
      };
    }

    // Modo real - hacer request HTTP
    let url = this.ENDPOINTS.graphAll;
    if (filename) {
      url += `?filename=${encodeURIComponent(filename)}`;
    }
    
    return await this.makeRequest(url, {
      method: 'GET'
    });
  }

  async getRecentGraphData(limit = 50, filename = null) {
    if (this.ApiDemoMode) {
      // Retornar datos demo simulados recientes
      console.log(`🎭 Retornando datos recientes DEMO (${limit} puntos)${filename ? ` para archivo: ${filename}` : ''}`);
      const demoGraphData = this._generateDemoGraphData(limit);
      return {
        presion_reciente: demoGraphData.presion,
        temp_masa_reciente: demoGraphData.temperatura_masa,
        temp_lix_reciente: demoGraphData.temperatura_lixiviados,
        ph_reciente: demoGraphData.ph,
        timestamps: demoGraphData.timestamps,
        total_points: limit,
        total_available: limit + 20, // Simular más datos disponibles
        source_file: filename ? `/curvas/${filename}_data.dat` : "/temporales/proceso_actual.dat",
        is_curve_file: !!filename,
        process_name: filename ? `Proceso Demo ${filename}` : null,
        recipe_name: filename ? "Receta Demo" : null
      };
    }
    
    // Modo real - hacer request HTTP
    let url = `${this.ENDPOINTS.graphRecent}?limit=${limit}`;
    if (filename) {
      url += `&filename=${encodeURIComponent(filename)}`;
    }
    
    return await this.makeRequest(url, {
      method: 'GET'
    });
  }

  // ============ MÉTODOS PARA ARCHIVOS ============
  
  async getCurvasFiles(filterParams = null) {
    if (this.ApiDemoMode) {
      // Retornar archivos demo simulados de curvas con estructura real
      console.log("🎭 Retornando archivos de curvas DEMO", filterParams ? 'con filtros:' : '', filterParams);
      
      // En modo demo, simular filtrado básico para testing
      let demoCurvas = [
        {
          filename: "proceso_demo_001",
          size: 456,
          size_kb: 0.45,
          header_size: 196,
          data_size: 260,
          coffeeKg: 100,
          creationDate: "04-09-2025",
          processName: "Fermentación Natural Demo",
          recipeName: "Geisha Natural Premium",
          coffeeType: "Geisha",
          pressureType: "Natural (5 PSI)",
          comments: "Fermentación demo con excelente desarrollo de notas florales - 24 puntos, 72h",
          startTime: 1725600000,
          endTime: 1725859200,
          totalTime: 259200,
          totalPoints: 24,
          duration: "72h 0m",
          architecture: "separated",
          files: 2
        },
        {
          filename: "proceso_demo_002",
          size: 376,
          size_kb: 0.37,
          header_size: 196,
          data_size: 180,
          coffeeKg: 150,
          creationDate: "07-09-2025",
          processName: "Maceración Carbónica Demo",
          recipeName: "Bourbon Carbónico Especial",
          coffeeType: "Bourbon",
          pressureType: "Maceración Carbónica (8 PSI)",
          comments: "Proceso experimental con excelentes resultados en acidez controlada - 18 puntos, 96h",
          startTime: 1725513600,
          endTime: 1725859200,
          totalTime: 345600,
          totalPoints: 18,
          duration: "96h 0m",
          architecture: "separated",
          files: 2
        },
        {
          filename: "proceso_demo_003",
          size: 612,
          size_kb: 0.60,
          header_size: 196,
          data_size: 416,
          coffeeKg: 200,
          creationDate: "10-09-2025",
          processName: "Fermentación Controlada Demo",
          recipeName: "Caturra Tradicional",
          coffeeType: "Caturra",
          pressureType: "Natural (3 PSI)",
          comments: "Fermentación estándar con control de temperatura constante - 26 puntos, 48h",
          startTime: 1725686400,
          endTime: 1725859200,
          totalTime: 172800,
          totalPoints: 26,
          duration: "48h 0m",
          architecture: "separated",
          files: 2
        }
      ];

      // Aplicar filtros básicos en modo demo para testing
      if (filterParams) {
        const { attribute, value, dateFrom, dateTo } = filterParams;
        
        if (attribute === 'nombre' && value) {
          demoCurvas = demoCurvas.filter(curve => 
            curve.processName.toLowerCase().includes(value.toLowerCase())
          );
        } else if (attribute === 'tipo_proceso' && value && value !== '') {
          // En demo, simular filtrado por tipo de proceso basado en el pressureType
          demoCurvas = demoCurvas.filter(curve => {
            if (value === '1') return curve.pressureType.includes('Natural');
            if (value === '2') return curve.pressureType.includes('Carbónica');
            return true;
          });
        }
      }

      return {
        curvas: demoCurvas,
        total_curves: demoCurvas.length,
        total_files: demoCurvas.length * 2,
        total_size_bytes: demoCurvas.reduce((sum, curve) => sum + curve.size, 0),
        total_size_kb: parseFloat((demoCurvas.reduce((sum, curve) => sum + curve.size_kb, 0)).toFixed(2)),
        folder: "/curvas",
        architecture: "separated",
        timestamp: Date.now(),
        applied_filters: filterParams || null
      };
    }

    // Modo real - construir URL con parámetros de filtro
    let url = this.ENDPOINTS.filesCurvas;
    
    if (filterParams) {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros basados en el tipo de filtro
      if (filterParams.attribute) {
        queryParams.append('filter_type', filterParams.attribute);
        
        switch (filterParams.attribute) {
          case 'nombre':
            if (filterParams.value) {
              queryParams.append('name', filterParams.value);
            }
            break;
            
          case 'tipo_proceso':
            if (filterParams.value) {
              queryParams.append('process_type', filterParams.value);
            }
            break;
            
          case 'fecha':
            if (filterParams.dateFrom) {
              queryParams.append('date_from', filterParams.dateFrom);
            }
            if (filterParams.dateTo) {
              queryParams.append('date_to', filterParams.dateTo);
            }
            break;
        }
      }
      
      // Solo agregar query string si hay parámetros
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
        console.log('📡 URL con filtros construida:', url);
      }
    }

    return await this.makeRequest(url, {
      method: 'GET'
    });
  }

  async getRecetasFiles() {
    if (this.ApiDemoMode) {
      // Retornar archivos demo simulados de recetas con estructura similar a la API real
      console.log("🎭 Retornando archivos de recetas DEMO");
      return {
        recetas: [
          {
            filename: "geisha_premium_natural.dat",
            recipeName: "Geisha Premium Natural", 
            coffeeType: "Geisha",
            pressureType: "Natural",
            modo: 0,
            startTime: 1725600000,
            duration: "72h 0m",
            totalTime: 259200,
            etapas: 3,
            size_bytes: 2048,
            size_kb: 2.0,
            header_size: 128,
            data_size: 1920,
            created_date: "2025-09-06",
            created_time: "09:00:00"
          },
          {
            filename: "bourbon_carbonico_especial.dat",
            recipeName: "Bourbon Carbónico Especial",
            coffeeType: "Bourbon", 
            pressureType: "Maceración Carbónica",
            modo: 2,
            startTime: 1725513600,
            duration: "96h 0m",
            totalTime: 345600,
            etapas: 4,
            size_bytes: 2688,
            size_kb: 2.6,
            header_size: 128,
            data_size: 2560,
            created_date: "2025-09-05",
            created_time: "16:30:00"
          },
          {
            filename: "caturra_tradicional.dat",
            recipeName: "Caturra Tradicional",
            coffeeType: "Caturra",
            pressureType: "Natural", 
            modo: 1,
            startTime: 1725427200,
            duration: "48h 0m",
            totalTime: 172800,
            etapas: 2,
            size_bytes: 1408,
            size_kb: 1.4,
            header_size: 128,
            data_size: 1280,
            created_date: "2025-09-04",
            created_time: "11:45:00"
          },
          {
            filename: "personalizada_experimental.dat",
            recipeName: "Receta Experimental 001",
            coffeeType: "Mezcla",
            pressureType: "Mixta",
            modo: 0,
            startTime: 1725340800,
            duration: "120h 0m", 
            totalTime: 432000,
            etapas: 6,
            size_bytes: 3328,
            size_kb: 3.25,
            header_size: 128,
            data_size: 3200,
            created_date: "2025-09-03",
            created_time: "13:15:30"
          }
        ],
        total_recipes: 4,
        total_files: 8,
        total_size_bytes: 9472,
        total_size_kb: 9.25,
        folder: "/recetas",
        architecture: "separated",
        timestamp: Date.now()
      };
    }

    // Modo real - hacer request HTTP
    return await this.makeRequest(this.ENDPOINTS.filesRecetas, {
      method: 'GET'
    });
  }

  async getRecipeDetail(filename) {
    if (this.ApiDemoMode) {
      // Retornar detalle demo de receta
      console.log(`🎭 Retornando detalle DEMO para receta: ${filename}`);
      return {
        success: true,
        filename: filename,
        recipeName: filename.replace('.dat', '').replace(/_/g, ' '),
        coffeeType: "Geisha Demo",
        pressureType: "Natural",
        startTime: 1725600000,
        totalTime: 259200,
        totalPoints: 864,
        etapas: 3,
        modo: 0,
        checksum: 12345,
        duration: "72h 0m",
        setPoints: [
          {
            timestamp: 0,
            presion_setpoint: 5.0,
            tiempoAcumulado: 0,
            tiempoAcumulado_formatted: "0m",
            temp_setpoint: 25.0,
          },
          {
            timestamp: 3600,
            presion_setpoint: 6.0,
            tiempoAcumulado: 120,
            tiempoAcumulado_formatted: "29m",
            temp_setpoint: 26.0,
          },
          {
            timestamp: 7200,
            presion_setpoint: 5.5,
            tiempoAcumulado: 441,
            tiempoAcumulado_formatted: "1h 10m",
            temp_setpoint: 25.5,
          }
        ]
      };
    }

    // Modo real - hacer request HTTP
    const url = `${this.ENDPOINTS.recipeDetail}?filename=${encodeURIComponent(filename)}`;
    return await this.makeRequest(url, {
      method: 'GET'
    });
  }

  async getCurveDetail(filename) {
    if (this.ApiDemoMode) {
      // Retornar detalle demo de curva
      console.log(`🎭 Retornando detalle DEMO para curva: ${filename}`);
      return {
        success: true,
        filename: filename,
        processName: filename.replace('.dat', '').replace(/_/g, ' '),
        recipeName: "Receta Demo Natural",
        coffeeType: "Geisha Demo",
        pressureType: "Natural (5 PSI)",
        //nuevo campo de kilos de cafe 
        coffeeKg: 200,
        creationDate: "04-09-2025",
        comments: "Fermentación demo con excelentes resultados. Control de temperatura estable y desarrollo de acidez balanceada.",
        startTime: 1725600000,
        endTime: 1725859200,
        totalTime: 259200,
        totalPoints: 864,
        checksum: 54321,
        duration: "72h 0m",
        dataPoints: this._generateDemoCurveData(100)
      };
    }

    // Modo real - hacer request HTTP
    const url = `${this.ENDPOINTS.curveDetail}?filename=${encodeURIComponent(filename)}`;
    return await this.makeRequest(url, {
      method: 'GET'
    });
  }

  async deleteFile(filename) {
    try {
        console.log(`🗑️ Eliminando archivo: ${filename}`);
        if (this.ApiDemoMode) {
            console.log("🎭 Modo DEMO - simulando eliminación exitosa");
            return { success: true, message: "Archivo eliminado (simulado en DEMO)" };
        } else {
            const url = `${this.ENDPOINTS.deletefile}?path=${encodeURIComponent(filename)}`;
            const result = await this.makeRequest(url, {
                method: 'DELETE'
            });
            return result;
        }
    } catch (error) {
        console.error('❌ Error eliminando archivo:', error);
        return { success: false, message: `Error eliminando archivo: ${error.message}` };
    }
  }

  // ============ MÉTODO PARA CREAR NUEVA RECETA ============
  async createRecipe(recipeData) {
    try {
      console.log('📝 Creando nueva receta:', recipeData);
      
      if (this.ApiDemoMode) {
        console.log("🎭 Modo DEMO - simulando creación de receta");
        // Simular un delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          success: true, 
          filename: `${recipeData.recipeName}_${Date.now()}`,
          message: "Receta creada exitosamente (simulado en DEMO)" 
        };
      } else {
        const url = `${this.API_BASE_URL}/api/receta/create`;
        const result = await this.makeRequest(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recipeData)
        });
        return result;
      }
    } catch (error) {
      console.error('❌ Error creando receta:', error);
      return { 
        success: false, 
        error: `Error creando receta: ${error.message}` 
      };
    }
  }

  // ============ MÉTODO PARA INICIAR PROCESO AUTOMÁTICO ============
  async startAutomaticProcess(filename) {
    if (this.ApiDemoMode) {
      // Modo demo - simular respuesta exitosa
      console.log(`🎭 DEMO: Iniciando proceso automático para receta: ${filename}`);
      return {
        success: true,
        message: "Iniciando receta automática (DEMO)",
        filename: filename,
        timestamp: Date.now()
      };
    }

    // Modo real - hacer request HTTP
    const url = `${this.API_BASE_URL}/api/process/start-automatic?filename=${encodeURIComponent(filename)}`;
    return await this.makeRequest(url, {
      method: 'POST'
    });
  }

  // ============ MÉTODO PARA ACTUALIZAR DATOS DE PROCESO ============
  async updateProcessData(processData) {
    if (this.ApiDemoMode) {
      console.log("🎭 Modo DEMO: Simulando actualización de datos de proceso");
      console.log("📋 Datos DEMO recibidos:", processData);
      return {
        success: true,
        message: "Datos del proceso actualizados en modo DEMO",
        data: processData,
        timestamp: Date.now()
      };
    }

    // Modo real - hacer request HTTP
    console.log("📤 Enviando datos de proceso al backend:", processData);
    return await this.makeRequest(this.ENDPOINTS.updateProcess, {
      method: 'PUT',
      body: JSON.stringify(processData)
    });
  }

  // ============ MÉTODO PARA ACTUALIZAR DATOS DE RECETA ============
  async updateRecipeData(recipeData) {
    if (this.ApiDemoMode) {
      console.log("🎭 Modo DEMO: Simulando actualización de datos de receta");
      console.log("📋 Datos DEMO recibidos:", recipeData);
      return {
        success: true,
        message: "Datos de la receta actualizados en modo DEMO",
        data: recipeData,
        timestamp: Date.now()
      };
    }

    // Modo real - hacer request HTTP
    console.log("📤 Enviando datos de receta al backend:", recipeData);
    return await this.makeRequest(this.ENDPOINTS.updateRecipe, {
      method: 'PUT',
      body: JSON.stringify(recipeData)
    });
  }

  // ============ MÉTODO PARA CONFIGURAR FECHA EN Microcontrolador ============
  async setCurrentDate(dateString) {
    if (this.ApiDemoMode) {
      // En modo demo, simular configuración exitosa
      console.log("🎭 Simulando configuración de fecha en modo DEMO:", dateString);
      return {
        success: true,
        message: "Fecha configurada correctamente (DEMO)",
        date: dateString,
        formatted: dateString
      };
    }

    // Modo real - enviar fecha al Microcontrolador
    console.log("📅 Enviando fecha actual al Microcontrolador:", dateString);
    
    const dateData = {
      fecha: dateString,
      timestamp: Date.now()
    };

    return await this.makeRequest(this.ENDPOINTS.setDate, {
      method: 'POST',
      body: JSON.stringify(dateData)
    });
  }

  // ============ MÉTODO PARA OBTENER FECHA DE CALIBRACIÓN ============
  async getCalibrationDate() {
    if (this.ApiDemoMode) {
      console.log('🎭 Obteniendo fecha de calibración DEMO');
      
      // Simular diferentes escenarios en modo demo
      const scenarios = [
        { success: true, fecha: "10-12-2024", tipo: "ph_bajo" }, // 6 días atrás (mostrará notificación)
        { success: true, fecha: "14-12-2024", tipo: "ph_medio" }, // 2 días atrás (no mostrará notificación)
        { success: true, fecha: "", tipo: "" } // Sin calibración
      ];
      
      // Elegir escenario aleatoriamente o usar el primero para testing
      const scenario = scenarios[0]; // Cambiar por scenarios[Math.floor(Math.random() * scenarios.length)] para aleatorio
      
      return scenario;
    }
    
    // Modo real - hacer request HTTP
    console.log("📅 Obteniendo fecha de calibración del Microcontrolador");
    return await this.makeRequest(this.ENDPOINTS.calibrationDate, {
      method: 'GET'
    });
  }

  // ============ MÉTODO PARA CONFIGURAR WIFI EN Microcontrolador ============
  async setWiFiConfig(ssid = null, password = null) {
    // Validar que al menos uno de los parámetros esté presente
    if (!ssid && !password) {
      throw new Error("Debe proporcionar al menos SSID o contraseña");
    }

    // Validar SSID si se proporciona
    if (ssid && (ssid.length < 1 || ssid.length > 32)) {
      throw new Error("El SSID debe tener entre 1 y 32 caracteres");
    }

    // Validar contraseña si se proporciona
    if (password && (password.length < 8 || password.length > 63)) {
      throw new Error("La contraseña debe tener entre 8 y 63 caracteres");
    }

    if (this.ApiDemoMode) {
      // En modo demo, simular configuración exitosa
      console.log("🎭 Simulando configuración de WiFi en modo DEMO:", { ssid, password: password ? "***" : null });
      return {
        success: true,
        message: "Configuración WiFi actualizada correctamente (DEMO)",
        ssid: ssid || "ICUZ_DEMO",
        restarted: true
      };
    }

    // Modo real - enviar configuración WiFi al Microcontrolador
    console.log("📡 Enviando configuración WiFi al Microcontrolador:", { ssid, password: password ? "***" : null });

    const wifiData = {};
    if (ssid) wifiData.ssid = ssid;
    if (password) wifiData.password = password;

    return await this.makeRequest(this.ENDPOINTS.wifiConfig, {
      method: 'POST',
      body: JSON.stringify(wifiData)
    });
  }

  // ============ MÉTODOS PARA WIFI EXTERNO ============
  async scanWiFiNetworks() {
    if (this.ApiDemoMode) {
      // Datos demo para escaneo WiFi
      console.log("🎭 Datos demo para escaneo WiFi");
      return {
        success: true,
        count: 3,
        timestamp: Date.now(),
        networks: [
          {
            ssid: "WiFi_Casa_Demo",
            rssi: -45,
            channel: 6,
            encryption: "WPA2-PSK",
            bssid: "AA:BB:CC:DD:EE:FF",
            quality: 90,
            open: false
          },
          {
            ssid: "Red_Abierta_Demo",
            rssi: -65,
            channel: 11,
            encryption: "Abierta",
            bssid: "11:22:33:44:55:66",
            quality: 60,
            open: true
          },
          {
            ssid: "Oficina_Demo",
            rssi: -78,
            channel: 1,
            encryption: "WPA3-PSK",
            bssid: "99:88:77:66:55:44",
            quality: 35,
            open: false
          }
        ]
      };
    }

    // Modo real - hacer request HTTP con timeout extendido
    console.log("📡 Escaneando redes WiFi disponibles...");
    return await this.makeRequest(this.ENDPOINTS.wifiScan, {
      method: 'GET'
    }, 30000); // 30 segundos timeout para escaneo WiFi
  }

  async connectToWiFiNetwork(ssid, password = "", save = true) {
    if (this.ApiDemoMode) {
      console.log(`🎭 Conexión demo a red: ${ssid}`);
      return {
        success: true,
        ssid: ssid,
        message: "Conectado exitosamente (DEMO)",
        ip: "192.168.1.100",
        config_saved: save,
        timestamp: Date.now()
      };
    }

    // Modo real - conectar a red WiFi
    console.log(`🔌 Conectando a red WiFi: ${ssid}`);
    
    const connectionData = {
      ssid: ssid,
      password: password,
      save: save
    };

    return await this.makeRequest(this.ENDPOINTS.wifiConnect, {
      method: 'POST',
      body: JSON.stringify(connectionData)
    });
  }

  async disconnectFromWiFiNetwork() {
    if (this.ApiDemoMode) {
      console.log("🎭 Desconexión demo de red WiFi");
      return {
        success: true,
        message: "Desconectado exitosamente (DEMO)",
        timestamp: Date.now()
      };
    }

    // Modo real - desconectar de red WiFi
    console.log("🔌 Desconectando de red WiFi externa...");
    
    return await this.makeRequest(this.ENDPOINTS.wifiDisconnect, {
      method: 'POST'
    });
  }

  async getWiFiStatus() {
    if (this.ApiDemoMode) {
      console.log("🎭 Estado demo de conexiones WiFi");
      return {
        success: true,
        ap: {
          enabled: true,
          ssid: "ICUZ_DEMO",
          ip: "192.168.4.1",
          clients: 1
        },
        sta: {
          enabled: false,
          connected: false,
          ssid: "",
          ip: "",
          rssi: 0
        },
        timestamp: Date.now()
      };
    }

    // Modo real - obtener estado WiFi
    console.log("📊 Obteniendo estado de conexiones WiFi...");
    
    return await this.makeRequest(this.ENDPOINTS.wifiStatus, {
      method: 'GET'
    });
  }

  // ============ MÉTODO PARA OBTENER LOGS DEL SISTEMA ============
  async getLogs() {
    // Nota: El backend limita la respuesta a los últimos 150 logs para optimizar memoria
    if (this.ApiDemoMode) {
      console.log("🎭 Obteniendo logs del sistema DEMO");
      
      // Generar logs demo realistas
      const demoLogs = [
        {
          timestamp: Date.now() - 300000, // 5 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 1001,
          message: "[12:30:45] Proceso manual iniciado exitosamente. Nombre: proceso_1703001234",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 240000, // 4 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 2001,
          message: "[12:31:15] CMD_control_temperatura: 1",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 180000, // 3 minutos atrás
          level: "WARN",
          category: "SENSOR",
          code: 2010,
          message: "[12:32:00] Temperatura fuera de rango: 32.5",
          level_num: 2,
          category_num: 2
        },
        {
          timestamp: Date.now() - 120000, // 2 minutos atrás
          level: "INFO",
          category: "NETWORK",
          code: 1030,
          message: "[12:32:45] Cliente conectado: 192.168.4.2",
          level_num: 1,
          category_num: 3
        },
        {
          timestamp: Date.now() - 60000, // 1 minuto atrás
          level: "INFO",
          category: "STORAGE",
          code: 1040,
          message: "[12:33:30] Cache datos escrito: 10 puntos",
          level_num: 1,
          category_num: 4
        },
        {
          timestamp: Date.now() - 30000, // 30 segundos atrás
          level: "ERROR",
          category: "SENSOR",
          code: 2020,
          message: "[12:34:15] Sensor pH no responde",
          level_num: 3,
          category_num: 2
        },
        {
          timestamp: Date.now() - 10000, // 10 segundos atrás
          level: "INFO",
          category: "SYSTEM",
          code: 3002,
          message: "[12:34:35] Fecha del sistema configurada. Timestamp: 1703001234567",
          level_num: 1,
          category_num: 0
        },
        {
          timestamp: Date.now() - 300000, // 5 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 1001,
          message: "[12:30:45] Proceso manual iniciado exitosamente. Nombre: proceso_1703001234",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 240000, // 4 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 2001,
          message: "[12:31:15] CMD_control_temperatura: 1",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 180000, // 3 minutos atrás
          level: "WARN",
          category: "SENSOR",
          code: 2010,
          message: "[12:32:00] Temperatura fuera de rango: 32.5",
          level_num: 2,
          category_num: 2
        },
        {
          timestamp: Date.now() - 120000, // 2 minutos atrás
          level: "INFO",
          category: "NETWORK",
          code: 1030,
          message: "[12:32:45] Cliente conectado: 192.168.4.2",
          level_num: 1,
          category_num: 3
        },
        {
          timestamp: Date.now() - 60000, // 1 minuto atrás
          level: "INFO",
          category: "STORAGE",
          code: 1040,
          message: "[12:33:30] Cache datos escrito: 10 puntos",
          level_num: 1,
          category_num: 4
        },
        {
          timestamp: Date.now() - 30000, // 30 segundos atrás
          level: "ERROR",
          category: "SENSOR",
          code: 2020,
          message: "[12:34:15] Sensor pH no responde",
          level_num: 3,
          category_num: 2
        },
        {
          timestamp: Date.now() - 10000, // 10 segundos atrás
          level: "INFO",
          category: "SYSTEM",
          code: 3002,
          message: "[12:34:35] Fecha del sistema configurada. Timestamp: 1703001234567",
          level_num: 1,
          category_num: 0
        },
        {
          timestamp: Date.now() - 300000, // 5 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 1001,
          message: "[12:30:45] Proceso manual iniciado exitosamente. Nombre: proceso_1703001234",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 240000, // 4 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 2001,
          message: "[12:31:15] CMD_control_temperatura: 1",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 180000, // 3 minutos atrás
          level: "WARN",
          category: "SENSOR",
          code: 2010,
          message: "[12:32:00] Temperatura fuera de rango: 32.5",
          level_num: 2,
          category_num: 2
        },
        {
          timestamp: Date.now() - 120000, // 2 minutos atrás
          level: "INFO",
          category: "NETWORK",
          code: 1030,
          message: "[12:32:45] Cliente conectado: 192.168.4.2",
          level_num: 1,
          category_num: 3
        },
        {
          timestamp: Date.now() - 60000, // 1 minuto atrás
          level: "INFO",
          category: "STORAGE",
          code: 1040,
          message: "[12:33:30] Cache datos escrito: 10 puntos",
          level_num: 1,
          category_num: 4
        },
        {
          timestamp: Date.now() - 30000, // 30 segundos atrás
          level: "ERROR",
          category: "SENSOR",
          code: 2020,
          message: "[12:34:15] Sensor pH no responde",
          level_num: 3,
          category_num: 2
        },
        {
          timestamp: Date.now() - 10000, // 10 segundos atrás
          level: "INFO",
          category: "SYSTEM",
          code: 3002,
          message: "[12:34:35] Fecha del sistema configurada. Timestamp: 1703001234567",
          level_num: 1,
          category_num: 0
        },
        {
          timestamp: Date.now() - 300000, // 5 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 1001,
          message: "[12:30:45] Proceso manual iniciado exitosamente. Nombre: proceso_1703001234",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 240000, // 4 minutos atrás
          level: "INFO",
          category: "PROCESS",
          code: 2001,
          message: "[12:31:15] CMD_control_temperatura: 1",
          level_num: 1,
          category_num: 1
        },
        {
          timestamp: Date.now() - 180000, // 3 minutos atrás
          level: "WARN",
          category: "SENSOR",
          code: 2010,
          message: "[12:32:00] Temperatura fuera de rango: 32.5",
          level_num: 2,
          category_num: 2
        },
        {
          timestamp: Date.now() - 120000, // 2 minutos atrás
          level: "INFO",
          category: "NETWORK",
          code: 1030,
          message: "[12:32:45] Cliente conectado: 192.168.4.2",
          level_num: 1,
          category_num: 3
        },
        {
          timestamp: Date.now() - 60000, // 1 minuto atrás
          level: "INFO",
          category: "STORAGE",
          code: 1040,
          message: "[12:33:30] Cache datos escrito: 10 puntos",
          level_num: 1,
          category_num: 4
        },
        {
          timestamp: Date.now() - 30000, // 30 segundos atrás
          level: "ERROR",
          category: "SENSOR",
          code: 2020,
          message: "[12:34:15] Sensor pH no responde",
          level_num: 3,
          category_num: 2
        },
        {
          timestamp: Date.now() - 10000, // 10 segundos atrás
          level: "INFO",
          category: "SYSTEM",
          code: 3002,
          message: "[12:34:35] Fecha del sistema configurada. Timestamp: 1703001234567",
          level_num: 1,
          category_num: 0
        }
      ];

      return {
        logs: demoLogs,
        total_logs_stored: demoLogs.length,
        logs_returned: demoLogs.length,
        timestamp_global: "1703001234",
        sistema_iniciado: Date.now() - 3600000, // 1 hora atrás
        log_start_time: Date.now() - 3600000,
        log_version: 1,
        system_info: "ZENIT_ICUZ_DEMO"
      };
    }

    // Modo real - hacer request HTTP
    console.log("📋 Obteniendo logs del sistema...");
    return await this.makeRequest(this.ENDPOINTS.logs, {
      method: 'GET'
    });
  }

  // ============ MÉTODOS HELPER PARA DATOS DEMO ============
  
  _generateDemoGraphData(numPoints) {
    const data = {
      temperatura_masa: [],
      temperatura_lixiviados: [],
      presion: [],
      ph: [],
      timestamps: []
    };

    const now = new Date();
    
    for (let i = 0; i < numPoints; i++) {
      // Generar timestamp hacia atrás (cada 10 minutos)
      const timestamp = new Date(now - (numPoints - i) * 10 * 60 * 1000);
      data.timestamps.push(timestamp.toISOString().slice(0, 19).replace('T', ' '));

      // Generar valores realistas con algo de tendencia
      const baseTemp = 25 + Math.sin(i * 0.1) * 3; // Oscilación suave
      const basePressure = 50 + Math.sin(i * 0.05) * 10; // Oscilación más lenta
      const basePh = 3.55 + Math.sin(i * 0.03) * 0.1; // Oscilación muy pequeña

      data.temperatura_masa.push(
        parseFloat((baseTemp + (Math.random() - 0.5) * 2).toFixed(1))
      );
      data.temperatura_lixiviados.push(
        parseFloat((baseTemp + 0.5 + (Math.random() - 0.5) * 2).toFixed(1))
      );
      data.presion.push(
        parseFloat((basePressure + (Math.random() - 0.5) * 5).toFixed(1))
      );
      data.ph.push(
        parseFloat((basePh + (Math.random() - 0.5) * 0.1).toFixed(2))
      );
    }

    return data;
  }

  _generateDemoGraphDataByType(type, numPoints) {
    const ranges = {
      temperatura_masa: { min: 20, max: 32 },
      temperatura_lixiviados: { min: 20, max: 32 },
      presion: { min: 35, max: 65 },
      ph: { min: 3.4, max: 3.7 }
    };

    const range = ranges[type];
    if (!range) return [];

    const data = [];
    for (let i = 0; i < numPoints; i++) {
      const value = parseFloat((
        Math.random() * (range.max - range.min) + range.min
      ).toFixed(type === 'ph' ? 2 : 1));
      data.push(value);
    }

    return data;
  }

  _generateDemoCurveData(numPoints) {
    const data = [];
    
    for (let i = 0; i < numPoints; i++) {
      // Simular evolución realista durante la fermentación
      const progress = i / numPoints;
      
      // Temperatura masa: comienza en 25°C, sube gradualmente hasta 30°C, luego se estabiliza
      const tempMasaBase = 25 + (progress < 0.3 ? progress * 16.7 : 5);
      const temp_masa = parseFloat((tempMasaBase + (Math.random() - 0.5) * 2).toFixed(1));
      
      // Temperatura lixiviados: similar pero ligeramente más baja
      const tempLixBase = 24 + (progress < 0.3 ? progress * 13.3 : 4);
      const temp_lixiviados = parseFloat((tempLixBase + (Math.random() - 0.5) * 2).toFixed(1));
      
      // Presión: aumenta gradualmente y luego se estabiliza
      const presionBase = 35 + (progress < 0.5 ? progress * 30 : 15);
      const presion = parseFloat((presionBase + (Math.random() - 0.5) * 5).toFixed(1));
      
      // pH: disminuye gradualmente de 3.7 a 3.4
      const phBase = 3.7 - (progress * 0.3);
      const ph = parseFloat((phBase + (Math.random() - 0.5) * 0.1).toFixed(2));
      
      data.push({
        temp_masa,
        temp_lixiviados,
        presion,
        ph,
        timestamp: Date.now() - ((numPoints - i) * 300000) // Cada punto cada 5 minutos
      });
    }
    
    return data;
  }
}

// ============ FUNCIONES PRINCIPALES HTTP POLLING ============

function initHttpPolling() {
    const tiempoAhora = Date.now();
    console.log(`🚀 Iniciando HTTP Polling - ${new Date(tiempoAhora).toLocaleString()}`);
    
    setInitialStateValues();
    startPolling();
}
function setInitialStateValues() {
  if (typeof resetAppState === 'function') {
    resetAppState();
  } else {
    console.warn('resetAppState no está disponible - usando fallback');
    if (window.state) {
      Object.assign(window.state, {
        temperature: 0,
        temperatureLix: 0,
        tempLixSetpoint: 27,
        pressure: 0,
        pressureSetpoint: 50,
        ph: 0,
        phSetpoint: 7.0,
        isAutomatic: false,
        isManual: true,
        tiempo_horas: 0,
        tiempo_minutos: 0,
        temperatura_sp: 0,
        grafica_temperatura_masa: [],
        grafica_temperatura_lixiviados: [],
        grafica_presion: [],
        grafica_ph: [],
        users: [],
        wifiNetworks: [],
        recirculacion: false,
        presion_natural: false,
        maceracion: false,
        control_temperatura: false,
        modalFunction: function () {}
      });
    }
  }
}

function startPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  console.log(`🚀 Iniciando HTTP polling cada ${POLLING_CONFIG.interval}ms`);
  
  // Primera petición inmediata
  pollSensorData();
  
  // Configurar polling periódico
  pollingInterval = setInterval(pollSensorData, POLLING_CONFIG.interval);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("⏹️ HTTP polling detenido");
  }
}
async function pollSensorData() {
  // Si hay bloqueo por interacción del usuario, omitir actualización
  if (userInteractionLock) {
    console.log("🔒 Polling pausado - modal abierto");
    return;
  }

  try {
    const data = await apiManager.getSensorData();

    // Procesar datos como en WebSocket (mantener compatibilidad)
    const webSocketData = {
      automatic_updates: {
        presion: data.presion,
        temperatura_masa: data.temperatura_masa,
        temperatura_lixiviados: data.temperatura_lixiviados,
        pH: data.pH,
        setpoint_presion: data.setpoint_presion,
        setpoint_temperatura: data.setpoint_temperatura,
        recirculacion: data.recirculacion,
        presion_natural: data.presion_natural,
        maceracion: data.maceracion,
        control_temperatura: data.control_temperatura,
        start: data.start,
        tiempo_horas: data.tiempo_horas,
        tiempo_minutos: data.tiempo_minutos,
        temperatura_sp: data.temperatura_sp || 0,
        modo: data.modo, //0 manual, 1 automatico
        etapa: data.etapa ? data.etapa : 0,
        total_etapas: data.total_etapas ? data.total_etapas : 0,
        nombre_ultimo_proceso: data.nombre_ultimo_proceso ? data.nombre_ultimo_proceso : "",
        wifi_sta_connected: data.wifi_sta_connected ? data.wifi_sta_connected: false,
        ssid_sta: data.ssid_sta ? data.ssid_sta: null
      }
    };

    const button = document.getElementById("connection-indicator-extern");
    const connectionDot = button.querySelector(".connection-dot");
    const externalWifiStatus = document.getElementById("external-wifi-status");
    if (data.wifi_sta_connected) {
      button.classList.remove("offline");
      button.classList.add("online");
      connectionDot.innerHTML = `
        <path d="M0 7L1.17157 5.82843C2.98259 4.01741 5.43884 3 8 3C10.5612 3 13.0174 4.01742 14.8284 5.82843L16 7L14.5858 8.41421L13.4142 7.24264C11.9783 5.8067 10.0307 5 8 5C5.96928 5 4.02173 5.8067 2.58579 7.24264L1.41421 8.41421L0 7Z" fill="currentColor"/>
        <path d="M4.24264 11.2426L2.82843 9.82843L4 8.65685C5.06086 7.59599 6.49971 7 8 7C9.50029 7 10.9391 7.59599 12 8.65686L13.1716 9.82843L11.7574 11.2426L10.5858 10.0711C9.89999 9.38527 8.96986 9 8 9C7.03014 9 6.1 9.38527 5.41421 10.0711L4.24264 11.2426Z" fill="currentColor"/>
        <path d="M8 15L5.65685 12.6569L6.82842 11.4853C7.13914 11.1746 7.56057 11 8 11C8.43942 11 8.86085 11.1746 9.17157 11.4853L10.3431 12.6569L8 15Z" fill="currentColor"/>
      `;
      connectionDot.setAttribute("viewBox", "0 0 16 16");
      connectionDot.setAttribute("width", "20");
      connectionDot.setAttribute("height", "20");
      externalWifiStatus.textContent = `${data.ssid_sta}`;
    } else {
      button.classList.remove("online");
      button.classList.add("offline");
      connectionDot.innerHTML = `
          <path d="M13 16H16L3 0H0L3.38948 4.17167C2.58157 4.61063 1.83348 5.16652 1.17157 5.82842L0 7L1.41421 8.41421L2.58579 7.24264C3.20071 6.62772 3.90945 6.12819 4.67837 5.75799L5.98803 7.36989C5.24898 7.65114 4.56994 8.08691 4 8.65685L2.82843 9.82842L4.24264 11.2426L5.41421 10.0711C5.94688 9.5384 6.62695 9.18703 7.35855 9.05668L8.9375 11H8.00355L8 11C7.56057 11 7.13914 11.1746 6.82842 11.4853L5.65685 12.6568L8 15L10.3103 12.6897L13 16Z" fill="currentColor"/>
          <path d="M10.3673 5.37513C11.5055 5.74521 12.5521 6.38051 13.4142 7.24264L14.5858 8.41421L16 7L14.8284 5.82842C13.1228 4.12278 10.8448 3.12107 8.44586 3.01028L10.3673 5.37513Z" fill="currentColor"/>
        `;
        connectionDot.setAttribute("viewBox", "0 0 16 16");
        connectionDot.setAttribute("width", "20");
        connectionDot.setAttribute("height", "20");
        externalWifiStatus.textContent = `Wifi externo`;
    }

    if (window.state.start !== data.start) {
        if (data.start) {
            if (typeof resumeAutoRefresh === 'function') {
                resumeAutoRefresh();
            } else {
                console.warn('⚠️ Función resumeAutoRefresh no disponible');
            }
        } else {
            if (typeof pauseAutoRefresh === 'function') {
                pauseAutoRefresh();
            } else {
                console.warn('⚠️ Función pauseAutoRefresh no disponible');
            }
        }
    }

    // Actualizar UI usando las funciones existentes de WebSocket
    updateUIElements(webSocketData);
    updateConnectionStatus(true);

  } catch (error) {
    updateConnectionStatus(false);
    console.error("❌ Error en polling:", error);
  }
}


// Funciones para bloqueo de actualización durante interacción del usuario

function lockUserInteraction() {
  userInteractionLock = true;
  console.log("🔒 Actualizaciones pausadas: modal abierto");
}

function unlockUserInteraction() {
  userInteractionLock = false;
  console.log("🔓 Actualizaciones reanudadas: modal cerrado");
}


// ============ Actualizar elementos de la UI ============
function updateUIElements(data) {
  

  // Si recibe actualizaciones automaticas actualiza dashboard
  if (data.automatic_updates) {
    if (userInteractionLock) {
      console.log("Actualizaciones pausadas: usuario interactuando");
      // Solo actualizar datos de sensores, no los controles
      updateSensorDataOnly(data);
      return;
    }
    // Actualiza state del dashboard
    updateDashboardState(data);
    // Actualiza estado del proceso
    updateProcessButtons();
    updateProcessState(data);
    // Deshabilita botones de control
    disableControlButtons(data);
    // Actualiza elementos UI con valores de state 
    updateControlVariables();
    upateTemperature();
    updateTimer();
    updateIndicators();
  }

  // Actualiza state de USERS
    if (data.users) {
      state.users = data.users;
      renderUserTable();
    }

  // Actualiza state de graficas
  if (data.grafica_temperatura_masa) {
    state.grafica_temperatura_masa = data.grafica_temperatura_masa;
    actualizarGrafica();
  }
  if (data.grafica_temperatura_lixiviados) {
    state.grafica_temperatura_lixiviados = data.grafica_temperatura_lixiviados;
    actualizarGrafica();
  }
  if (data.grafica_presion) {
    state.grafica_presion = data.grafica_presion;
    actualizarGrafica();
  }
  if (data.grafica_ph) {
    state.grafica_ph = data.grafica_ph;
    actualizarGrafica();
  }
  

  // Agrega puntos individuales a la grafica
  if (
      data.automatic_updates_grafica &&
      state.grafica_ph.length > 0 &&
      state.grafica_temperatura_masa.length > 0 &&
      state.grafica_temperatura_lixiviados.length > 0 &&
      state.grafica_presion.length > 0
    ) {
    state.grafica_ph.push(data.automatic_updates_grafica.new_data_ph);
    state.grafica_temperatura_masa.push(data.automatic_updates_grafica.new_data_temperatura_masa);
    state.grafica_temperatura_lixiviados.push(data.automatic_updates_grafica.new_data_temperatura_lixiviados);
    state.grafica_presion.push(data.automatic_updates_grafica.new_data_presion);
    actualizarGrafica();
  }
}

function updateSensorDataOnly(data) {
  // Solo actualizar valores de sensores, no controles
  if (data.automatic_updates) {
    state.temperature = data.automatic_updates.temperatura_masa;
    state.temperatureLix = data.automatic_updates.temperatura_lixiviados;
    state.pressure = data.automatic_updates.presion;
    state.ph = data.automatic_updates.pH;
  }
}

function updateConnectionStatus(connected) {
  const button = document.getElementById("connection-indicator");
  const buttonExtern = document.getElementById("connection-indicator-extern");
  const externalWifiStatus = document.getElementById("external-wifi-status");
  const connectionDotExtern = buttonExtern.querySelector(".connection-dot");

  if (button) {
    const connectionDot = button.querySelector(".connection-dot");
    
    if (connected && !isDemoMode) {
      button.classList.remove("offline");
      button.classList.add("online");
      
      // Cambiar al icono WiFi conectado
      if (connectionDot) {
        connectionDot.innerHTML = `
          <path d="M0 7L1.17157 5.82843C2.98259 4.01741 5.43884 3 8 3C10.5612 3 13.0174 4.01742 14.8284 5.82843L16 7L14.5858 8.41421L13.4142 7.24264C11.9783 5.8067 10.0307 5 8 5C5.96928 5 4.02173 5.8067 2.58579 7.24264L1.41421 8.41421L0 7Z" fill="currentColor"/>
          <path d="M4.24264 11.2426L2.82843 9.82843L4 8.65685C5.06086 7.59599 6.49971 7 8 7C9.50029 7 10.9391 7.59599 12 8.65686L13.1716 9.82843L11.7574 11.2426L10.5858 10.0711C9.89999 9.38527 8.96986 9 8 9C7.03014 9 6.1 9.38527 5.41421 10.0711L4.24264 11.2426Z" fill="currentColor"/>
          <path d="M8 15L5.65685 12.6569L6.82842 11.4853C7.13914 11.1746 7.56057 11 8 11C8.43942 11 8.86085 11.1746 9.17157 11.4853L10.3431 12.6569L8 15Z" fill="currentColor"/>
        `;
        connectionDot.setAttribute("viewBox", "0 0 16 16");
        connectionDot.setAttribute("width", "20");
        connectionDot.setAttribute("height", "20");
      }
      
      const connectionTexts = button.querySelectorAll(".connection-text");
      connectionTexts.forEach((text) => {
        text.classList.remove("offline");
        text.classList.add("online");
      });

      // Mostrar formulario WiFi cuando esté conectado
      showWiFiConfigPanel();
    } else {
      button.classList.remove("online");
      button.classList.add("offline");

      buttonExtern.classList.remove("online");
      buttonExtern.classList.add("offline");
      
      // Cambiar al icono WiFi desconectado (tachado)
      if (connectionDot) {
        connectionDot.innerHTML = `
          <path d="M13 16H16L3 0H0L3.38948 4.17167C2.58157 4.61063 1.83348 5.16652 1.17157 5.82842L0 7L1.41421 8.41421L2.58579 7.24264C3.20071 6.62772 3.90945 6.12819 4.67837 5.75799L5.98803 7.36989C5.24898 7.65114 4.56994 8.08691 4 8.65685L2.82843 9.82842L4.24264 11.2426L5.41421 10.0711C5.94688 9.5384 6.62695 9.18703 7.35855 9.05668L8.9375 11H8.00355L8 11C7.56057 11 7.13914 11.1746 6.82842 11.4853L5.65685 12.6568L8 15L10.3103 12.6897L13 16Z" fill="currentColor"/>
          <path d="M10.3673 5.37513C11.5055 5.74521 12.5521 6.38051 13.4142 7.24264L14.5858 8.41421L16 7L14.8284 5.82842C13.1228 4.12278 10.8448 3.12107 8.44586 3.01028L10.3673 5.37513Z" fill="currentColor"/>
        `;
        connectionDot.setAttribute("viewBox", "0 0 16 16");
        connectionDot.setAttribute("width", "20");
        connectionDot.setAttribute("height", "20");
      }
      
      const connectionTexts = button.querySelectorAll(".connection-text");
      connectionTexts.forEach((text) => {
        //remueve la clase online
        text.classList.remove("online");
        text.classList.add("offline");
      });


      buttonExtern.classList.remove("online");
      buttonExtern.classList.add("offline");
      connectionDotExtern.innerHTML = `
      <path d="M13 16H16L3 0H0L3.38948 4.17167C2.58157 4.61063 1.83348 5.16652 1.17157 5.82842L0 7L1.41421 8.41421L2.58579 7.24264C3.20071 6.62772 3.90945 6.12819 4.67837 5.75799L5.98803 7.36989C5.24898 7.65114 4.56994 8.08691 4 8.65685L2.82843 9.82842L4.24264 11.2426L5.41421 10.0711C5.94688 9.5384 6.62695 9.18703 7.35855 9.05668L8.9375 11H8.00355L8 11C7.56057 11 7.13914 11.1746 6.82842 11.4853L5.65685 12.6568L8 15L10.3103 12.6897L13 16Z" fill="currentColor"/>
      <path d="M10.3673 5.37513C11.5055 5.74521 12.5521 6.38051 13.4142 7.24264L14.5858 8.41421L16 7L14.8284 5.82842C13.1228 4.12278 10.8448 3.12107 8.44586 3.01028L10.3673 5.37513Z" fill="currentColor"/>
      `;
      connectionDotExtern.setAttribute("viewBox", "0 0 16 16");
      connectionDotExtern.setAttribute("width", "20");
      connectionDotExtern.setAttribute("height", "20");
      externalWifiStatus.textContent = `Wifi externo`;

      // Ocultar formulario WiFi y mostrar mensaje de desconexión
      if (isDemoMode) {
        showWiFiConfigPanel();
      } else {
        showWiFiDisconnectedMessage();
      }
    }
  }
}

// ============ FUNCIONES PARA GESTIÓN DE PANEL WIFI ============
function showWiFiConfigPanel() {
  const wifiConfigPanel = document.querySelector('.wifi-config-panel');
  const wifiInfoPanel = document.querySelector('.wifi-info-panel');
  const wifiNetworksPanel = document.getElementById('wifiNetworksPanel');
  const wifiNetworksFormPanel = document.getElementById('wifiNetworksFormPanel');
  const wifiDisconnectedMessage = document.getElementById('wifiDisconnectedMessage');

  if (wifiConfigPanel) {
    wifiConfigPanel.style.display = 'block';
  }

  if (wifiNetworksFormPanel) {
    wifiNetworksFormPanel.style.display = 'block';
  }

  if (wifiInfoPanel) {
    wifiInfoPanel.style.di
    splay = 'block';
  }
  if (wifiNetworksPanel) {
    wifiNetworksPanel.style.display = 'block';
  }

  // Mostrar panel de redes disponibles cuando hay conexión
  if (wifiNetworksPanel && typeof showWiFiNetworksPanel === 'function') {
    showWiFiNetworksPanel();
  }

  if (wifiDisconnectedMessage) {
    wifiDisconnectedMessage.style.display = 'none';
  }
}

function showWiFiDisconnectedMessage() {
  const wifiConfigPanel = document.querySelector('.wifi-config-panel');
  const wifiInfoPanel = document.querySelector('.wifi-info-panel');
  const wifiNetworksPanel = document.getElementById('wifiNetworksPanel');
  const wifiNetworksFormPanel = document.getElementById('wifiNetworksFormPanel');
  let wifiDisconnectedMessage = document.getElementById('wifiDisconnectedMessage');

  // Ocultar paneles de configuración y redes
  if (wifiNetworksFormPanel) {
    wifiNetworksFormPanel.style.display = 'none';
  }
  if (wifiConfigPanel) {
    wifiConfigPanel.style.display = 'none';
  }
  
  if (wifiInfoPanel) {
    wifiInfoPanel.style.display = 'none';
  }

  if (wifiNetworksPanel) {
    wifiNetworksPanel.style.display = 'none';
  }

  // Crear mensaje de desconexión si no existe
  if (!wifiDisconnectedMessage) {
    const conexionesDiv = document.getElementById('conexiones');
    if (conexionesDiv) {
      wifiDisconnectedMessage = document.createElement('div');
      wifiDisconnectedMessage.id = 'wifiDisconnectedMessage';
      wifiDisconnectedMessage.className = 'panel wifi-disconnected-panel';
      wifiDisconnectedMessage.innerHTML = `
        <div class="wifi-disconnected-content">
          <p class="wifi-disconnected-description">
            El dispositivo no está conectado a la red WiFi o no se puede establecer comunicación.
          </p>
          <div class="wifi-disconnected-actions">
            <div class="wifi-disconnected-steps">
              <h4>Pasos para conectar:</h4>
              <ol>
                <li>Asegúrese de que el esté encendido</li>
                <li>Conecte su dispositivo a la red WiFi</li>
                <li>Verifique que esté en la dirección: <code>192.168.4.1</code></li>
              </ol>
            </div>
          </div>
        </div>
      `;
      
      // Insertar después del h2
      const h2 = conexionesDiv.querySelector('h2');
      if (h2) {
        h2.insertAdjacentElement('afterend', wifiDisconnectedMessage);
      } else {
        conexionesDiv.appendChild(wifiDisconnectedMessage);
      }
    }
  }

  // Mostrar mensaje de desconexión
  if (wifiDisconnectedMessage) {
    wifiDisconnectedMessage.style.display = 'block';
  }

  console.log('📶❌ Mostrando mensaje de desconexión WiFi ');
}

// Función para reintentar conexión
function retryConnection() {
  console.log('🔄 Reintentando conexión WiFi...');
  
  // Mostrar estado de carga en el botón
  const retryBtn = document.querySelector('.wifi-retry-btn');
  if (retryBtn) {
    const btnIcon = retryBtn.querySelector('.btn-icon');
    const btnText = retryBtn.querySelector('.btn-text');
    
    retryBtn.disabled = true;
    btnIcon.textContent = '⏳';
    btnText.textContent = 'Reintentando...';
    
    // Simular reintento durante 3 segundos
    setTimeout(() => {
      retryBtn.disabled = false;
      btnIcon.textContent = '🔄';
      btnText.textContent = 'Reintentar Conexión';
      
      // Forzar una nueva verificación de conexión
      pollSensorData().catch(() => {
        console.log('❌ Reintento fallido - Sigue desconectado');
      });
    }, 3000);
  }
}

function updateDashboardState(data){
  // Cards
    state.pressureSetpoint = data.automatic_updates.setpoint_presion;
    state.tempLixSetpoint = data.automatic_updates.setpoint_temperatura;

    state.recirculacion = data.automatic_updates.recirculacion;
    state.presion_natural = data.automatic_updates.presion_natural;
    state.maceracion = data.automatic_updates.maceracion;
    state.control_temperatura = data.automatic_updates.control_temperatura;

    // Switches
    state.temperature = data.automatic_updates.temperatura_masa;
    state.temperatureLix = data.automatic_updates.temperatura_lixiviados;
    state.pressure = data.automatic_updates.presion;
    state.ph = data.automatic_updates.pH;

    // Proceso
    state.temperatura_sp = data.automatic_updates.temperatura_sp;
    state.tiempo_minutos = data.automatic_updates.start ? data.automatic_updates.tiempo_minutos : 0;
    state.tiempo_horas = data.automatic_updates.start ? data.automatic_updates.tiempo_horas : 0;
    state.modo = data.automatic_updates.modo; //0 manual, 1 automatico
    state.etapa = data.automatic_updates.etapa ? data.automatic_updates.etapa : 0;
    state.total_etapas = data.automatic_updates.total_etapas ? data.automatic_updates.total_etapas : 0;
    state.nombre_ultimo_proceso = data.automatic_updates.nombre_ultimo_proceso ? data.automatic_updates.nombre_ultimo_proceso : "";

    //wifi
    state.wifi_sta_connected = data.automatic_updates.wifi_sta_connected ? data.automatic_updates.wifi_sta_connected: false;
    state.ssid_sta = data.automatic_updates.ssid_sta ? data.automatic_updates.ssid_sta: null;
}

function updateProcessState(data) {
    //if (window.state.start === true && data.automatic_updates.start === false && window.state.nombre_ultimo_proceso !== "") {
    if (window.state.start === true && data.automatic_updates.start === false) {
        // Si el proceso se detuvo, mostrar modal para modificar datos del proceso como nombre, kilos, comentarios, etc.
        console.log("⏹️ Proceso detenido - realizando acciones de cierre");
        
        // Pequeño delay para asegurar que el estado se actualice correctamente
        setTimeout(() => {
            if (typeof showProcessEditModal === 'function') {
                showProcessEditModal();
            } else {
                console.error("❌ Función showProcessEditModal no disponible. Asegúrate de que curves.js esté cargado.");
            }
        }, 1000);
    }

    if (window.state.start !== data.automatic_updates.start) {
        window.state.start = data.automatic_updates.start;
        if (data.automatic_updates.start) {
            startProcess();
          } else {
            stopProcess();
          }
    }
}

function updateProcessButtons() {
    const navGraficas = document.getElementById("navGraficas");
    const processTextStatus = document.querySelectorAll(".processTextStatus");
    if (window.state.start) {
      if (navGraficas) {
                navGraficas.style.display = "block";
            }
        // oculta el boton #playButton
        const playButton = document.getElementById("playButton");
        if (playButton) {
            playButton.style.display = "none";
        }
        // muestra los botones #stopButton y #pauseButton
        const stopButton = document.getElementById("stopButton");
        if (stopButton) {
            stopButton.style.display = "flex";
        }
        const closeButton = document.getElementById("closeButton");
        if (closeButton) {
            closeButton.style.display = "flex";
        }

        if (processTextStatus && processTextStatus.length > 0) {
                processTextStatus.forEach((element) => {
                    if (element && window.state.modo === 0) {
                        element.textContent = "En progreso";
                        element.classList.remove("stoped");
                        element.classList.add("started");
                    }
                    if (element && window.state.modo === 1) {
                        element.textContent = "Etapa " + window.state.etapa + " de " + window.state.total_etapas;
                        element.classList.remove("stoped");
                        element.classList.add("started");
                    }
                });
            }
    } else {
      if (navGraficas) {
                navGraficas.style.display = "none";
            }
        // muestra el boton #playButton
        const playButton = document.getElementById("playButton");
        if (playButton) {
            playButton.style.display = "flex";
        }
        // oculta los botones #stopButton y #closeButton
        const stopButton = document.getElementById("stopButton");
        if (stopButton) {
            stopButton.style.display = "none";
        }
        const closeButton = document.getElementById("closeButton");
        if (closeButton) {
            closeButton.style.display = "none";
        }
        
        const processTextStatus = document.querySelectorAll(".processTextStatus");
            if (processTextStatus && processTextStatus.length > 0) {
                processTextStatus.forEach((element) => {
                    if (element) {
                        element.textContent = "Detenido";
                        element.classList.remove("started");
                        element.classList.add("stoped");
                    }
                });
            }
            state.tiempo_minutos = 0;
            state.tiempo_horas = 0;
    }
}

function disableControlButtons(data) {
    
    const calibratePh4 = document.getElementById("ph4-btn");
    const calibratePh7 = document.getElementById("ph7-btn");
    const calibratePh10 = document.getElementById("ph10-btn");
    // Verificar si hay calibración de pH en progreso
    const isPhCalibrating = (typeof isPhCalibrationInProgress !== 'undefined' && isPhCalibrationInProgress);
    
    // Deshablilitar/habilitar calibracion
    if (data.automatic_updates.start) {
      if (calibratePh4) {
        calibratePh4.disabled = true;
      }
      if (calibratePh7) {
        calibratePh7.disabled = true;
      }
      if (calibratePh10) {
        calibratePh10.disabled = true;
      }
    } else {
      // Solo habilitar botones de pH si no hay calibración en progreso
      if (!isPhCalibrating) {
        if (calibratePh4) {
          calibratePh4.disabled = false;
        }
        if (calibratePh7) {
          calibratePh7.disabled = false;
        }
        if (calibratePh10) {
          calibratePh10.disabled = false;
        }
      }
    }

    // Deshabilitar otros controles si el proceso está en marcha
    if (!window.state.diagnosis) {
      changeDisableState(true, data);
      if (data.automatic_updates.start) {
        changeDisableState(false, data);
      }
    }
}

function changeDisableState(value, data) {
  const naturalPressureBtn = document.getElementById("naturalPressureBtn");
  const carbonicMacerationBtn = document.getElementById("carbonicMacerationBtn");
  const recirculationToggle = document.getElementById("recirculationToggle");
  const temperatureBtn = document.getElementById("temperatureBtn");
  
  const temperatureInputElement = document.getElementById("temperatureInput");
  const naturalPressureInputElement = document.getElementById("naturalPressureInput");
  const carbonicMacerationInputElement = document.getElementById("carbonicMacerationInput");
  
  const calibratePressureBtn = document.getElementById("calibrate-pressure");
  const processStageIndicator = document.getElementById("processStage");

  // if (calibratePressureBtn) {
  //   calibratePressureBtn.disabled = value;
  // }
  if (naturalPressureBtn) {
    naturalPressureBtn.disabled = value;
  }
  if (carbonicMacerationBtn) {
    carbonicMacerationBtn.disabled = value;
  }
  if (data.automatic_updates.start) {
    if (recirculationToggle) {
      recirculationToggle.disabled = window.state.modo === 1 && data.automatic_updates.start;
    }
    if (temperatureBtn) {
      temperatureBtn.disabled = window.state.modo === 1 && data.automatic_updates.start;
    }
  } else {
    if (recirculationToggle) {
      recirculationToggle.disabled = true;
    }
    if (temperatureBtn) {
      temperatureBtn.disabled = true;
    }
  }
  if (temperatureInputElement) {
    temperatureInputElement.disabled = value;
  }
  if (naturalPressureInputElement) {
    naturalPressureInputElement.disabled = value;
  }
  if (carbonicMacerationInputElement) {
    carbonicMacerationInputElement.disabled = value;
  }
  if (processStageIndicator) {
    processStageIndicator.style.display = value ? "block" : "none";
  }
}

function changeDisableStateForced(value) {
  const naturalPressureBtn = document.getElementById("naturalPressureBtn");
  const carbonicMacerationBtn = document.getElementById("carbonicMacerationBtn");
  const recirculationToggle = document.getElementById("recirculationToggle");
  const temperatureBtn = document.getElementById("temperatureBtn");
  
  const temperatureInputElement = document.getElementById("temperatureInput");
  const naturalPressureInputElement = document.getElementById("naturalPressureInput");
  const carbonicMacerationInputElement = document.getElementById("carbonicMacerationInput");
  
  // const calibratePressureBtn = document.getElementById("calibrate-pressure");

  // if (calibratePressureBtn) {
  //   calibratePressureBtn.disabled = value;
  // }
  if (naturalPressureBtn) {
    naturalPressureBtn.disabled = value;
  }
  if (carbonicMacerationBtn) {
    carbonicMacerationBtn.disabled = value;
  }
  if (recirculationToggle) {
    recirculationToggle.disabled = value;
  }
  if (temperatureBtn) {
    temperatureBtn.disabled = value;
  }
  if (temperatureInputElement) {
    temperatureInputElement.disabled = value;
  }
  if (naturalPressureInputElement) {
    naturalPressureInputElement.disabled = value;
  }
  if (carbonicMacerationInputElement) {
    carbonicMacerationInputElement.disabled = value;
  }
}



// ============ CONTROL DE DEMO MODE ============

function handleDemoGraphData(graphType) {
  const NUM_PUNTOS_DEMO = 24; // 24 puntos para demo
  
  const ranges = {
    'temperatura_masa': { min: 25, max: 30 },
    'temperatura_lixiviados': { min: 25, max: 30 },
    'presion': { min: 35, max: 65 },
    'ph': { min: 3.4, max: 3.7 }
  };

  const range = ranges[graphType];
  if (!range) return;

  const demoData = [];
  for (let i = 0; i < NUM_PUNTOS_DEMO; i++) {
    const valor = +(Math.random() * (range.max - range.min) + range.min).toFixed(2);
    demoData.push(valor);
  }

  const graphData = {};
  graphData[`grafica_${graphType}`] = demoData;

  updateUIElements(graphData);
}

function generarSerieAleatoria(min, max, cantidad) {
  const serie = [];
  for (let i = 0; i < cantidad; i++) {
    const valor = +(Math.random() * (max - min) + min).toFixed(2);
    serie.push(valor);
  }
  return serie;
}


function initDemoMode() {
  setInitialStateValues();
}

function stopDemoMode() {
  
  // Resetear estado como en WebSocket
  const resetData = {
    automatic_updates: {
      presion: 0,
      temperatura_masa: 0,
      temperatura_lixiviados: 0,
      pH: 0,
      setpoint_presion: 0,
      setpoint_temperatura: 0,
      recirculacion: false,
      presion_natural: false,
      maceracion: false,
      control_temperatura: false,
      start: false,
      tiempo_horas: 0,
      tiempo_minutos: 0,
      temperatura_sp: 24,
      num_clientes_conectados: 0,
    }
  };

  updateUIElements(resetData);
}

function restoreDemoStatus() {
    const wasDemo = localStorage.getItem("demoMode") === "true";
    localStorage.setItem("demoMode", wasDemo);
    isDemoMode = wasDemo;
    apiManager.setDemoMode(isDemoMode);
}

function toggleDemoMode() {
    const wasDemo = localStorage.getItem("demoMode") === "true";
    localStorage.setItem("demoMode", !wasDemo);
    isDemoMode = !wasDemo;
    apiManager.setDemoMode(isDemoMode);
    updateDemoButton();
    if (!wasDemo) {
        console.log("🎭 Cambiando a modo demo HTTP...");
        initDemoMode();
    } else {
        console.log("🎭 Cambiando a modo real HTTP...");
        stopDemoMode();
    }
}

function updateDemoButton() {
  const isDemoModeStored = localStorage.getItem("demoMode") === "true";
  const demoText = document.getElementById("demoText");
  
  if (demoText) {
    demoText.textContent = isDemoModeStored ? "Demo Activado" : "Demo Desactivado";
  }

  const actionButtonsContainer = document.getElementById("actionButtonsContainer");
  const demoIndicator = document.getElementById("demoIndicator");

  if (isDemoModeStored) {
    if (actionButtonsContainer) actionButtonsContainer.style.display = "flex";
    if (demoIndicator) demoIndicator.style.display = "block";
  } else {
    if (actionButtonsContainer) actionButtonsContainer.style.display = "none";
    if (demoIndicator) demoIndicator.style.display = "none";
  }
}


// ============ EXPORTAR FUNCIONES GLOBALES PARA COMPATIBILIDAD ============
window.toggleDemoMode = toggleDemoMode;
window.lockUserInteraction = lockUserInteraction;
window.unlockUserInteraction = unlockUserInteraction;
window.updateSensorDataOnly = updateSensorDataOnly;
window.changeDisableStateForced = changeDisableStateForced;

// ============ EXPORTAR APIMANAGER Y FUNCIONES DE API ============
const apiManager = new ApiManager(notificationManager);
window.apiManager = apiManager;
window.ApiManager = ApiManager;

// Funciones auxiliares para mantener compatibilidad con código existente
window.API_BASE_URL = apiManager.API_BASE_URL;
window.ENDPOINTS = apiManager.ENDPOINTS;

// Funciones wrapper para APIs específicas
window.getAllGraphData = (filename = null) => apiManager.getAllGraphData(filename);
window.getRecentGraphData = (limit, filename = null) => apiManager.getRecentGraphData(limit, filename);
window.getFilteredGraphData = (limit, filename = null) => apiManager.getFilteredGraphData(limit, filename);
window.getCurvasFiles = (filterParams = null) => apiManager.getCurvasFiles(filterParams);
window.getRecetasFiles = () => apiManager.getRecetasFiles();
window.getRecipeDetail = (filename) => apiManager.getRecipeDetail(filename);
window.getCurveDetail = (filename) => apiManager.getCurveDetail(filename);
window.deleteFile = (filename) => apiManager.deleteFile(filename);
window.startAutomaticProcess = (filename) => apiManager.startAutomaticProcess(filename);
window.updateProcessData = (processData) => apiManager.updateProcessData(processData);
window.updateRecipeData = (recipeData) => apiManager.updateRecipeData(recipeData);
window.setCurrentDate = (dateString) => apiManager.setCurrentDate(dateString);
window.setWiFiConfig = (ssid, password) => apiManager.setWiFiConfig(ssid, password);
window.scanWiFiNetworks = () => apiManager.scanWiFiNetworks();
window.connectToWiFiNetwork = (ssid, password, save) => apiManager.connectToWiFiNetwork(ssid, password, save);
window.disconnectFromWiFiNetwork = () => apiManager.disconnectFromWiFiNetwork();
window.getWiFiStatus = () => apiManager.getWiFiStatus();


// ============ EVENT LISTENERS ============

// Inicializar cuando la página carga
window.addEventListener("load", () => {
    console.log("🚀 Iniciando sistema HTTP Polling para ZENIT ICUZ");
    restoreDemoStatus()
    initHttpPolling();
    // Actualizar botón demo al cargar
    updateDemoButton();
});



// Limpiar al cerrar la página
window.addEventListener('beforeunload', () => {
    stopPolling();
    stopDemoMode();
});