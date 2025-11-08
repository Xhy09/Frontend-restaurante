import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from '../utils/dayjs';

import { clienteService, type Cliente } from '../services/clienteService';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  apellido: yup.string().required('El apellido es requerido'),
  telefono: yup.string().required('El teléfono es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
});

type FormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
};

export const HistorialClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedClients, setExpandedClients] = useState<Set<number>>(new Set());
  const [clientHistories, setClientHistories] = useState<{[key: number]: any[]}>({});

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientesResponse, frecuentesResponse] = await Promise.all([
        clienteService.getAllClientes(),
        clienteService.getClientesFrecuentes(),
      ]);
      setClientes(clientesResponse.data);
      setClientesFrecuentes(frecuentesResponse.data);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadClientHistory = async (clienteId: number) => {
    if (clientHistories[clienteId]) return; // Ya cargado

    try {
      const response = await clienteService.getHistorialCliente(clienteId);
      setClientHistories(prev => ({
        ...prev,
        [clienteId]: response.data
      }));
    } catch (err) {
      console.error('Error loading client history:', err);
    }
  };

  const handleExpandClick = (clienteId: number) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clienteId)) {
      newExpanded.delete(clienteId);
    } else {
      newExpanded.add(clienteId);
      loadClientHistory(clienteId);
    }
    setExpandedClients(newExpanded);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    try {
      setLoading(true);
      const response = await clienteService.searchClientes(searchTerm);
      setClientes(response.data);
    } catch (err) {
      setError('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      await clienteService.createCliente(data);
      await loadData();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
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

  const isFrecuente = (clienteId: number) => {
    return clientesFrecuentes.some(c => c.id === clienteId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Historial de Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Búsqueda */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Buscar por nombre o teléfono"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Buscar
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setSearchTerm('');
            loadData();
          }}
        >
          Limpiar
        </Button>
      </Box>

      {/* Lista de clientes */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2
        }}
      >
        {clientes.map((cliente) => (
          <Card key={cliente.id} variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">
                    {cliente.nombre} {cliente.apellido}
                  </Typography>
                  {isFrecuente(cliente.id) && (
                    <Chip
                      icon={<StarIcon />}
                      label="Cliente Frecuente"
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
                <IconButton
                  onClick={() => handleExpandClick(cliente.id)}
                  size="small"
                >
                  {expandedClients.has(cliente.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Box display="flex" gap={4} mb={2}>
                <Typography color="textSecondary">
                  <strong>Teléfono:</strong> {cliente.telefono}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Email:</strong> {cliente.email}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Visitas:</strong> {cliente.numeroVisitas}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="textSecondary">
                Registrado: {dayjs(cliente.fechaRegistro).format('DD/MM/YYYY')}
              </Typography>

              {/* Historial expandible */}
              <Collapse in={expandedClients.has(cliente.id)}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" gutterBottom>
                    Historial de Reservas
                  </Typography>
                  
                  {!clientHistories[cliente.id] ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : clientHistories[cliente.id].length === 0 ? (
                    <Typography color="textSecondary">
                      No hay reservas en el historial
                    </Typography>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 1,
                        maxHeight: 300,
                        overflow: 'auto'
                      }}
                    >
                      {clientHistories[cliente.id].map((reserva: any) => (
                        <Box
                          key={reserva.id}
                          sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            bgcolor: 'background.paper'
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2">
                              <strong>Mesa {reserva.mesa?.numero}</strong> - {dayjs(reserva.fecha).format('DD/MM/YYYY')} a las {reserva.hora}
                            </Typography>
                            <Chip
                              label={reserva.estado.toUpperCase()}
                              color={getEstadoColor(reserva.estado)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Personas: {reserva.numeroPersonas} | Ubicación: {reserva.mesa?.ubicacion}
                          </Typography>
                          {reserva.notas && (
                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                              Notas: {reserva.notas}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog para nuevo cliente */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                  />
                )}
              />

              <Controller
                name="apellido"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellido"
                    fullWidth
                    error={!!errors.apellido}
                    helperText={errors.apellido?.message}
                  />
                )}
              />

              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear Cliente'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};