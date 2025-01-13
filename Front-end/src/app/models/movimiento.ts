import { Paciente } from "./paciente";
import { DetalleMovimiento } from "./detalleMovimiento";
import { MetodoPago } from "./metodoPago";
import { Local } from "./local";

export class Movimiento {
  id!: number;
  local!: Local;
  tipoMovimiento!: string; // ENTRADA o SALIDA
  fecha!: Date;
  total!: number;
  totalImpuesto!: number;
  descripcion?: string; // Opcional
  paciente!: Paciente; // Relación con Paciente
  detalles!: DetalleMovimiento[]; // Lista de detalles del movimiento
  metodoPago!: MetodoPago; // Forma de pago utilizada en el movimiento
}