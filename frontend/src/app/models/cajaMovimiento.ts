import { MetodoPago } from "./metodoPago";

export class CajaMovimiento {
  id!: number;
  monto : number | null = null; // Monto del pago subtotal: number | null = null;
  montoImpuesto: number | null = null; // Impuestos asociados al pago
  metodoPago!: MetodoPago; // Método de pago utilizado
  fecha!: string;
}
