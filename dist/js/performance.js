/**
 * BIOMASTER Pro V2 IA - Performance Optimization Module
 * Optimiza la carga de recursos y mejora el rendimiento
 */

class PerformanceOptimizer {
    constructor() {
        this.resourceCache = new Map();
        this.loadedModules = new Set();
        this.criticalResourcesLoaded = false;
        this.init();
    }

    init() {
        this.setupResourceHints();
        this.optimizeImageLoading();
        this.setupIntersectionObserver();
        this.preloadCriticalResources();
    }

    /**
     * Configura hints de recursos para mejorar la carga
     */
    setupResourceHints() {
        // Preconnect a dominios externos si es necesario
        const preconnectDomains = [
            // Agregar aquí dominios externos si los hay
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    /**
     * Optimiza la carga de imágenes con lazy loading inteligente
     */
    optimizeImageLoading() {
        // Precargar imágenes críticas
        const criticalImages = [
            './icons/pyh.png',
            './icons/menu.svg',
            './icons/config-white.svg'
        ];

        criticalImages.forEach(src => {
            this.preloadImage(src);
        });
    }

    /**
     * Precarga una imagen
     */
    preloadImage(src) {
        if (this.resourceCache.has(src)) return;

        const img = new Image();
        img.onload = () => {
            this.resourceCache.set(src, true);
        };
        img.src = src;
    }

    /**
     * Precarga un script JavaScript
     */
    preloadScript(src) {
        if (this.resourceCache.has(src)) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'script';
        link.onload = () => {
            this.resourceCache.set(src, true);
        };
        document.head.appendChild(link);
    }

    /**
     * Configura Intersection Observer para lazy loading
     */
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observar imágenes con data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Precarga recursos críticos
     */
    preloadCriticalResources() {
        const criticalCSS = [
            './css/styles.css'
        ];

        const criticalJS = [
            './js/theme.js',
            './js/state.js',
            './js/initialization.js',
            './js/websocket.js'
        ];

        // Verificar que CSS crítico esté cargado
        criticalCSS.forEach(href => {
            this.ensureStylesheetLoaded(href);
        });

        // Precargar JavaScript crítico
        criticalJS.forEach(src => {
            this.preloadScript(src);
        });

        // Marcar recursos críticos como cargados
        this.criticalResourcesLoaded = true;
    }

    /**
     * Asegura que una hoja de estilos esté cargada
     */
    ensureStylesheetLoaded(href) {
        return new Promise((resolve) => {
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) {
                if (existing.sheet) {
                    resolve();
                } else {
                    existing.onload = resolve;
                }
            } else {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = resolve;
                document.head.appendChild(link);
            }
        });
    }

    /**
     * Carga un módulo JavaScript de forma lazy
     */
    async loadModule(src, moduleId) {
        if (this.loadedModules.has(moduleId)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = () => {
                this.loadedModules.add(moduleId);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Optimiza las animaciones CSS para mejor rendimiento
     */
    optimizeAnimations() {
        // Reducir animaciones si el usuario prefiere menos movimiento
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-slow', 'none');
            document.documentElement.style.setProperty('--transition-fast', 'none');
        }

        // Usar will-change para animaciones críticas
        const animatedElements = document.querySelectorAll('.loader-container, .logo-circle, .spinner-ring');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }

    /**
     * Limpia recursos no utilizados
     */
    cleanup() {
        // Remover will-change después de las animaciones
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('[style*="will-change"]');
            animatedElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 5000);
    }

    /**
     * Monitorea las métricas de rendimiento
     */
    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitorear Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitorear First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        }
    }

    /**
     * Inicializa las optimizaciones después de que el DOM esté listo
     */
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new PerformanceOptimizer();
            });
        } else {
            new PerformanceOptimizer();
        }
    }
}

// Auto-inicializar cuando se carga el script
PerformanceOptimizer.init();

// Exportar para uso en otros módulos
window.PerformanceOptimizer = PerformanceOptimizer;
