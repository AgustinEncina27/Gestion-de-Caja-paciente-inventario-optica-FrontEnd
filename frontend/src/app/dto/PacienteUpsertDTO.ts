export interface PacienteUpsertDTO {
    ficha?: number;
  
    nombreCompleto: string;
    direccion?: string;
    obraSocial?: string;
    observaciones?: string;
  
    celular?: string;
    genero?: string;
  
    documento?: string;
    cuit?: string;
    condicionIva?: string;   // RESPONSABLE_INSCRIPTO | MONOTRIBUTISTA | EXENTO | CONSUMIDOR_FINAL
    tipoDocumento?: string;  // DNI | CUIT | CUIL | PASAPORTE | OTRO
  
    correo?: string;
    medico?: string;
  }
  