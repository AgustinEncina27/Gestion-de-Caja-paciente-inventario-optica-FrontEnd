// src/app/dto/movimiento.dto.ts

/** Enums como string-union (idénticos a backend) */
export type TipoMovimiento = 'ENTRADA' | 'SALIDA';
export type EstadoMovimiento =
  | 'PEDIDO_CRISTALES'
  | 'ARMANDO_PEDIDO'
  | 'ANTEOJO_TERMINADO'
  | 'ENTREGADO';

/** ========= Detalles de productos ========= */

export interface DetalleMovimientoDTO {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;

  productoId: number;
  productoModelo?: string;
  marcaNombre?: string;
}

export interface DetalleMovimientoUpsertDTO {
  productoId: number;       // requerido
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/** ========= Detalles adicionales (texto + $) ========= */

export interface DetalleAdicionalDTO {
  id?: number;
  descripcion: string;
  subtotal: number;
}

export interface DetalleAdicionalUpsertDTO {
  descripcion: string;
  subtotal: number;
}

/** ========= Detalle de tarjeta (opcional dentro de cada pago) ========= */

export interface TarjetaDetalleDTO {
  id?: number;
  cuotas?: number | null;
  ultimos4?: string | null;
  autorizacion?: string | null;
}

export interface TarjetaDetalleUpsertDTO {
  cuotas?: number | null;
  ultimos4?: string | null;
  autorizacion?: string | null;
}

/** ========= Pagos (CajaMovimiento) ========= */

export interface CajaMovimientoDTO {
  id?: number;
  monto: number;
  montoImpuesto: number;
  fecha: string;            // ISO-8601 (yyyy-MM-ddTHH:mm:ss) o (yyyy-MM-dd) si tu back lo permite
  metodoPagoId: number;     // id del método de pago
  metodoPago?: string;      // nombre/tipo (informativo)
  descripcionOtras?: string | null;

  tarjeta?: TarjetaDetalleDTO | null;
}

export interface CajaMovimientoUpsertDTO {
  metodoPagoId: number;     // requerido
  monto: number;
  montoImpuesto: number;
  fecha?: string | null;    // si null, el backend puede setear "ahora"
  descripcionOtras?: string | null;

  tarjeta?: TarjetaDetalleUpsertDTO | null;
}

/** ========= Movimiento (lectura) ========= */

export interface MovimientoDTO {
  id: number;

  tipoMovimiento: TipoMovimiento;  // ENTRADA | SALIDA
  fecha: string;                   // ISO-8601 (yyyy-MM-dd'T'HH:mm:ss)
  total: number;
  descuento?: number | null;
  totalImpuesto: number;
  descripcion?: string | null;
  vendedor?: string | null;
  estadoMovimiento?: EstadoMovimiento | null;

  // Paciente (informativo)
  pacienteId?: number | null;
  pacienteNombre?: string | null;

  // Local (informativo)
  localId?: number | null;
  localNombre?: string | null;

  detalles: DetalleMovimientoDTO[];
  detallesAdicionales: DetalleAdicionalDTO[];
  pagos: CajaMovimientoDTO[];
}

/** ========= Movimiento (alta/edición) ========= */

export interface MovimientoUpsertDTO {
  tipoMovimiento: TipoMovimiento;     // requerido
  fecha?: string | null;               // opcional (si null => back pone "ahora")
  total?: number | null;               // opcional (si recalculás en back, podés enviar null)
  descuento?: number | null;
  totalImpuesto?: number | null;
  descripcion?: string | null;
  vendedor?: string | null;
  estadoMovimiento?: EstadoMovimiento | null;

  pacienteId?: number | null;          // opcional: movimiento sin paciente

  // reemplazo total
  detalles: DetalleMovimientoUpsertDTO[];
  detallesAdicionales: DetalleAdicionalUpsertDTO[];
  pagos: CajaMovimientoUpsertDTO[];
}

/** ========= Paginado genérico ========= */
export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** ========= Filtros del endpoint /filtrar ========= */
export interface MovimientosFiltro {
  local?: number;
  tipoMovimiento?: TipoMovimiento;
  nombrePaciente?: string;
  fecha?: string;       // yyyy-MM-dd
  metodoPago?: string;  // enum del back como string (p.ej. "EFECTIVO", "TARJETA", etc.)
}

/** ========= Helpers opcionales ========= */
export const makeEmptyMovimientoUpsert = (tipo: TipoMovimiento = 'ENTRADA'): MovimientoUpsertDTO => ({
  tipoMovimiento: tipo,
  fecha: null,
  total: null,
  descuento: null,
  totalImpuesto: null,
  descripcion: null,
  vendedor: null,
  estadoMovimiento: null,
  pacienteId: null,
  detalles: [],
  detallesAdicionales: [],
  pagos: [],
});
