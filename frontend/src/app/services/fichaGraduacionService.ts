import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';

import {
  FichaGraduacionDTO,
  FichaGraduacionUpsertDTO,
} from '../dto/ficha-graduacion.dto';

@Injectable({ providedIn: 'root' })
export class FichaGraduacionService {
  private base = `${URL_BACKEND}/api`;

  constructor(private http: HttpClient) {}

  listarPorPaciente(pacienteId: number): Observable<FichaGraduacionDTO[]> {
    return this.http
      .get<FichaGraduacionDTO[]>(`${this.base}/pacientes/${pacienteId}/fichas`)
      .pipe(catchError(e => this.handleError(e, 'Error al listar fichas')));
  }

  obtener(fichaId: number): Observable<FichaGraduacionDTO> {
    return this.http
      .get<FichaGraduacionDTO>(`${this.base}/fichas/${fichaId}`)
      .pipe(catchError(e => this.handleError(e, 'Error al obtener la ficha')));
  }

  crear(pacienteId: number, dto: FichaGraduacionUpsertDTO): Observable<FichaGraduacionDTO> {
    return this.http.post<any>(`${this.base}/pacientes/${pacienteId}/fichas`, dto).pipe(
      map(res => res.ficha as FichaGraduacionDTO),
      catchError(e => this.handleError(e, e?.error?.mensaje || 'Error al crear la ficha'))
    );
  }

  actualizar(fichaId: number, dto: FichaGraduacionUpsertDTO): Observable<FichaGraduacionDTO> {
    return this.http.put<any>(`${this.base}/fichas/${fichaId}`, dto).pipe(
      map(res => res.ficha as FichaGraduacionDTO),
      catchError(e => this.handleError(e, e?.error?.mensaje || 'Error al actualizar la ficha'))
    );
  }

  eliminar(fichaId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/fichas/${fichaId}`)
      .pipe(catchError(e => this.handleError(e, e?.error?.mensaje || 'Error al eliminar la ficha')));
  }

  private handleError(e: any, defaultMessage: string) {
    Swal.fire('ERROR', e?.error?.mensaje || e?.message || defaultMessage, 'error');
    return throwError(() => e);
    }
}
