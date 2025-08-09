import { FichaGraduacion } from "./fichaGraducacion";

export class Paciente {
  id!: number;
  nombreCompleto!: string;
  direccion?: string;
  celular!: string;
  documento?: string;
  tipoDocumento?: 'DNI' | 'CUIT' | 'CUIL' | 'PASAPORTE' | 'OTRO';
  condicionIva?: 'CONSUMIDOR_FINAL' | 'MONOTRIBUTISTA' | 'RESPONSABLE_INSCRIPTO' | 'EXENTO';
  correo?: string;
  medico?: string;
  obraSocial?: string;
  observaciones?: string;
  genero!: string;
  local: any;
  ficha!: number;
  creadoEn!: Date;
  ultimaActualizacion!: Date;
  historialFichas: FichaGraduacion[] = [];
}
