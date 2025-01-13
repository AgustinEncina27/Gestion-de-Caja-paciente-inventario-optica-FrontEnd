import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

import { URL_BACKEND } from '../config/config';
import { MetodoPago } from '../models/metodoPago';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService{
  private urlEndPointMetodoPago:string =URL_BACKEND+'/api/metodoPago';

  constructor(private http: HttpClient) { }

  getmetodosPagos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.urlEndPointMetodoPago)
  }

  crearMetodoPago(metodoPago:MetodoPago): Observable<any>{
    return this.http.post<any>(this.urlEndPointMetodoPago,metodoPago).pipe(
      map((response: any)=>response.metodoPago as MetodoPago),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear el método de pago",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  actualizarMetodoPago(metodoPago:MetodoPago): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointMetodoPago}/${metodoPago.id}`,metodoPago).pipe(
      map((response: any)=>response.metodoPago as MetodoPago),
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al actualizar el método de pago",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  eliminarMetodoPago(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointMetodoPago}/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al eliminar el método de pago",error,'error');
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
