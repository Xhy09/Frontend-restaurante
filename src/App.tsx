import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { NuevaReserva } from './pages/NuevaReserva';
import { GestionMesas } from './pages/GestionMesas';
import { HistorialClientes } from './pages/HistorialClientes';
import { ListaReservas } from './pages/ListaReservas';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nueva-reserva" element={<NuevaReserva />} />
          <Route path="/mesas" element={<GestionMesas />} />
          <Route path="/clientes" element={<HistorialClientes />} />
          <Route path="/reservas" element={<ListaReservas />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
