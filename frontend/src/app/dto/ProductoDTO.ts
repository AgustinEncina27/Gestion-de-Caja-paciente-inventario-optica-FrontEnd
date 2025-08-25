import { IdNameDTO } from "./IdNameDTO";

export interface ProductoDTO {
  id: number;

  marcaId: number;
  marcaNombre: string;

  modelo: string;
  descripcion?: string;
  precio: number;
  costo?: number;

  materialId?: number;
  materialNombre?: string;

  genero?: string;

  categorias: IdNameDTO[];
  proveedores: IdNameDTO[];

  localId: number;
  localNombre: string;

  stock: number;

  creadoEn: string;           // ISO string del backend
  ultimaActualizacion: string;
}
