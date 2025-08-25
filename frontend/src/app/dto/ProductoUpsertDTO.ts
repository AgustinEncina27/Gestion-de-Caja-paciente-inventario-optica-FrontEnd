export interface ProductoUpsertDTO {
    marcaId: number;
    localId: number;
    modelo: string;
    descripcion?: string;
    precio: number;
    costo?: number;
    materialId?: number;
    genero?: string;
    categoriaIds?: number[];
    proveedorIds?: number[];
    stock: number;
  }
  