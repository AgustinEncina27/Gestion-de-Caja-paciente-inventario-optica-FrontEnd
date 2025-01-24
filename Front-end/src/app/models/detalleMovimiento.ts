import { Producto } from "./producto";

export class DetalleMovimiento {
  id!: number;
  cantidad!: number; // Cantidad del producto
  precioUnitario!: number; // Precio por unidad
  subtotal!: number; // Subtotal del detalle (cantidad * precioUnitario)
  producto!: Producto; // Relación con Producto
}