import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Observable,Subject,catchError,map,tap,throwError} from 'rxjs';
import { HttpClient} from '@angular/common/http';

import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';

@Injectable()
export class ProductoService {
  private urlEndPointProducto:string =URL_BACKEND+'/api/productos';
  private dataUpdated = new Subject<void>();
  

  constructor(private http: HttpClient) { }

  getProducto(id:number): Observable<Producto>{
    return this.http.get<Producto>(`${this.urlEndPointProducto}/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL OBTENER LOS PRODUCTOS",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  getProductos(page:number): Observable<any> {
    return this.http.get(this.urlEndPointProducto+'/page/'+page).pipe(
      tap((response:any)=> (response.content as Producto[]))
    )
  }

  getProductosPorModelo(modelo: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndPointProducto}/buscar-por-modelo/${modelo}`)
  }

  getProductosByGeneroAndMarcaAndCategoria(genero:string,marcaid:number,categoriaid:number,page:number): Observable<any>{
    return this.http.get(`${this.urlEndPointProducto}/page/${genero}/${marcaid}/${categoriaid}/${page}`).pipe(
      tap((response:any)=> (response.content as Producto[])),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL OBTENER LOS PRODUCTOS",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  createProducto(note:Producto): Observable<any>{
    return this.http.post<any>(this.urlEndPointProducto,note).pipe(
      map((response: any)=>response.producto as Producto),
      catchError(e=>{
        if (e.status === 400 && e.error.mensaje) {
          // Mostrar el mensaje enviado por el backend
          Swal.fire('ERROR', e.error.mensaje, 'error');
        } else {
          // Manejo genérico de otros errores
          Swal.fire('ERROR', 'Ocurrió un error al guardar el producto', 'error');
        }
        return throwError(() => e);
      })
    )
  }

  updateProducto(producto:Producto): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointProducto}/${producto.id}`,producto).pipe(
      map((response: any)=>response.producto as Producto),
      catchError(e=>{
        if (e.status === 400 && e.error.mensaje) {
          // Mostrar el mensaje enviado por el backend
          Swal.fire('ERROR', e.error.mensaje, 'error');
        } else {
          // Manejo genérico de otros errores
          Swal.fire('ERROR', 'Ocurrió un error al guardar el producto', 'error');
        }
        return throwError(() => e);
      })
    )
  }

  deleteProducto(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointProducto}/${id}`).pipe(
      catchError(e => {
        let error = "";
    
        switch (e.status) {
          case 400:
            error = e.error.errors.join(" ");
            Swal.fire("ERROR AL ELIMINAR EL PRODUCTO", error, 'error');
            break;
    
          case 500:
            Swal.fire("ERROR AL ELIMINAR EL PRODUCTO", "Existen Movimientos en la Caja. Por favor elimine esos movimientos para continuar", 'error');
            break;
    
          default:
            if (e.error.mensaje) {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje, e.error.error, 'error');
            }
            break;
        }
        return throwError(() => e);
      })
    )
  }  

  getDataUpdatedObservable(): Observable<void> {
    return this.dataUpdated.asObservable();
  }

  triggerDataUpdated() {
    this.dataUpdated.next();
  }
  
}
