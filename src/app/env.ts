type AppEnv = 'local' | 'server';

const CURRENT_ENV: AppEnv = 'server';

export const CONFIG = {
  local: {
    API_URL: 'http://localhost:5200/api-alarma',
    SOCKET_URL: 'http://localhost:5200'
  },
  server: {
    API_URL: 'https://vps-4920163-x.dattaweb.com:443/api-alarma',
    SOCKET_URL: 'https://vps-4920163-x.dattaweb.com:443'
  }
};

// URLs
export const API_URL = CONFIG[CURRENT_ENV].API_URL;
export const SOCKET_URL = CONFIG[CURRENT_ENV].SOCKET_URL;
export const WEB_APP_URL = 'https://alarmstech.vercel.app';

// Ruta del socket
export const SOCKET_PATH = '/api-alarma/socket';

// Eventos WebSocket
export const WS_ALARM_ARMING = 'alarm/arming';
export const WS_TRIGGER_ALARM = 'alarm/triggered';
export const WS_WARNING = 'alarm/warning';
export const WS_LIGHTS = 'alarm/lights';

// Otras constantes
export const USER_PREFIX = 'user_';
