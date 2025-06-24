import { Categoria } from "./categoria";
import { Marca } from "./marca";
import { MaterialProducto } from "./materialProducto";
import { ProductoLocal } from "./productoLocal";
import { Proveedor } from "./proveedor";


export class Producto {
    id!: number;
    marca!: Marca;
    productoLocales!: ProductoLocal[];
    modelo!: string;
    descripcion!: string;
    precio!: number;
    costo!: number;
    material: MaterialProducto | null = null;
    genero!:string;
    categorias!: Categoria[];
    proveedores!: Proveedor[];
    creadoEn!: Date;
    ultimaActualizacion!:Date;
    showDetails:boolean=false;
}
