import { MetodoPago } from "./metodoPago";

export class CajaMovimiento {
  id!: number;
  monto!: number; // Monto del pago
  montoImpuesto!: number; // Impuestos asociados al pago
  metodoPago!: MetodoPago; // Método de pago utilizado
  fecha!: string;
}
