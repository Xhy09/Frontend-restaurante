import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from '../utils/dayjs';

import { mesaService, type Mesa } from '../services/mesaService';

const schema = yup.object({
  numero: yup.number().required('El número de mesa es requerido').min(1),
  capacidad: yup.number().required('La capacidad es requerida').min(1).max(20),
  ubicacion: yup.string().required('La ubicación es requerida'),
  disponible: yup.boolean().required(),
});

type FormData = {
  numero: number;
  capacidad: number;
  ubicacion: string;
  disponible: boolean;
};

const ubicacionesDisponibles = [
  'Ventana',
  'Centro',
  'Terraza',
  'Salón Privado',
  'Barra',
  'Patio',
  'VIP',
];

export const GestionMesas: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      numero: 1,
      capacidad: 2,
      ubicacion: '',
      disponible: true,
    },
  });

  useEffect(() => {
    loadMesas();
  }, []);

  const loadMesas = async () => {
    try {
      setLoading(true);
      const response = await mesaService.getAllMesas();
      setMesas(response.data);
    } catch (err) {
      setError('Error al cargar las mesas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mesa?: Mesa) => {
    if (mesa) {
      setEditingMesa(mesa);
      reset({
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        ubicacion: mesa.ubicacion,
        disponible: mesa.disponible,
      });
    } else {
      setEditingMesa(null);
      reset({
        numero: Math.max(...mesas.map(m => m.numero), 0) + 1,
        capacidad: 2,
        ubicacion: '',
        disponible: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMesa(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      if (editingMesa) {
        await mesaService.updateMesa(editingMesa.id, data);
      } else {
        await mesaService.createMesa(data);
      }
      
      await loadMesas();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la mesa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (mesa: Mesa) => {
    if (confirm(`¿Está seguro de eliminar la mesa ${mesa.numero}?`)) {
      try {
        await mesaService.deleteMesa(mesa.id);
        await loadMesas();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar la mesa');
      }
    }
  };

  const getCapacidadColor = (capacidad: number) => {
    if (capacidad <= 2) return 'primary';
    if (capacidad <= 4) return 'secondary';
    if (capacidad <= 6) return 'warning';
    return 'error';
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
          Gestión de Mesas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Mesa
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          '& > *': { minWidth: '300px', maxWidth: '350px', flex: '1 1 300px' }
        }}
      >
        {mesas.map((mesa) => (
          <Card key={mesa.id} variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">
                  Mesa {mesa.numero}
                </Typography>
                <Chip 
                  label={mesa.disponible ? 'Disponible' : 'No disponible'}
                  color={mesa.disponible ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              
              <Typography color="textSecondary" gutterBottom>
                <strong>Ubicación:</strong> {mesa.ubicacion}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Typography color="textSecondary">
                  <strong>Capacidad:</strong>
                </Typography>
                <Chip 
                  label={`${mesa.capacidad} personas`}
                  color={getCapacidadColor(mesa.capacidad)}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="textSecondary">
                Creada: {dayjs(mesa.fechaCreacion).format('DD/MM/YYYY')}
              </Typography>
            </CardContent>
            
            <CardActions>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleOpenDialog(mesa)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(mesa)}
              >
                Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Dialog para crear/editar mesa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMesa ? 'Editar Mesa' : 'Nueva Mesa'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Controller
                name="numero"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número de mesa"
                    type="number"
                    fullWidth
                    error={!!errors.numero}
                    helperText={errors.numero?.message}
                    inputProps={{ min: 1 }}
                  />
                )}
              />

              <Controller
                name="capacidad"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Capacidad (personas)"
                    type="number"
                    fullWidth
                    error={!!errors.capacidad}
                    helperText={errors.capacidad?.message}
                    inputProps={{ min: 1, max: 20 }}
                  />
                )}
              />

              <Controller
                name="ubicacion"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.ubicacion}>
                    <InputLabel>Ubicación</InputLabel>
                    <Select
                      {...field}
                      label="Ubicación"
                    >
                      {ubicacionesDisponibles.map((ubicacion) => (
                        <MenuItem key={ubicacion} value={ubicacion}>
                          {ubicacion}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.ubicacion && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.ubicacion.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="disponible"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      {...field}
                      label="Estado"
                      value={field.value ? 'true' : 'false'}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <MenuItem value="true">Disponible</MenuItem>
                      <MenuItem value="false">No disponible</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Guardando...' : (editingMesa ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};