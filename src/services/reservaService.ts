import { api } from './api';
import type { Mesa } from './mesaService';
import type { Cliente } from './clienteService';

export interface Reserva {
  id: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:MM
  numeroPersonas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
  mesaId: number;
  clienteId: number;
  mesa?: Mesa;
  cliente?: Cliente;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface DisponibilidadConsulta {
  fecha: string;
  hora: string;
  numeroPersonas: number;
}

export interface DisponibilidadResponse {
  mesasDisponibles: Mesa[];
  totalMesasDisponibles: number;
}

export interface Estadisticas {
  totalReservas: number;
  reservasPendientes: number;
  reservasConfirmadas: number;
  reservasCanceladas: number;
  reservasCompletadas: number;
}

export const reservaService = {
  // Obtener todas las reservas
  getAllReservas: () => api.get<Reserva[]>('/reservas'),
  
  // Obtener reservas por fecha
  getReservasByFecha: (fecha: string) => api.get<Reserva[]>(`/reservas?fecha=${fecha}`),
  
  // Obtener reservas del día
  getReservasHoy: () => api.get<Reserva[]>('/reservas/hoy'),
  
  // Obtener estadísticas
  getEstadisticas: () => api.get<Estadisticas>('/reservas/estadisticas'),
  
  // Consultar disponibilidad
  consultarDisponibilidad: (consultaData: DisponibilidadConsulta) => 
    api.post<DisponibilidadResponse>('/reservas/disponibilidad', consultaData),
  
  // Crear nueva reserva
  createReserva: (reservaData: Partial<Reserva>) => api.post<Reserva>('/reservas', reservaData),
  
  // Actualizar reserva
  updateReserva: (id: number, reservaData: Partial<Reserva>) => api.patch<Reserva>(`/reservas/${id}`, reservaData),
  
  // Confirmar reserva
  confirmarReserva: (id: number) => api.patch<Reserva>(`/reservas/${id}/confirmar`),
  
  // Cancelar reserva
  cancelarReserva: (id: number) => api.patch<Reserva>(`/reservas/${id}/cancelar`),
  
  // Completar reserva
  completarReserva: (id: number) => api.patch<Reserva>(`/reservas/${id}/completar`),
  
  // Eliminar reserva
  deleteReserva: (id: number) => api.delete(`/reservas/${id}`)
};