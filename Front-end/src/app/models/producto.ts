import { Categoria } from "./categoria";
import { Marca } from "./marca";
import { ProductoLocal } from "./productoLocal";


export class Producto {
    id!: number;
    marca!: Marca;
    productoLocales!: ProductoLocal[];
    modelo!: string;
    descripcion!: string;
    precio!: number;
    costo!: number;
    material!: string;
    genero!:string;
    categorias!: Categoria[];
    creadoEn!: Date;
    ultimaActualizacion!:Date;
    showDetails:boolean=false;
}
