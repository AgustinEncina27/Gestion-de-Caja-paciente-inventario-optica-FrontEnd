import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';
import { Observable,Subject,catchError,map,tap,throwError} from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { PacientesPorSucursal } from '../dto/PacientesPorSucursal';

@Injectable()
export class PacienteService {
  private urlEndPointPaciente:string =URL_BACKEND+'/api/pacientes';
  
  constructor(private http: HttpClient) { }

  getPaciente(id:number): Observable<Paciente>{
    return this.http.get<Paciente>(`${this.urlEndPointPaciente}/id/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL OBTENER EL PACIENTE",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  getPacientes(page:number): Observable<any> {
    return this.http.get(this.urlEndPointPaciente+'/paginado/'+page).pipe(
      tap((response:any)=> (response.content as Paciente[]))
    )
  }

  getPacientesPorNombre(nombre: string, page: number): Observable<any> {
    return this.http.get(`${this.urlEndPointPaciente}/buscar/nombre?nombre=${nombre}&page=${page}`).pipe(
      tap((response: any) => (response.content as Paciente[]))
    );
  }

  getPacientesPorDocumento(documento: string, page: number): Observable<any> {
    return this.http.get(`${this.urlEndPointPaciente}/buscar/documento/${documento}/page/${page}`).pipe(
      tap((response: any) => (response.content as Paciente[]))
    );
  }  

  getPacientePorFicha(ficha: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.urlEndPointPaciente}/buscar-por-ficha/${ficha}`);
  }

  obtenerCantidadPacientesPorSucursal(): Observable<PacientesPorSucursal[]> {
    return this.http.get<PacientesPorSucursal[]>(`${this.urlEndPointPaciente}/cantidad-por-sucursal`);
  }

  createPaciente(paciente:Paciente): Observable<any>{
    return this.http.post<any>(this.urlEndPointPaciente,paciente).pipe(
      map((response: any)=>response.paciente as Paciente),
      catchError(e=>{
        if (e.status === 400 && e.error.mensaje) {
          // Mostrar el mensaje enviado por el backend
          Swal.fire('ERROR', e.error.mensaje, 'error');
        } else {
          // Manejo genérico de otros errores
          Swal.fire('ERROR', 'Ocurrió un error al guardar el paciente', 'error');
        }
        return throwError(() => e);
      })
    )
  }

  updatePaciente(paciente:Paciente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointPaciente}/${paciente.id}`,paciente).pipe(
      map((response: any)=>response.paciente as Paciente),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL CREAR EL PACIENTE",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  deletePaciente(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointPaciente}/${id}`).pipe(
      catchError(e => {
        let error = "";
    
        switch (e.status) {
          case 400:
            error = e.error.errors.join(" ");
            Swal.fire("ERROR AL ELIMINAR EL PACIENTE", error, 'error');
            break;
    
          case 500:
            Swal.fire("ERROR AL ELIMINAR EL PACIENTE", "Existen Movimientos en la Caja. Por favor elimine esos movimientos para continuar", 'error');
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
