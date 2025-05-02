import { Graduacion } from "./graduacion";
import { Local } from "./local";

export class Paciente {
    id!: number;
    nombreCompleto!: string;
    ficha!: number;
    direccion!: string;
    obraSocial!: string;
    celular!: string;
    genero!: string;
    local!: Local;
    graduaciones: Graduacion[] = []; // Lista de graduaciones
    documento!:string;
    correo!:string;
    medico!:string;
    creadoEn!: Date;
    ultimaActualizacion!:Date;
}