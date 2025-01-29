import { MetodoPago } from "./metodoPago";
import { Movimiento } from "./movimiento";

export class CajaMovimiento {
  id!: number;
  monto!: number; // Monto del pago
  montoImpuesto!: number; // Impuestos asociados al pago
  metodoPago!: MetodoPago; // Método de pago utilizado
}
