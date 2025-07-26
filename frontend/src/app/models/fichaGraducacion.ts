import { CristalHistorial } from './cristalHistorial';
import { Graduacion } from './graduacion';

export class FichaGraduacion {
  id?: number;
  fecha: string = new Date().toISOString().slice(0, 10);
  
  dnpDerecho?: number;
  dnpIzquierdo?: number;
  alturaPupilarDerecho?: number;
  alturaPupilarIzquierdo?: number;
  alturaPelicula?: number;

  puente?: number;
  diagonalMayor?: number;
  largo?: number;
  alturaArmazon?: number;

  graduaciones: Graduacion[] = [];

  adicionDerecho: number | null = null;
  adicionIzquierdo: number | null = null;

  cristales?: CristalHistorial[] = [];
}
