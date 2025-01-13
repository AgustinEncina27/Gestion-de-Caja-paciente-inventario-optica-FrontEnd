import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { Producto } from '../models/producto';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService{
  private urlEndPointCategoria:string =URL_BACKEND+'/api/categoria';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlEndPointCategoria)
  }

  getProductosPorCategoria(categoriaId:number,page:number,): Observable<any> {
    return this.http.get(this.urlEndPointCategoria+'/page/'+categoriaId+'/'+page).pipe(
      tap((response:any)=> (response.content as Producto[]))
    )
  }

  crearCategoria(categoria:Categoria): Observable<any>{
    return this.http.post<any>(this.urlEndPointCategoria,categoria).pipe(
      map((response: any)=>response.categoria as Categoria),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear la categoria",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  actualizarCategoria(categoria:Categoria): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointCategoria}/${categoria.id}`,categoria).pipe(
      map((response: any)=>response.categoria as Categoria),
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al actualizar la categoria",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  eliminarCategoria(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointCategoria}/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al eliminar la categoria",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }


}
