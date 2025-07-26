export class TipoTarjeta {
    id!: number;
    nombre!: string; // Ej: VISA, MASTERCARD, OTRA
    tipo!: 'CREDITO' | 'DEBITO'; // Se puede usar enum si preferís
  }