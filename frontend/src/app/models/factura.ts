import { Movimiento } from "./movimiento";

export interface Factura {
    id: number;
    tipoComprobante: TipoComprobante;
    puntoVenta: number;
    numeroComprobante: number;
    cae: string;
    fechaCaeVencimiento: string; // Se puede parsear a Date si lo necesitás
    fechaEmision: string;
    tipoCliente: TipoCliente;
    movimiento: Movimiento; // suponiendo que ya tenés el modelo Movimiento
  }
  
  export type TipoComprobante =
    | 'FACTURA_A'
    | 'FACTURA_B'
    | 'FACTURA_C'
    | 'NOTA_CREDITO_A'
    | 'NOTA_CREDITO_B'
    | 'NOTA_CREDITO_C'
    | 'NOTA_DEBITO_A'
    | 'NOTA_DEBITO_B'
    | 'NOTA_DEBITO_C';
  
  export type TipoCliente =
    | 'RESPONSABLE_INSCRIPTO'
    | 'MONOTRIBUTISTA'
    | 'CONSUMIDOR_FINAL'
    | 'EXENTO'
    | 'NO_CATEGORIZADO';