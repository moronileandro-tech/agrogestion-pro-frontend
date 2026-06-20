import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../lib/api';
import { LoginResponse } from '../lib/types';

export default function Login() {
  const [email, setEmail] = useState('admin@lacriolla.com.ar');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const data = await api<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(data.token);
      localStorage.setItem('agrogestion_usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err: any) {
      setError('Email o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🌱</div>
          <div>
            <h1 style={styles.title}>AgroGestión Pro</h1>
            <p style={styles.subtitle}>Estancia La Criolla</p>
          </div>
        </div>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label}>Contraseña</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar al sistema'}
        </button>

        <p style={styles.footer}>AgroGestión Pro · Estancia La Criolla, 25 de Mayo</p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#F1EFE8',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: '#fff',
    border: '1px solid #D3D1C7',
    borderRadius: 16,
    padding: '2rem',
    width: 360,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.75rem' },
  logoIcon: {
    width: 40, height: 40, borderRadius: 8, background: '#1D9E75',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
  },
  title: { fontSize: 16, fontWeight: 500, margin: 0, color: '#1a1a1a' },
  subtitle: { fontSize: 12, color: '#5F5E5A', margin: '2px 0 0' },
  label: { display: 'block', fontSize: 12, color: '#5F5E5A', marginBottom: 5, marginTop: 12 },
  input: {
    width: '100%', padding: '8px 10px', fontSize: 14, border: '1px solid #D3D1C7',
    borderRadius: 8, boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: 9, background: '#1D9E75', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: 14, cursor: 'pointer', marginTop: 18,
  },
  error: { color: '#E24B4A', fontSize: 12, marginTop: 10 },
  footer: { fontSize: 11, color: '#5F5E5A', textAlign: 'center', marginTop: 20 },
};
