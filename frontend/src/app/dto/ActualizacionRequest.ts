export interface ActualizacionRequest {
    tipo: 'precio' | 'costo';
    tipoCambio: 'porcentaje' | 'fijo';
    valor: number;
    categoria?: number | null;
    proveedor?: number | null;
    material?: number | null;
    marca?: number | null;
  }