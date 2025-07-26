import { MetodoPago } from "./metodoPago";
import { TarjetaDetalle } from "./tarjetaDetalle";

export class CajaMovimiento {
  id!: number;
  monto!: number; // Monto del pago
  montoImpuesto!: number; // Impuestos asociados al pago
  metodoPago!: MetodoPago; // Método de pago utilizado
  descripcionOtras?: string;
  fecha!: string;
  tarjetaDetalle?: TarjetaDetalle; // <--- AHORA va acá
}
