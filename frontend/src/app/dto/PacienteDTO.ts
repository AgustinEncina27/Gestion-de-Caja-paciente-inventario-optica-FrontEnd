export interface PacienteDTO {
    id: number;
    ficha: number;
  
    nombreCompleto: string;
    direccion?: string;
    obraSocial?: string;
    observaciones?: string;
  
    celular?: string;
    genero?: string;
  
    documento?: string;
    cuit?: string;
    condicionIva?: string;   // enum como string
    tipoDocumento?: string;  // enum como string
  
    correo?: string;
    medico?: string;
  
    creadoEn: string;            // ISO
    ultimaActualizacion: string; // ISO
  
    localId: number;
    localNombre: string;
  }
  