import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { reservaService, type Reserva, type Estadisticas } from '../services/reservaService';
import dayjs from '../utils/dayjs';
import { DATE_FORMATS, ESTADO_COLORS } from '../utils/constants';

export const Dashboard: React.FC = () => {
  const [reservasHoy, setReservasHoy] = useState<Reserva[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [reservasResponse, estadisticasResponse] = await Promise.all([
          reservaService.getReservasHoy(),
          reservaService.getEstadisticas(),
        ]);
        
        setReservasHoy(reservasResponse.data);
        setEstadisticas(estadisticasResponse.data);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getEstadoColor = (estado: string) => {
    return ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS] || '#666';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard del Restaurante
      </Typography>

      {/* Estadísticas */}
      {estadisticas && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 4,
            '& > *': { minWidth: '200px', flex: '1 1 200px' }
          }}
        >
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Reservas
              </Typography>
              <Typography variant="h4">
                {estadisticas.totalReservas}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pendientes
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff9800' }}>
                {estadisticas.reservasPendientes}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Confirmadas
              </Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>
                {estadisticas.reservasConfirmadas}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Canceladas
              </Typography>
              <Typography variant="h4" sx={{ color: '#f44336' }}>
                {estadisticas.reservasCanceladas}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completadas
              </Typography>
              <Typography variant="h4" sx={{ color: '#2196f3' }}>
                {estadisticas.reservasCompletadas}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Reservas de hoy */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reservas de Hoy
        </Typography>
        
        {reservasHoy.length === 0 ? (
          <Typography color="textSecondary">
            No hay reservas para hoy
          </Typography>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': { minWidth: '300px', maxWidth: '400px', flex: '1 1 300px' }
            }}
          >
            {reservasHoy.map((reserva) => (
              <Card variant="outlined" key={reserva.id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">
                      Mesa {reserva.mesa?.numero}
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: getEstadoColor(reserva.estado),
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    >
                      {reserva.estado.toUpperCase()}
                    </Box>
                  </Box>
                  
                  <Typography color="textSecondary" gutterBottom>
                    {reserva.cliente?.nombre} {reserva.cliente?.apellido}
                  </Typography>
                  
                  <Typography variant="body2">
                    Hora: {reserva.hora}
                  </Typography>
                  
                  <Typography variant="body2">
                    Personas: {reserva.numeroPersonas}
                  </Typography>
                  
                  {reserva.notas && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                      Notas: {reserva.notas}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};