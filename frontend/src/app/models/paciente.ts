import { FichaGraduacion } from "./fichaGraducacion";

export class Paciente {
  id!: number;
  nombreCompleto!: string;
  direccion?: string;
  celular!: string;
  documento?: string;
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
