import { Paciente } from "./paciente";
import { DetalleMovimiento } from "./detalleMovimiento";
import { Local } from "./local";
import { CajaMovimiento } from "./cajaMovimiento"; // Nueva clase para pagos
import { DetalleAdicional } from "./detalleAdicional";

export class Movimiento {
  id!: number;
  tipoMovimiento!: string; // ENTRADA o SALIDA
  fecha!: string;
  total!: number;
  descuento!: number;
  totalImpuesto!: number;
  descripcion?: string; // Opcional
  paciente: Paciente | null = null; // Relación con Paciente
  detallesAdicionales: DetalleAdicional[] | null = null; // Lista de detalles del movimiento
  detalles: DetalleMovimiento[] | null = null; // Lista de detalles del movimiento
  cajaMovimientos!: CajaMovimiento[]; // Lista de pagos asociados al movimiento
  local!: Local;
  estadoMovimiento: string | null = null; // Puede ser una cadena o nulo
}
