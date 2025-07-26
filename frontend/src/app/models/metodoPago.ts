import { TarjetaDetalle } from "./tarjetaDetalle";

export class MetodoPago {
  id?: number;
  tipo!: 'CONTADO' | 'CHEQUE' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'CUENTA_CORRIENTE' | 'TRANSFERENCIA' | 'OTRA';
}