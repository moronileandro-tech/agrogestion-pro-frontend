import { useEffect, useState, FormEvent } from 'react';
import { api } from '../lib/api';
import { Animal, EstadisticasRodeo, ETIQUETAS_CATEGORIA, CategoriaAnimal } from '../lib/types';

export default function Ganaderia() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [stats, setStats] = useState<EstadisticasRodeo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  async function cargarDatos() {
    setCargando(true);
    try {
      const [listaAnimales, estadisticas] = await Promise.all([
        api<Animal[]>('/api/ganaderia/animales'),
        api<EstadisticasRodeo>('/api/ganaderia/estadisticas'),
      ]);
      setAnimales(listaAnimales);
      setStats(estadisticas);
      setError('');
    } catch (err: any) {
      setError('No se pudo cargar la información del rodeo');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function handleCrearAnimal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api('/api/ganaderia/animales', {
        method: 'POST',
        body: {
          caravanaInterna: form.get('caravanaInterna'),
          caravanaSenasa: form.get('caravanaSenasa') || undefined,
          categoria: form.get('categoria'),
          fechaIngreso: form.get('fechaIngreso'),
          procedencia: form.get('procedencia'),
        },
      });
      setMostrarForm(false);
      cargarDatos(); // recarga la lista con el animal nuevo ya guardado en la base real
    } catch (err: any) {
      alert('No se pudo guardar el animal: ' + err.message);
    }
  }

  if (cargando) return <p style={{ padding: 24 }}>Cargando rodeo...</p>;
  if (error) return <p style={{ padding: 24, color: '#E24B4A' }}>{error}</p>;

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: 4 }}>Ganadería</h2>
      <p style={{ color: '#5F5E5A', marginTop: 0 }}>Rodeo bovino — datos en vivo desde la base de datos</p>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, margin: '20px 0' }}>
          <Tarjeta label="Total rodeo" valor={stats.total} />
          <Tarjeta label="Vacas de cría" valor={stats.vacasCria} />
          <Tarjeta label="Terneros/as" valor={stats.terneros} />
          <Tarjeta label="Invernada" valor={stats.invernada} />
          <Tarjeta label="Toros" valor={stats.toros} />
        </div>
      )}

      <button onClick={() => setMostrarForm(!mostrarForm)} style={btnPrimary}>
        {mostrarForm ? 'Cancelar' : '+ Nuevo animal'}
      </button>

      {mostrarForm && (
        <form onSubmit={handleCrearAnimal} style={formStyle}>
          <input name="caravanaInterna" placeholder="Caravana interna (ej: AR-0500)" required style={inputStyle} />
          <input name="caravanaSenasa" placeholder="Caravana SENASA (opcional)" style={inputStyle} />
          <select name="categoria" required style={inputStyle}>
            {Object.entries(ETIQUETAS_CATEGORIA).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </select>
          <input name="fechaIngreso" type="date" required style={inputStyle} defaultValue={new Date().toISOString().slice(0, 10)} />
          <input name="procedencia" placeholder="Procedencia (ej: Nacido en establecimiento)" required style={inputStyle} />
          <button type="submit" style={btnPrimary}>Guardar animal</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F1EFE8', textAlign: 'left' }}>
            <th style={th}>Caravana</th>
            <th style={th}>Categoría</th>
            <th style={th}>Potrero</th>
            <th style={th}>Ingreso</th>
            <th style={th}>Último peso</th>
          </tr>
        </thead>
        <tbody>
          {animales.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#5F5E5A' }}>
              Todavía no hay animales registrados. Usá "Nuevo animal" para cargar el primero.
            </td></tr>
          ) : animales.map((a) => (
            <tr key={a.id}>
              <td style={td}><strong>{a.caravanaInterna}</strong></td>
              <td style={td}>{ETIQUETAS_CATEGORIA[a.categoria]}</td>
              <td style={td}>{a.potreroActual?.nombre || '—'}</td>
              <td style={td}>{new Date(a.fechaIngreso).toLocaleDateString('es-AR')}</td>
              <td style={td}>{a.pesadas[0] ? `${a.pesadas[0].pesoKg} kg` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tarjeta({ label, valor }: { label: string; valor: number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #D3D1C7', borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontSize: 11, color: '#5F5E5A' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{valor}</div>
    </div>
  );
}

const th: React.CSSProperties = { padding: '8px 12px', fontSize: 11, color: '#5F5E5A', borderBottom: '1px solid #D3D1C7' };
const td: React.CSSProperties = { padding: '9px 12px', borderBottom: '1px solid #D3D1C7' };
const btnPrimary: React.CSSProperties = { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' };
const formStyle: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0', padding: 16, background: '#fff', border: '1px solid #D3D1C7', borderRadius: 10 };
const inputStyle: React.CSSProperties = { padding: '8px 10px', fontSize: 13, border: '1px solid #D3D1C7', borderRadius: 8 };
