# Sistema de Reservas de Restaurante - Frontend

Frontend desarrollado en React + TypeScript + Vite para el sistema de gestión de reservas de restaurante.

## 🚀 Características Implementadas

### ✅ Páginas Principales
- **Dashboard**: Estadísticas y resumen de reservas del día actual
- **Nueva Reserva**: Formulario completo con validaciones y verificación de disponibilidad
- **Gestión de Mesas**: CRUD completo para administrar las mesas del restaurante
- **Historial de Clientes**: Lista de clientes con búsqueda y visualización del historial
- **Lista de Reservas**: Visualización de todas las reservas con filtros y acciones

### ✅ Funcionalidades Técnicas
- **Navegación**: React Router con sidebar de navegación
- **UI/UX**: Material-UI con diseño responsive
- **Validaciones**: React Hook Form + Yup para validaciones robustas
- **API Integration**: Axios para consumir la API del backend
- **Manejo de Estados**: Gestión de estados de reservas (pendiente, confirmada, cancelada, completada)
- **Filtros**: Búsqueda de clientes y filtrado de reservas por fecha/estado

### ✅ Validaciones Implementadas
- **Formato de fecha europeo**: DD/MM/YYYY en toda la aplicación
- Fechas no pueden ser en el pasado
- Horarios solo en rango laboral (11:00 - 22:00)
- Verificación de disponibilidad de mesas en tiempo real
- Validación de capacidad de mesa vs número de personas
- Formularios con mensajes de error descriptivos

## 🛠️ Tecnologías Utilizadas

- **React 19** con TypeScript
- **Vite** como bundler
- **Material-UI (MUI)** para componentes UI
- **React Router Dom** para navegación
- **React Hook Form** para manejo de formularios
- **Yup** para validaciones
- **Axios** para peticiones HTTP
- **Day.js** para manejo de fechas

## 📋 Prerequisitos

1. **Backend ejecutándose**: El backend debe estar corriendo en `http://localhost:3002`
2. **Node.js**: Versión 16 o superior
3. **npm** o **yarn**

## 🔧 Instalación y Configuración

1. **Clonar e instalar dependencias** (ya hecho):
```bash
cd restaurante-app-front
npm install
```

2. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

3. **Abrir en el navegador**:
```
http://localhost:5173
```

## 🎯 Uso de la Aplicación

### 1. Dashboard (Página Principal)
- Visualiza estadísticas generales de reservas
- Muestra las reservas del día actual
- Códigos de color para estados de reserva

### 2. Nueva Reserva
- Completa fecha, hora y número de personas
- La aplicación verificará automáticamente la disponibilidad
- Selecciona cliente de la lista existente
- Elige mesa de las disponibles para esa fecha/hora
- Agrega notas opcionales

### 3. Gestión de Mesas
- Ver todas las mesas con su información
- Crear nuevas mesas
- Editar mesas existentes
- Eliminar mesas
- Cambiar estado de disponibilidad

### 4. Historial de Clientes
- Lista de todos los clientes
- Búsqueda por nombre o teléfono
- Clientes frecuentes destacados
- Historial expandible de reservas por cliente
- Crear nuevos clientes

### 5. Lista de Reservas
- Ver todas las reservas
- Filtrar por fecha y estado
- Acciones rápidas: confirmar, cancelar, completar reservas
- Información detallada de cada reserva

## 🔄 Estados de Reserva

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Pendiente** | 🟠 Naranja | Reserva creada, esperando confirmación |
| **Confirmada** | 🟢 Verde | Reserva confirmada por el restaurante |
| **Cancelada** | 🔴 Rojo | Reserva cancelada |
| **Completada** | 🔵 Azul | Cliente ya atendido |

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   └── layout/
│       └── Layout.tsx          # Layout principal con navegación
├── pages/
│   ├── Dashboard.tsx           # Página principal
│   ├── NuevaReserva.tsx       # Formulario de nueva reserva
│   ├── GestionMesas.tsx       # Gestión de mesas
│   ├── HistorialClientes.tsx  # Historial de clientes
│   └── ListaReservas.tsx      # Lista de reservas
├── services/
│   ├── api.ts                 # Configuración de Axios
│   ├── reservaService.ts      # Servicios de reservas
│   ├── mesaService.ts         # Servicios de mesas
│   └── clienteService.ts      # Servicios de clientes
├── App.tsx                    # Configuración de rutas
└── main.tsx                   # Punto de entrada
```

## 🔌 Conexión con Backend

La aplicación está configurada para conectar con el backend en:
```
http://localhost:3002
```

### Endpoints utilizados:
- `GET /reservas/hoy` - Reservas del día
- `GET /reservas/estadisticas` - Estadísticas
- `POST /reservas/disponibilidad` - Verificar disponibilidad
- `POST /reservas` - Crear reserva
- `PATCH /reservas/:id/confirmar` - Confirmar reserva
- `PATCH /reservas/:id/cancelar` - Cancelar reserva
- `PATCH /reservas/:id/completar` - Completar reserva
- `GET /mesas` - Listar mesas
- `POST /mesas` - Crear mesa
- `GET /clientes` - Listar clientes
- `GET /clientes/frecuentes` - Clientes frecuentes

## 📱 Diseño Responsive

La aplicación está optimizada para:
- **Desktop**: Experiencia completa con sidebar
- **Tablet**: Layout adaptativo
- **Mobile**: Diseño móvil amigable

## � Configuración Regional

La aplicación está configurada para usar:
- **Formato de fecha**: DD/MM/YYYY (formato europeo)
- **Idioma**: Español
- **Timezone**: Local del usuario
- **Formato de hora**: 24 horas (HH:MM)

### Personalización de Fechas

Para cambiar el formato de fecha, modifica las constantes en `src/utils/constants.ts`:
```typescript
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',           // Para mostrar fechas al usuario
  API: 'YYYY-MM-DD',               // Para enviar al backend  
  DATETIME: 'DD/MM/YYYY HH:mm',    // Para mostrar fecha y hora
  TIME: 'HH:mm'                    // Para mostrar solo hora
};
```

## �🎨 Personalización

Para cambiar colores de estados, modifica las constantes en cada componente:
```typescript
const colores = {
  'pendiente': '#ff9800',    // Naranja
  'confirmada': '#4caf50',   // Verde
  'cancelada': '#f44336',    // Rojo
  'completada': '#2196f3'    // Azul
};
```

## 🐛 Solución de Problemas

1. **Error de conexión con API**: Verificar que el backend esté ejecutándose en puerto 3002
2. **Problemas de CORS**: El backend ya está configurado para aceptar conexiones desde puerto 5173
3. **Error de compilación**: Verificar que todas las dependencias estén instaladas

## 📝 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de la compilación
- `npm run lint` - Ejecutar ESLint

## 🔜 Próximas Mejoras

- Calendario visual interactivo
- Notificaciones push
- Exportación de reportes
- Sistema de usuarios y roles
- Dashboard de analytics avanzado

---

**Estado**: ✅ Completamente funcional y listo para usar

**Autor**: Sistema desarrollado siguiendo las especificaciones detalladas del backend