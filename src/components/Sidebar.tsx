import { useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../lib/api';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
  disponible: boolean;
}

const SECCIONES: { titulo: string; items: ItemMenu[] }[] = [
  {
    titulo: 'Principal',
    items: [{ ruta: '/dashboard', etiqueta: 'Dashboard', icono: '🏠', disponible: true }],
  },
  {
    titulo: 'Producción',
    items: [
      { ruta: '/ganaderia', etiqueta: 'Ganadería', icono: '🐄', disponible: true },
      { ruta: '/agricultura', etiqueta: 'Agricultura', icono: '🌱', disponible: false },
      { ruta: '/riego', etiqueta: 'Pivotes de riego', icono: '💧', disponible: false },
    ],
  },
  {
    titulo: 'Operaciones',
    items: [
      { ruta: '/maquinaria', etiqueta: 'Maquinaria', icono: '🚜', disponible: false },
      { ruta: '/insumos', etiqueta: 'Insumos y stock', icono: '📦', disponible: false },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function irA(item: ItemMenu) {
    if (!item.disponible) {
      alert(`El módulo "${item.etiqueta}" todavía no está conectado al sistema real. Próximamente.`);
      return;
    }
    navigate(item.ruta);
  }

  function salir() {
    clearToken();
    localStorage.removeItem('agrogestion_usuario');
    navigate('/login');
  }

  return (
    <div style={estilos.sidebar}>
      <div style={estilos.logoRow}>
        <div style={estilos.logoIcon}>🌱</div>
        <div>
          <div style={estilos.logoTitulo}>AgroGestión Pro</div>
          <div style={estilos.logoSubtitulo}>La Criolla</div>
        </div>
      </div>

      {SECCIONES.map((seccion) => (
        <div key={seccion.titulo} style={estilos.seccion}>
          <div style={estilos.tituloSeccion}>{seccion.titulo}</div>
          {seccion.items.map((item) => (
            <div
              key={item.ruta}
              onClick={() => irA(item)}
              style={{
                ...estilos.item,
                ...(location.pathname === item.ruta ? estilos.itemActivo : {}),
                opacity: item.disponible ? 1 : 0.45,
              }}
            >
              <span>{item.icono}</span>
              <span>{item.etiqueta}</span>
            </div>
          ))}
        </div>
      ))}

      <div style={estilos.salir} onClick={salir}>
        <span>🚪</span>
        <span>Salir</span>
      </div>
    </div>
  );
}

const estilos: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 200, flexShrink: 0, background: '#04342C', display: 'flex',
    flexDirection: 'column', padding: '1.25rem 0', minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '0 1rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12,
  },
  logoIcon: {
    width: 28, height: 28, borderRadius: 6, background: '#1D9E75',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
  },
  logoTitulo: { fontSize: 13, fontWeight: 500, color: '#fff', lineHeight: 1.2 },
  logoSubtitulo: { fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  seccion: { padding: '0 0.75rem', marginBottom: 4 },
  tituloSeccion: {
    fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.35)', padding: '0 0.5rem', marginBottom: 4,
  },
  item: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
    borderRadius: 6, cursor: 'pointer', fontSize: 12.5, color: 'rgba(255,255,255,0.65)',
    marginBottom: 1,
  },
  itemActivo: { background: '#1D9E75', color: '#fff' },
  salir: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', margin: '0 0.75rem',
    marginTop: 'auto', borderRadius: 6, cursor: 'pointer', fontSize: 12.5, color: 'rgba(255,255,255,0.65)',
  },
};
