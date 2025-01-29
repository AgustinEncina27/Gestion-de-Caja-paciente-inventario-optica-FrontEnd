import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { Proveedor } from '../models/proveedor';


@Injectable({
  providedIn: 'root'
})
export class ProveedorService{
  private urlEndPointProveedor:string =URL_BACKEND+'/api/proveedor';

  constructor(private http: HttpClient) { }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.urlEndPointProveedor)
  }

  crearProveedor(proveedor:Proveedor): Observable<any>{
    return this.http.post<any>(this.urlEndPointProveedor,proveedor).pipe(
      map((response: any)=>response.proveedor as Proveedor),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL CREAR EL PROVEEDOR",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  actualizarProveedor(proveedor:Proveedor): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointProveedor}/${proveedor.id}`,proveedor).pipe(
      map((response: any)=>response.proveedor as Proveedor),
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL ACTUALIZAR EL PROVEEDOR",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  eliminarProveedor(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointProveedor}/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL ELIMINAR EL PROVEEDOR",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }


}
