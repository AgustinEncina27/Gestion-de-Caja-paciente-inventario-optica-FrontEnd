// Tipos y DTOs de Ficha de Graduación

export type Ojo = 'DERECHO' | 'IZQUIERDO';
export type TipoGraduacion = 'LEJOS' | 'CERCA';

export interface GraduacionDTO {
  id?: number;
  ojo: Ojo;
  tipo: TipoGraduacion;
  esferico?: number | null;
  cilindrico?: number | null;
  eje?: number | null;
}

export interface GraduacionUpsertDTO {
  ojo: Ojo;
  tipo: TipoGraduacion;
  esferico?: number | null;
  cilindrico?: number | null;
  eje?: number | null;
}

export interface CristalHistorialDTO {
  id?: number;
  nombre: string;
  fecha: string; // yyyy-MM-dd
}

export interface CristalUpsertDTO {
  nombre: string;
  fecha?: string | null; // si es null/undefined, el backend usa hoy
}

export interface FichaGraduacionDTO {
  id: number;
  fecha: string; // yyyy-MM-dd

  dnpDerecho?: number | null;
  dnpIzquierdo?: number | null;
  alturaPupilarDerecho?: number | null;
  alturaPupilarIzquierdo?: number | null;
  alturaPelicula?: number | null;

  puente?: number | null;
  diagonalMayor?: number | null;
  largo?: number | null;
  alturaArmazon?: number | null;

  adicionDerecho?: number | null;
  adicionIzquierdo?: number | null;

  pacienteId: number;
  pacienteNombre?: string;

  graduaciones: GraduacionDTO[];
  cristales: CristalHistorialDTO[];
}

export interface FichaGraduacionUpsertDTO {
  fecha?: string | null;

  dnpDerecho?: number | null;
  dnpIzquierdo?: number | null;
  alturaPupilarDerecho?: number | null;
  alturaPupilarIzquierdo?: number | null;
  alturaPelicula?: number | null;

  puente?: number | null;
  diagonalMayor?: number | null;
  largo?: number | null;
  alturaArmazon?: number | null;

  adicionDerecho?: number | null;
  adicionIzquierdo?: number | null;

  graduaciones?: GraduacionUpsertDTO[] | null;
  cristales?: CristalUpsertDTO[] | null;
}
