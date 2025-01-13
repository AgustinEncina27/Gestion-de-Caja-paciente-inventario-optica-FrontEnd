import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Observable,Subject,catchError,map,tap,throwError} from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

import swal from 'sweetalert2';
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
          swal.fire("Error al obtener los productos",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
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

  getProductoPorModelo(modelo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlEndPointProducto}/buscar-por-modelo/${modelo}`);
  }

  getProductosByGeneroAndMarcaAndCategoria(genero:string,marcaid:number,categoriaid:number,page:number): Observable<any>{
    return this.http.get(`${this.urlEndPointProducto}/page/${genero}/${marcaid}/${categoriaid}/${page}`).pipe(
      tap((response:any)=> (response.content as Producto[])),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al obtener los productos",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  createProducto(note:Producto): Observable<any>{
    return this.http.post<any>(this.urlEndPointProducto,note).pipe(
      map((response: any)=>response.producto as Producto),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear el producto",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  updateProducto(producto:Producto): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointProducto}/${producto.id}`,producto).pipe(
      map((response: any)=>response.producto as Producto),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear la nota",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  deleteProducto(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointProducto}/${id}`).pipe(
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear el producto",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
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

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>>{
    let formData = new FormData;
    formData.append("archivo",archivo);
    formData.append("id",id.toString());

    const req = new HttpRequest('POST',`${this.urlEndPointProducto}/upload`,formData,{
      reportProgress: true
    });

    return this.http.request(req);
  }

  
}
