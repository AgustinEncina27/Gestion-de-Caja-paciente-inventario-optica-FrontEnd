import { Local } from "./local";

export class Paciente {
    id!: number;
    nombreCompleto!: string;
    ficha!: number;
    direccion!: string;
    celular!: string;
    genero!: string;
    local!: Local;
    graduacion!: string;
    documento!:string;
    correo!:string;
    medico!:string;
    fechaDeControl!: Date;
    creadoEn!: Date;
    ultimaActualizacion!:Date;
}