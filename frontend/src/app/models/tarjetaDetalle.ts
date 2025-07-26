import { TipoTarjeta } from "./tipoTarjeta";

export class TarjetaDetalle {
  id?: number;
  tipoTarjeta?: TipoTarjeta ;
  nombreOtro?: string; // Solo si elige "OTRA"
  numero?: string; // Se requiere en el formulario, pero no se expone en PDF
}