
// Cliente HTTP centralizado: toda comunicación con el backend pasa por acá.
// La URL del backend se configura como variable de entorno (VITE_API_URL),
// así el mismo código sirve para desarrollo local y para producción en Railway.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  return localStorage.getItem('agrogestion_token');
}

export function setToken(token: string) {
  localStorage.setItem('agrogestion_token', token);
}

export function clearToken() {
  localStorage.removeItem('agrogestion_token');
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

// Función única para todas las llamadas a la API.
// Agrega automáticamente el token de autenticación si existe.
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Si el token venció o es inválido, el backend responde 401.
  // En ese caso, limpiamos la sesión y mandamos al login automáticamente
  // en lugar de mostrar un error confuso en cada módulo.
  if (res.status === 401) {
    clearToken();
    localStorage.removeItem('agrogestion_usuario');
    window.location.href = '/login';
    throw new Error('Sesión vencida, redirigiendo al login');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${res.status}`);
  }

  return res.json();
}
