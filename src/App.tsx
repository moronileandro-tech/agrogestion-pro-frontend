import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ganaderia from './pages/Ganaderia';

function estaAutenticado() {
  return !!localStorage.getItem('agrogestion_token');
}

function RutaProtegida({ children }: { children: React.ReactNode }) {
  if (!estaAutenticado()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/ganaderia"
          element={
            <RutaProtegida>
              <Ganaderia />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to={estaAutenticado() ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
