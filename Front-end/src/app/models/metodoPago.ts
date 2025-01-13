export class MetodoPago {
    id!: number;
    nombre!: string; // Nombre del método de pago (por ejemplo, efectivo, débito, crédito)
    descripcion?: string; // Opcional
    impuesto!: number;
  }