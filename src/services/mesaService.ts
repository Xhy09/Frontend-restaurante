import { api } from './api';

export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
  disponible: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  reservas?: any[];
}

export const mesaService = {
  // Obtener todas las mesas
  getAllMesas: () => api.get<Mesa[]>('/mesas'),
  
  // Obtener mesas disponibles
  getMesasDisponibles: () => api.get<Mesa[]>('/mesas?disponibles=true'),
  
  // Obtener mesas por capacidad mínima
  getMesasByCapacidad: (capacidad: number) => api.get<Mesa[]>(`/mesas?capacidadMinima=${capacidad}`),
  
  // Crear nueva mesa
  createMesa: (mesaData: Partial<Mesa>) => api.post<Mesa>('/mesas', mesaData),
  
  // Actualizar mesa
  updateMesa: (id: number, mesaData: Partial<Mesa>) => api.patch<Mesa>(`/mesas/${id}`, mesaData),
  
  // Eliminar mesa
  deleteMesa: (id: number) => api.delete(`/mesas/${id}`)
};