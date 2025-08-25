import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';

// 👇 Ajusta esta ruta según dónde pusiste los DTOs de FRONT
import {
  MovimientoDTO,
  MovimientoUpsertDTO,
} from '../dto/movimiento.dto';

// Helper para respuestas paginadas del backend
export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Filtros del endpoint /filtrar
export interface MovimientosFiltro {
  local?: number;
  tipoMovimiento?: 'ENTRADA' | 'SALIDA';
  nombrePaciente?: string;
  fecha?: string;        // yyyy-MM-dd
  metodoPago?: string;   // nombre del enum del backend: EFECTIVO | TARJETA | ...
}

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private base = `${URL_BACKEND}/api/movimientos`;

  constructor(private http: HttpClient) {}

  // ======= CRUD =======

  obtener(id: number): Observable<MovimientoDTO> {
    return this.http.get<MovimientoDTO>(`${this.base}/${id}`).pipe(
      catchError(e => this.handleError(e, 'Error al obtener el movimiento'))
    );
  }

  crear(dto: MovimientoUpsertDTO): Observable<MovimientoDTO> {
    return this.http.post<any>(this.base, dto).pipe(
      map(res => res.movimiento as MovimientoDTO),
      catchError(e => this.handleError(e, e?.error?.mensaje || 'Error al crear el movimiento'))
    );
  }

  actualizar(id: number, dto: MovimientoUpsertDTO): Observable<MovimientoDTO> {
    return this.http.put<any>(`${this.base}/${id}`, dto).pipe(
      map(res => res.movimiento as MovimientoDTO),
      catchError(e => this.handleError(e, e?.error?.mensaje || 'Error al actualizar el movimiento'))
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      catchError(e => this.handleError(e, e?.error?.mensaje || 'Error al eliminar el movimiento'))
    );
  }

  // ======= LISTADOS =======

  listarTodos(): Observable<MovimientoDTO[]> {
    return this.http.get<MovimientoDTO[]>(this.base).pipe(
      catchError(e => this.handleError(e, 'Error al listar movimientos'))
    );
  }

  paginado(page: number): Observable<Page<MovimientoDTO>> {
    return this.http.get<Page<MovimientoDTO>>(`${this.base}/paginado/${page}`).pipe(
      catchError(e => this.handleError(e, 'Error al listar movimientos paginados'))
    );
  }

  entreFechas(fechaInicio: string, fechaFin: string, page = 0, size = 10): Observable<Page<MovimientoDTO>> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('page', page)
      .set('size', size);
    return this.http
      .get<Page<MovimientoDTO>>(`${this.base}/buscar/entre-fechas`, { params })
      .pipe(catchError(e => this.handleError(e, 'Error al buscar entre fechas')));
  }

  porTipo(tipo: 'ENTRADA' | 'SALIDA', page = 0, size = 10): Observable<Page<MovimientoDTO>> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('page', page)
      .set('size', size);
    return this.http
      .get<Page<MovimientoDTO>>(`${this.base}/buscar/tipo`, { params })
      .pipe(catchError(e => this.handleError(e, 'Error al buscar por tipo')));
  }

  porLocalPaginado(idLocal: number, page = 0, size = 10): Observable<Page<MovimientoDTO>> {
    return this.http
      .get<Page<MovimientoDTO>>(`${this.base}/local/${idLocal}/page/${page}`, { params: new HttpParams().set('size', size) })
      .pipe(catchError(e => this.handleError(e, 'Error al listar por local')));
  }

  // ======= FILTRO AVANZADO (el del controller /filtrar) =======

  filtrar(filtros: MovimientosFiltro, page = 0, size = 10): Observable<Page<MovimientoDTO>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (filtros.local !== undefined && filtros.local !== null) {
      params = params.set('idLocal', String(filtros.local));
    }
    if (filtros.tipoMovimiento) {
      params = params.set('tipoMovimiento', filtros.tipoMovimiento);
    }
    if (filtros.nombrePaciente) {
      params = params.set('nombrePaciente', filtros.nombrePaciente);
    }
    if (filtros.fecha) {
      params = params.set('fecha', filtros.fecha); // yyyy-MM-dd
    }
    if (filtros.metodoPago) {
      params = params.set('metodoPago', filtros.metodoPago);
    }

    return this.http
      .get<Page<MovimientoDTO>>(`${this.base}/filtrar`, { params })
      .pipe(catchError(e => this.handleError(e, 'Error al filtrar movimientos')));
  }

  // ======= TOTALES / KPIs =======

  // /api/movimientos/totales?idLocal=...
  totalesPorMetodoPago(idLocal?: number): Observable<{ [metodo: string]: number }> {
    const params = idLocal !== undefined && idLocal !== null ? new HttpParams().set('idLocal', String(idLocal)) : undefined;
    return this.http
      .get<{ [metodo: string]: number }>(`${this.base}/totales`, { params })
      .pipe(catchError(e => this.handleError(e, 'Error al calcular totales')));
  }

  // /api/movimientos/total-vendido (POST)  -> { total: number }
  obtenerCantidadTotalVendida(filtros: { local: number; fechaInicio: string; fechaFin: string }): Observable<{ total: number }> {
    return this.http
      .post<{ total: number }>(`${this.base}/total-vendido`, filtros)
      .pipe(catchError(e => this.handleError(e, 'Error al obtener cantidad total vendida')));
  }

  // /api/movimientos/total-ganado (POST) -> { [metodo]: { entrada, salida } }
  obtenerTotalGanado(filtros: { local: number; fechaInicio: string; fechaFin: string }): Observable<{ [metodo: string]: { entrada: number; salida: number } }> {
    return this.http
      .post<{ [metodo: string]: { entrada: number; salida: number } }>(`${this.base}/total-ganado`, filtros)
      .pipe(catchError(e => this.handleError(e, 'Error al obtener total ganado')));
  }

  // ======= Helpers =======

  private handleError(e: any, defaultMessage: string) {
    const msg = e?.error?.mensaje || e?.message || defaultMessage || 'Error inesperado';
    Swal.fire('ERROR', msg, 'error');
    return throwError(() => e);
  }
}
