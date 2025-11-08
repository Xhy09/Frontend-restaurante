// Constantes para formateo de fechas
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',           // Para mostrar fechas al usuario
  API: 'YYYY-MM-DD',               // Para enviar al backend
  DATETIME: 'DD/MM/YYYY HH:mm',    // Para mostrar fecha y hora
  TIME: 'HH:mm'                    // Para mostrar solo hora
};

// Configuración de estados de reserva
export const ESTADO_COLORS = {
  'pendiente': '#ff9800',    // Naranja
  'confirmada': '#4caf50',   // Verde
  'cancelada': '#f44336',    // Rojo
  'completada': '#2196f3'    // Azul
} as const;

export const ESTADO_LABELS = {
  'pendiente': 'Pendiente',
  'confirmada': 'Confirmada', 
  'cancelada': 'Cancelada',
  'completada': 'Completada'
} as const;