import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Local } from '../models/local';

import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class LocalService{
  private urlEndPointLocal:string =URL_BACKEND+'/api/local';

  constructor(private http: HttpClient) { }

  getLocales(): Observable<Local[]> {
    return this.http.get<Local[]>(this.urlEndPointLocal)
  }

  crearLocal(local:Local): Observable<any>{
    return this.http.post<any>(this.urlEndPointLocal,local).pipe(
      map((response: any)=>response.local as Local),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL CREAR EL LOCAL",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  actualizarLocal(local:Local): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointLocal}/${local.id}`,local).pipe(
      map((response: any)=>response.local as Local),
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL ACTUALIZAR EL LOCAL",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  eliminarLocal(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointLocal}/${id}`).pipe(
      catchError(e => {
        let error = "";
    
        switch (e.status) {
          case 400:
            error = e.error.errors.join(" ");
            Swal.fire("ERROR AL ELIMINAR EL LOCAL", error, 'error');
            break;
    
          case 500:
            Swal.fire("ERROR AL ELIMINAR EL LOCAL", "Existen Movimientos en la Caja o productos que poseen este local. Por favor elimine esos movimientos o productos para continuar", 'error');
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


}
