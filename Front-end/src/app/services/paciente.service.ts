import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';
import { Observable,Subject,catchError,map,tap,throwError} from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

import swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';

@Injectable()
export class PacienteService {
  private urlEndPointPaciente:string =URL_BACKEND+'/api/pacientes';
  
  constructor(private http: HttpClient) { }

  getPaciente(id:number): Observable<Paciente>{
    return this.http.get<Paciente>(`${this.urlEndPointPaciente}/id/${id}`).pipe(
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al obtener los pacientes",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
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

  getPacientePorFicha(ficha: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.urlEndPointPaciente}/buscar-por-ficha/${ficha}`);
  }

  createPaciente(paciente:Paciente): Observable<any>{
    return this.http.post<any>(this.urlEndPointPaciente,paciente).pipe(
      map((response: any)=>response.paciente as Paciente),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear el paciente",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
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
          swal.fire("Error al crear el paciente",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  deletePaciente(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointPaciente}/${id}`).pipe(
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          swal.fire("Error al crear el paciente",error,'error');
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
