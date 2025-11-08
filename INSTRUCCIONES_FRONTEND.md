# Instrucciones para Crear el Frontend - Sistema de Reservas de Restaurante

## Resumen del Backend Completado

El backend está **100% funcional** y ejecutándose en:
- **API**: http://localhost:3002
- **Documentación**: http://localhost:3002/api (Swagger)
- **Base de datos**: PostgreSQL en puerto 5433

**Para ejecutar el backend:**
```bash
git clone <tu-repositorio>
cd restaurante-app
docker-compose up --build
```

## Características del Backend Implementadas

✅ **Gestión de Mesas**: CRUD completo con validaciones
✅ **Gestión de Clientes**: Registro y historial de reservas  
✅ **Gestión de Reservas**: Crear, modificar, cancelar, confirmar
✅ **Validaciones de negocio**: No doble reserva, capacidad, horarios
✅ **Consultas especiales**: Disponibilidad, estadísticas, clientes frecuentes
✅ **Sistema de puntos**: Conteo automático de visitas
✅ **Estados de reserva**: Pendiente, confirmada, cancelada, completada

## Instrucciones para la IA del Frontend

### 1. Configuración Inicial
```bash
# Crear proyecto React
npx create-react-app restaurante-frontend
cd restaurante-frontend

# Instalar dependencias necesarias
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/x-date-pickers dayjs
npm install react-hook-form @hookform/resolvers yup
```

