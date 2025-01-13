import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { Marca } from '../models/marca';

import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MarcaService{
  private urlEndPointMarca:string =URL_BACKEND+'/api/marca';

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.urlEndPointMarca)
  }

  crearMarca(marca:Marca): Observable<any>{
    return this.http.post<any>(this.urlEndPointMarca,marca).pipe(
      map((response: any)=>response.marca as Marca),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear la marca",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  actualizarMarca(marca:Marca): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointMarca}/${marca.id}`,marca).pipe(
      map((response: any)=>response.marca as Marca),
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al actualizar la marca",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  eliminarMarca(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointMarca}/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al eliminar la marca",error,'error');
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
