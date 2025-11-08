import { api } from './api';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  numeroVisitas: number;
  reservas?: any[];
}

export const clienteService = {
  // Obtener todos los clientes
  getAllClientes: () => api.get<Cliente[]>('/clientes'),
  
  // Buscar clientes por nombre
  searchClientes: (nombre: string) => api.get<Cliente[]>(`/clientes?nombre=${nombre}`),
  
  // Obtener clientes frecuentes
  getClientesFrecuentes: () => api.get<Cliente[]>('/clientes/frecuentes'),
  
  // Obtener historial de un cliente
  getHistorialCliente: (id: number) => api.get(`/clientes/${id}/historial`),
  
  // Crear nuevo cliente
  createCliente: (clienteData: Partial<Cliente>) => api.post<Cliente>('/clientes', clienteData),
  
  // Actualizar cliente
  updateCliente: (id: number, clienteData: Partial<Cliente>) => api.patch<Cliente>(`/clientes/${id}`, clienteData)
};