### 2. Configuración de API
Crear archivo `src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### 3. Estructura de Páginas Requeridas

#### A. Página Principal (Dashboard del Restaurante)
**Ruta**: `/`
**Componentes**:
- Calendario visual de reservas (vista mensual/semanal/diaria)
- Resumen de reservas del día actual
- Mesas disponibles/ocupadas en tiempo real
- Estadísticas rápidas (total reservas, cancelaciones, etc.)

**API Endpoints a usar**:
- `GET /reservas/hoy` - Reservas del día
- `GET /reservas/estadisticas` - Estadísticas
- `GET /mesas?disponibles=true` - Mesas disponibles

#### B. Formulario de Reserva
**Ruta**: `/nueva-reserva`
**Campos requeridos**:
- Selección de fecha (date picker)
- Selección de hora (time picker)
- Número de personas (número)
- Selección de cliente (dropdown con búsqueda)
- Selección de mesa (filtrado por capacidad)
- Notas especiales (textarea opcional)

**Validaciones**:
- Fecha no puede ser en el pasado
- Hora debe estar en horario laboral
- Mesa debe tener capacidad suficiente
- Verificar disponibilidad antes de crear

**API Endpoints**:
- `POST /reservas/disponibilidad` - Verificar disponibilidad
- `GET /clientes` - Lista de clientes
- `GET /mesas?capacidadMinima=X` - Mesas por capacidad
- `POST /reservas` - Crear reserva

#### C. Gestión de Mesas
**Ruta**: `/mesas`
**Funcionalidades**:
- Lista de todas las mesas con información
- Agregar nueva mesa
- Modificar mesa existente
- Ver historial de reservas por mesa
- Cambiar estado disponible/no disponible

**API Endpoints**:
- `GET /mesas` - Listar mesas
- `POST /mesas` - Crear mesa
- `PATCH /mesas/:id` - Actualizar mesa
- `DELETE /mesas/:id` - Eliminar mesa

#### D. Historial de Clientes
**Ruta**: `/clientes`
**Funcionalidades**:
- Lista de clientes con información
- Búsqueda por nombre/teléfono
- Ver historial de reservas por cliente
- Clientes frecuentes destacados
- Agregar nuevo cliente

**API Endpoints**:
- `GET /clientes` - Listar clientes
- `GET /clientes/frecuentes` - Clientes frecuentes
- `GET /clientes/:id/historial` - Historial del cliente
- `POST /clientes` - Crear cliente

### 4. Componentes Específicos Necesarios

#### A. Calendario de Reservas
- Mostrar reservas por día con colores según estado
- Clickeable para ver detalles
- Navegación por meses
- Vista de agenda diaria

#### B. Selector de Disponibilidad
- Input de fecha y hora
- Botón "Verificar Disponibilidad"
- Mostrar mesas disponibles con detalles
- Permitir selección directa

#### C. Tarjetas de Mesa
- Número de mesa
- Capacidad
- Ubicación
- Estado actual (libre/ocupada)
- Próxima reserva

#### D. Lista de Reservas
- Filtros por fecha, estado, mesa, cliente
- Acciones: confirmar, cancelar, completar
- Indicadores visuales de estado

### 5. Estados de Reserva y Colores Sugeridos
```javascript
const ESTADO_COLORES = {
  'pendiente': '#ff9800',    // Naranja
  'confirmada': '#4caf50',   // Verde
  'cancelada': '#f44336',    // Rojo
  'completada': '#2196f3'    // Azul
};
```

### 6. Validaciones del Frontend
- **Fecha**: No permitir fechas pasadas
- **Hora**: Solo horarios laborables (ej: 11:00 - 22:00)
- **Capacidad**: Mesa debe soportar número de personas
- **Duplicación**: Verificar antes de enviar al backend

### 7. Notificaciones
Implementar sistema de notificaciones para:
- Reserva creada exitosamente
- Errores de validación
- Conflictos de horario
- Confirmaciones de acciones

### 8. Rutas de Navegación
```javascript
const routes = [
  { path: '/', component: Dashboard },
  { path: '/nueva-reserva', component: FormularioReserva },
  { path: '/mesas', component: GestionMesas },
  { path: '/clientes', component: HistorialClientes },
  { path: '/reservas', component: ListaReservas }
];
```

### 9. Especificaciones de la API

#### Endpoints Principales:
- **Mesas**: `/mesas` (GET, POST, PATCH, DELETE)
- **Clientes**: `/clientes` (GET, POST, PATCH, DELETE)
- **Reservas**: `/reservas` (GET, POST, PATCH, DELETE)

#### Endpoints Especiales:
- `POST /reservas/disponibilidad` - Consultar disponibilidad
- `GET /reservas/hoy` - Reservas del día
- `GET /reservas/estadisticas` - Estadísticas
- `PATCH /reservas/:id/confirmar` - Confirmar reserva
- `PATCH /reservas/:id/cancelar` - Cancelar reserva
- `PATCH /reservas/:id/completar` - Completar reserva

### 10. Datos de Ejemplo Disponibles
El backend incluye datos de prueba:
- **10 mesas** con diferentes capacidades (2, 4, 6, 8 personas)
- **5 clientes** de ejemplo con información completa
- Ubicaciones: Ventana, Centro, Terraza, Salón Privado, Barra

### 11. Funcionalidades Extra Implementadas
- **Sistema de puntos**: Cada reserva completada incrementa visitas del cliente
- **Clientes frecuentes**: Endpoint para obtener clientes con múltiples visitas
- **Estadísticas**: Resumen de reservas por día, pendientes, canceladas
- **Validación de horarios**: Backend previene conflictos automáticamente

### 12. Consideraciones de UX
- **Responsive**: Diseño que funcione en móvil y desktop
- **Intuitive**: Flujo simple para crear reservas
- **Visual**: Uso de colores para estados y disponibilidad
- **Feedback**: Confirmaciones claras de todas las acciones

## Comandos para Probar el Backend

```bash
# Verificar que funciona
curl http://localhost:3002/mesas
curl http://localhost:3002/clientes
curl http://localhost:3002/reservas

# Ver documentación completa
# Abrir navegador en: http://localhost:3002/api
```

## Servicios Específicos para el Frontend

### A. Servicio de Mesas (`src/services/mesaService.js`)
```javascript
import { api } from './api';

export const mesaService = {
  // Obtener todas las mesas
  getAllMesas: () => api.get('/mesas'),
  
  // Obtener mesas disponibles
  getMesasDisponibles: () => api.get('/mesas?disponibles=true'),
  
  // Obtener mesas por capacidad mínima
  getMesasByCapacidad: (capacidad) => api.get(`/mesas?capacidadMinima=${capacidad}`),
  
  // Crear nueva mesa
  createMesa: (mesaData) => api.post('/mesas', mesaData),
  
  // Actualizar mesa
  updateMesa: (id, mesaData) => api.patch(`/mesas/${id}`, mesaData),
  
  // Eliminar mesa
  deleteMesa: (id) => api.delete(`/mesas/${id}`)
};
```

### B. Servicio de Clientes (`src/services/clienteService.js`)
```javascript
import { api } from './api';

