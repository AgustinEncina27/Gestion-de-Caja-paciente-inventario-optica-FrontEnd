import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { PacientesPorSucursal } from '../dto/PacientesPorSucursal';
import { PacienteDTO } from '../dto/PacienteDTO';
import { PacienteUpsertDTO } from '../dto/PacienteUpsertDTO';

@Injectable()
export class PacienteService {
  private base = `${URL_BACKEND}/api/pacientes`;

  constructor(private http: HttpClient) {}

  getPaciente(id: number): Observable<PacienteDTO> {
    return this.http.get<PacienteDTO>(`${this.base}/id/${id}`).pipe(
      catchError(e => {
        if (e.status === 400 && e.error?.errors) {
          Swal.fire('ERROR AL OBTENER EL PACIENTE', e.error.errors.join(' '), 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  getPacientes(page: number): Observable<{ content: PacienteDTO[]; [k: string]: any }> {
    return this.http.get<{ content: PacienteDTO[]; [k: string]: any }>(`${this.base}/paginado/${page}`).pipe(
      tap(() => {})
    );
  }

  getPacientesPorNombre(nombre: string, page: number): Observable<{ content: PacienteDTO[]; [k: string]: any }> {
    return this.http.get<{ content: PacienteDTO[]; [k: string]: any }>(`${this.base}/buscar/nombre?nombre=${encodeURIComponent(nombre)}&page=${page}`).pipe(
      tap(() => {})
    );
  }

  getPacientesPorDocumento(documento: string, page: number): Observable<{ content: PacienteDTO[]; [k: string]: any }> {
    return this.http.get<{ content: PacienteDTO[]; [k: string]: any }>(`${this.base}/buscar/documento/${encodeURIComponent(documento)}/page/${page}`).pipe(
      tap(() => {})
    );
  }

  getPacientePorFicha(ficha: number): Observable<PacienteDTO> {
    return this.http.get<PacienteDTO>(`${this.base}/buscar-por-ficha/${ficha}`);
  }

  obtenerCantidadPacientesPorSucursal(): Observable<PacientesPorSucursal[]> {
    return this.http.get<PacientesPorSucursal[]>(`${this.base}/cantidad-por-sucursal`);
  }

  createPaciente(payload: PacienteUpsertDTO): Observable<PacienteDTO> {
    return this.http.post<any>(this.base, payload).pipe(
      map(res => res.paciente as PacienteDTO),
      catchError(e => {
        if (e.status === 400 && e.error?.mensaje) {
          Swal.fire('ERROR', e.error.mensaje, 'error');
        } else {
          Swal.fire('ERROR', 'Ocurrió un error al guardar el paciente', 'error');
        }
        return throwError(() => e);
      })
    );
  }

  updatePaciente(id: number, payload: PacienteUpsertDTO): Observable<PacienteDTO> {
    return this.http.put<any>(`${this.base}/${id}`, payload).pipe(
      map(res => res.paciente as PacienteDTO),
      catchError(e => {
        if (e.status === 400 && e.error?.errors) {
          Swal.fire('ERROR AL EDITAR EL PACIENTE', e.error.errors.join(' '), 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  guardarCristal(pacienteId: number, nombre: string): Observable<any> {
    return this.http.post(`${this.base}/cristales`, { pacienteId, nombre });
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(
      catchError(e => {
        if (e.status === 400 && e.error?.errors) {
          Swal.fire('ERROR AL ELIMINAR EL PACIENTE', e.error.errors.join(' '), 'error');
        } else if (e.status === 500) {
          Swal.fire('ERROR AL ELIMINAR EL PACIENTE', 'Existen Movimientos en la Caja. Por favor elimine esos movimientos para continuar', 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }
}
