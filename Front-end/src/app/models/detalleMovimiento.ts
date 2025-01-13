import { Producto } from "./producto";
import { Movimiento } from "./movimiento";

export class DetalleMovimiento {
  id!: number;
  cantidad!: number; // Cantidad del producto
  precioUnitario!: number; // Precio por unidad
  subtotal!: number; // Subtotal del detalle (cantidad * precioUnitario)
  movimiento!: Movimiento; // Relación con Movimiento (encabezado)
  producto!: Producto; // Relación con Producto
}