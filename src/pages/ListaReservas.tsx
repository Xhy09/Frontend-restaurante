import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CardActions,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Dayjs } from '../utils/dayjs';
import dayjs from '../utils/dayjs';

import { reservaService, type Reserva } from '../services/reservaService';

export const ListaReservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroFecha, setFiltroFecha] = useState<Dayjs | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  useEffect(() => {
    loadReservas();
  }, []);

  useEffect(() => {
    if (filtroFecha) {
      loadReservasByFecha(filtroFecha.format('YYYY-MM-DD'));
    } else {
      loadReservas();
    }
  }, [filtroFecha]);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const response = await reservaService.getAllReservas();
      setReservas(response.data);
    } catch (err) {
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const loadReservasByFecha = async (fecha: string) => {
    try {
      setLoading(true);
      const response = await reservaService.getReservasByFecha(fecha);
      setReservas(response.data);
    } catch (err) {
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (reserva: Reserva, nuevoEstado: string) => {
    try {
      switch (nuevoEstado) {
        case 'confirmada':
          await reservaService.confirmarReserva(reserva.id);
          break;
        case 'cancelada':
          await reservaService.cancelarReserva(reserva.id);
          break;
        case 'completada':
          await reservaService.completarReserva(reserva.id);
          break;
        default:
          return;
      }
      
      // Actualizar la reserva en el estado local
      setReservas(prev => prev.map(r => 
        r.id === reserva.id ? { ...r, estado: nuevoEstado as any } : r
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || `Error al ${nuevoEstado} la reserva`);
    }
  };

  const getEstadoColor = (estado: string): 'warning' | 'success' | 'error' | 'info' | 'default' => {
    const colores: {[key: string]: 'warning' | 'success' | 'error' | 'info' | 'default'} = {
      'pendiente': 'warning',
      'confirmada': 'success',
      'cancelada': 'error',
      'completada': 'info'
    };
    return colores[estado] || 'default';
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroEstado && reserva.estado !== filtroEstado) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider 
      dateAdapter={AdapterDayjs} 
      adapterLocale="es"
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Lista de Reservas
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <DatePicker
            label="Filtrar por fecha"
            value={filtroFecha}
            onChange={setFiltroFecha}
            format="DD/MM/YYYY"
            slotProps={{
              textField: { size: 'small' }
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              label="Estado"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="confirmada">Confirmada</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
              <MenuItem value="completada">Completada</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setFiltroFecha(null);
              setFiltroEstado('');
              loadReservas();
            }}
          >
            Limpiar Filtros
          </Button>
        </Box>

        {/* Lista de reservas */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            '& > *': { minWidth: '350px', maxWidth: '400px', flex: '1 1 350px' }
          }}
        >
          {reservasFiltradas.length === 0 ? (
            <Typography color="textSecondary">
              No se encontraron reservas
            </Typography>
          ) : (
            reservasFiltradas.map((reserva) => (
              <Card key={reserva.id} variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Mesa {reserva.mesa?.numero}
                    </Typography>
                    <Chip
                      label={reserva.estado.toUpperCase()}
                      color={getEstadoColor(reserva.estado)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography color="textSecondary" gutterBottom>
                    <strong>Cliente:</strong> {reserva.cliente?.nombre} {reserva.cliente?.apellido}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Fecha:</strong> {dayjs(reserva.fecha).format('DD/MM/YYYY')}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Hora:</strong> {reserva.hora}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Personas:</strong> {reserva.numeroPersonas}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Ubicación:</strong> {reserva.mesa?.ubicacion}
                  </Typography>
                  
                  {reserva.notas && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      <strong>Notas:</strong> {reserva.notas}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions>
                  {reserva.estado === 'pendiente' && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleEstadoChange(reserva, 'confirmada')}
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleEstadoChange(reserva, 'cancelada')}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  
                  {reserva.estado === 'confirmada' && (
                    <>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleEstadoChange(reserva, 'completada')}
                      >
                        Completar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleEstadoChange(reserva, 'cancelada')}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};