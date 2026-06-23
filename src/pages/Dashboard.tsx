import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/api';
import { EstadisticasRodeo } from '../lib/types';

interface ModuloCard {
  ruta: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  disponible: boolean;
}

const MODULOS: ModuloCard[] = [
  { ruta: '/ganaderia', nombre: 'Ganadería', descripcion: 'Trazabilidad individual, reproducción, sanidad y movimientos del rodeo', icono: '🐄', color: '#1D9E75', disponible: true },
  { ruta: '/agricultura', nombre: 'Agricultura', descripcion: 'Lotes, campañas, labores, contratistas y resultado por cultivo', icono: '🌱', color: '#639922', disponible: false },
  { ruta: '/riego', nombre: 'Pivotes de riego', descripcion: 'Historial de láminas, mantenimiento y costo del agua por lote', icono: '💧', color: '#185FA5', disponible: false },
  { ruta: '/maquinaria', nombre: 'Maquinaria', descripcion: 'Flota, horas de uso, combustible y mantenimiento preventivo', icono: '🚜', color: '#BA7517', disponible: false },
  { ruta: '/insumos', nombre: 'Insumos y stock', descripcion: 'Agroquímicos, semillas, productos veterinarios', icono: '📦', color: '#5F5E5A', disponible: false },
  { ruta: '/finanzas', nombre: 'Finanzas', descripcion: 'Costos reales por actividad, márgenes y flujo de caja', icono: '📊', color: '#533AB7', disponible: false },
];

export default function Dashboard() {
  const [stats, setStats] = useState<EstadisticasRodeo | null>(null);
  const [usuario, setUsuario] = useState<{ nombre: string; rol: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('agrogestion_usuario');
    if (u) setUsuario(JSON.parse(u));

    api<EstadisticasRodeo>('/api/ganaderia/estadisticas')
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  function irAModulo(modulo: ModuloCard) {
    if (!modulo.disponible) {
      alert(`El módulo "${modulo.nombre}" todavía no está conectado al sistema real. Próximamente.`);
      return;
    }
    navigate(modulo.ruta);
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div style={estilos.topbar}>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Dashboard</h2>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#5F5E5A' }}>
              {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={estilos.badge}>{usuario?.rol || 'Usuario'}</span>
            <div style={estilos.avatar}>{usuario?.nombre?.slice(0, 2).toUpperCase() || 'JC'}</div>
          </div>
        </div>

        <div style={{ padding: 24, background: '#F5F4EF', minHeight: 'calc(100vh - 60px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
            <Tarjeta label="Rodeo total" valor={stats ? String(stats.total) : '—'} sub="cabezas activas" />
            <Tarjeta label="Vacas de cría" valor={stats ? String(stats.vacasCria) : '—'} sub="en producción" />
            <Tarjeta label="Invernada" valor={stats ? String(stats.invernada) : '—'} sub="novillos y vaquillonas" />
            <Tarjeta label="Otros módulos" valor="—" sub="próximamente" />
          </div>

          <div style={estilos.tituloSeccion}>Módulos del sistema</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {MODULOS.map((m) => (
              <div
                key={m.ruta}
                onClick={() => irAModulo(m)}
                style={{ ...estilos.moduloCard, opacity: m.disponible ? 1 : 0.55, cursor: 'pointer' }}
              >
                <div style={{ ...estilos.moduloIcono, background: m.color }}>{m.icono}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
                  {m.nombre} {!m.disponible && <span style={{ fontSize: 10, color: '#BA7517' }}>(próximamente)</span>}
                </div>
                <div style={{ fontSize: 11, color: '#5F5E5A', lineHeight: 1.4 }}>{m.descripcion}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tarjeta({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div style={estilos.statCard}>
      <div style={{ fontSize: 11, color: '#5F5E5A', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{valor}</div>
      <div style={{ fontSize: 11, color: '#1D9E75', marginTop: 3 }}>{sub}</div>
    </div>
  );
}

const estilos: Record<string, React.CSSProperties> = {
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', borderBottom: '1px solid #D3D1C7', background: '#fff',
  },
  badge: { fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#E1F5EE', color: '#085041' },
  avatar: {
    width: 30, height: 30, borderRadius: '50%', background: '#1D9E75', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500,
  },
  statCard: { background: '#fff', border: '1px solid #D3D1C7', borderRadius: 10, padding: '14px 16px' },
  tituloSeccion: { fontSize: 11, fontWeight: 500, color: '#5F5E5A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' },
  moduloCard: { background: '#fff', border: '1px solid #D3D1C7', borderRadius: 14, padding: 16 },
  moduloIcono: { width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 16 },
};
