export type CategoriaAnimal = 'VACA_CRIA' | 'VAQUILLONA' | 'TERNERO' | 'TERNERA' | 'NOVILLO' | 'TORO';

export interface Animal {
  id: string;
  caravanaInterna: string;
  caravanaSenasa: string | null;
  categoria: CategoriaAnimal;
  fechaIngreso: string;
  procedencia: string;
  potreroActual: { id: string; nombre: string; rodeo: string | null } | null;
  pesadas: { pesoKg: string; fecha: string }[];
}

export interface EstadisticasRodeo {
  total: number;
  vacasCria: number;
  terneros: number;
  invernada: number;
  toros: number;
}

export interface LoginResponse {
  token: string;
  usuario: { id: string; nombre: string; rol: string };
}

export const ETIQUETAS_CATEGORIA: Record<CategoriaAnimal, string> = {
  VACA_CRIA: 'Vaca de cría',
  VAQUILLONA: 'Vaquillona',
  TERNERO: 'Ternero',
  TERNERA: 'Ternera',
  NOVILLO: 'Novillo',
  TORO: 'Toro',
};