export const clienteService = {
  // Obtener todos los clientes
  getAllClientes: () => api.get('/clientes'),
  
  // Buscar clientes por nombre
  searchClientes: (nombre) => api.get(`/clientes?nombre=${nombre}`),
  
  // Obtener clientes frecuentes
  getClientesFrecuentes: () => api.get('/clientes/frecuentes'),
  
  // Obtener historial de un cliente
  getHistorialCliente: (id) => api.get(`/clientes/${id}/historial`),
  
  // Crear nuevo cliente
  createCliente: (clienteData) => api.post('/clientes', clienteData),
  
  // Actualizar cliente
  updateCliente: (id, clienteData) => api.patch(`/clientes/${id}`, clienteData)
};
```

### C. Servicio de Reservas (`src/services/reservaService.js`)
```javascript
import { api } from './api';

export const reservaService = {
  // Obtener todas las reservas
  getAllReservas: () => api.get('/reservas'),
  
  // Obtener reservas por fecha
  getReservasByFecha: (fecha) => api.get(`/reservas?fecha=${fecha}`),
  
  // Obtener reservas del día
  getReservasHoy: () => api.get('/reservas/hoy'),
  
  // Obtener estadísticas
  getEstadisticas: () => api.get('/reservas/estadisticas'),
  
  // Consultar disponibilidad
  consultarDisponibilidad: (consultaData) => api.post('/reservas/disponibilidad', consultaData),
  
  // Crear nueva reserva
  createReserva: (reservaData) => api.post('/reservas', reservaData),
  
  // Actualizar reserva
  updateReserva: (id, reservaData) => api.patch(`/reservas/${id}`, reservaData),
  
  // Confirmar reserva
  confirmarReserva: (id) => api.patch(`/reservas/${id}/confirmar`),
  
  // Cancelar reserva
  cancelarReserva: (id) => api.patch(`/reservas/${id}/cancelar`),
  
  // Completar reserva
  completarReserva: (id) => api.patch(`/reservas/${id}/completar`),
  
  // Eliminar reserva
  deleteReserva: (id) => api.delete(`/reservas/${id}`)
};
```

## Estructuras de Datos del Backend

### Mesa
```javascript
{
  id: number,
  numero: number,
  capacidad: number,
  ubicacion: string,
  disponible: boolean,
  fechaCreacion: string,
  fechaActualizacion: string,
  reservas: Array
}
```

### Cliente
```javascript
{
  id: number,
  nombre: string,
  apellido: string,
  telefono: string,
  email: string,
  fechaRegistro: string,
  numeroVisitas: number,
  reservas: Array
}
```

### Reserva
```javascript
{
  id: number,
  fecha: string, // YYYY-MM-DD
  hora: string,  // HH:MM
  numeroPersonas: number,
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada',
  notas: string,
  mesaId: number,
  clienteId: number,
  mesa: Object,
  cliente: Object,
  fechaCreacion: string,
  fechaActualizacion: string
}
```

## Configuración de CORS
El backend ya tiene CORS configurado para aceptar conexiones desde:
- http://localhost:3000 (Create React App default)
- http://localhost:3001
- http://localhost:5173 (Vite default)

## Funcionalidades Especiales del Backend

### 1. Validación de Disponibilidad
```javascript
// Ejemplo de uso en el frontend
const verificarDisponibilidad = async (fecha, hora, numeroPersonas) => {
  try {
    const response = await reservaService.consultarDisponibilidad({
      fecha,
      hora,
      numeroPersonas
    });
    return response.data; // { mesasDisponibles: [...], totalMesasDisponibles: number }
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
  }
};
```

### 2. Sistema de Estados de Reserva
- **pendiente**: Color naranja (#ff9800)
- **confirmada**: Color verde (#4caf50)
- **cancelada**: Color rojo (#f44336)
- **completada**: Color azul (#2196f3)

### 3. Manejo de Errores del Backend
El backend devuelve errores estructurados:
```javascript
{
  statusCode: 400,
  message: "Descripción del error",
  error: "Bad Request"
}
```

El backend está **completamente funcional** y listo para ser consumido por el frontend. Todas las validaciones de negocio están implementadas en el backend, por lo que el frontend solo necesita manejar la interfaz de usuario y validaciones básicas.