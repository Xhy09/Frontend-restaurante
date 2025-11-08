import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from '../utils/dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { reservaService } from '../services/reservaService';
import { clienteService, type Cliente } from '../services/clienteService';
import { type Mesa } from '../services/mesaService';

interface ReservaFormData {
  fecha: Dayjs | null;
  hora: Dayjs | null;
  numeroPersonas: number;
  clienteId: number;
  mesaId: string;  // Permitir string para el Select
  notas: string;
}

export const NuevaReserva: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mesasDisponibles, setMesasDisponibles] = useState<Mesa[]>([]);
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReservaFormData>({
    defaultValues: {
      fecha: null,
      hora: null,
      numeroPersonas: 2,
      clienteId: 0,
      mesaId: '',  // Cambiar a string vacío para MUI Select
      notas: '',
    },
  });

  const fecha = watch('fecha');
  const hora = watch('hora');
  const numeroPersonas = watch('numeroPersonas');

  useEffect(() => {
    const loadClientes = async () => {
      try {
        const response = await clienteService.getAllClientes();
        setClientes(response.data);
      } catch (err) {
        console.error('Error loading clientes:', err);
      }
    };

    loadClientes();
  }, []);

  useEffect(() => {
    const verificarDisponibilidad = async () => {
      if (fecha && hora && numeroPersonas) {
        try {
          setVerificandoDisponibilidad(true);
          const response = await reservaService.consultarDisponibilidad({
            fecha: fecha.format('YYYY-MM-DD'),
            hora: hora.format('HH:mm'),
            numeroPersonas,
          });
          setMesasDisponibles(response.data.mesasDisponibles);
          setValue('mesaId', ''); // Reset mesa selection
        } catch (err) {
          console.error('Error checking availability:', err);
          setMesasDisponibles([]);
        } finally {
          setVerificandoDisponibilidad(false);
        }
      } else {
        setMesasDisponibles([]);
      }
    };

    const timer = setTimeout(verificarDisponibilidad, 500);
    return () => clearTimeout(timer);
  }, [fecha, hora, numeroPersonas, setValue]);

  const onSubmit = async (data: ReservaFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones básicas
      if (!data.fecha) {
        setError('La fecha es requerida');
        return;
      }
      if (!data.hora) {
        setError('La hora es requerida');
        return;
      }
      if (!data.clienteId) {
        setError('Debe seleccionar un cliente');
        return;
      }
      if (!data.mesaId) {
        setError('Debe seleccionar una mesa');
        return;
      }

      await reservaService.createReserva({
        fecha: data.fecha.format('YYYY-MM-DD'),
        hora: data.hora.format('HH:mm'),
        numeroPersonas: data.numeroPersonas,
        clienteId: data.clienteId,
        mesaId: typeof data.mesaId === 'string' ? parseInt(data.mesaId) : data.mesaId,
        notas: data.notas,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Reserva creada exitosamente! Redirigiendo al dashboard...
        </Alert>
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
          Nueva Reserva
        </Typography>

        <Paper sx={{ p: 3, maxWidth: 600 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Alert severity="error">{error}</Alert>
              )}

              {/* Fecha */}
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de reserva"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={dayjs()}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        error: !!errors.fecha,
                        helperText: errors.fecha?.message,
                        fullWidth: true,
                      }
                    }}
                  />
                )}
              />

              {/* Hora */}
              <Controller
                name="hora"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Hora de reserva"
                    value={field.value}
                    onChange={field.onChange}
                    minTime={dayjs().hour(11).minute(0)}
                    maxTime={dayjs().hour(22).minute(0)}
                    slotProps={{
                      textField: {
                        error: !!errors.hora,
                        helperText: errors.hora?.message,
                        fullWidth: true,
                      }
                    }}
                  />
                )}
              />

              {/* Número de personas */}
              <Controller
                name="numeroPersonas"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número de personas"
                    type="number"
                    fullWidth
                    error={!!errors.numeroPersonas}
                    helperText={errors.numeroPersonas?.message}
                    inputProps={{ min: 1, max: 20 }}
                  />
                )}
              />

              {/* Cliente */}
              <Controller
                name="clienteId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={clientes}
                    getOptionLabel={(cliente) => `${cliente.nombre} ${cliente.apellido} - ${cliente.telefono}`}
                    value={clientes.find(c => c.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || 0)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente"
                        error={!!errors.clienteId}
                        helperText={errors.clienteId?.message}
                        fullWidth
                      />
                    )}
                  />
                )}
              />

              {/* Mesa disponible */}
              {verificandoDisponibilidad ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography>Verificando disponibilidad...</Typography>
                </Box>
              ) : (
                <Controller
                  name="mesaId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.mesaId}>
                      <InputLabel>Mesa disponible</InputLabel>
                      <Select
                        {...field}
                        label="Mesa disponible"
                        disabled={mesasDisponibles.length === 0}
                      >
                        {mesasDisponibles.length === 0 ? (
                          <MenuItem disabled>
                            {fecha && hora && numeroPersonas 
                              ? 'No hay mesas disponibles para esta fecha y hora'
                              : 'Complete fecha, hora y número de personas primero'
                            }
                          </MenuItem>
                        ) : (
                          mesasDisponibles.map((mesa) => (
                            <MenuItem key={mesa.id} value={mesa.id}>
                              Mesa {mesa.numero} - {mesa.ubicacion} (Cap: {mesa.capacidad})
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {errors.mesaId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.mesaId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              )}

              {/* Notas */}
              <Controller
                name="notas"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas especiales (opcional)"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.notas}
                    helperText={errors.notas?.message}
                  />
                )}
              />

              {/* Botones */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || mesasDisponibles.length === 0}
                >
                  {loading ? 'Creando...' : 'Crear Reserva'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};