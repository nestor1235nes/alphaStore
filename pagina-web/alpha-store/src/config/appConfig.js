/**
 * Configuración de modo DEMO
 * 
 * Cambia DEMO_MODE a false cuando quieras conectar con un backend real
 * Cambia DEMO_MODE a true para usar datos hardcodeados (perfecto para demo/Vercel)
 */

export const DEMO_MODE = true;

/**
 * URLs de API para modo producción
 * Solo se usan cuando DEMO_MODE = false
 */
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    withCredentials: true
};

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
    name: 'AlphaStore',
    version: '1.0.0',
    demoMode: DEMO_MODE
};

export default {
    DEMO_MODE,
    API_CONFIG,
    APP_CONFIG
};
