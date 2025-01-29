import { Injectable } from '@angular/core';
import { Movimiento } from '../models/movimiento';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';

import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';

@Injectable()
export class MovimientoService {
  private urlEndPointMovimiento: string = URL_BACKEND + '/api/movimientos';

  constructor(private http: HttpClient) {}

  getMovimiento(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.urlEndPointMovimiento}/${id}`).pipe(
      catchError((e) => {
        if (e.status === 400) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL OBTENER EL MOVIMIENTO', error, 'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  getMovimientos(page:number): Observable<any> {
      return this.http.get(this.urlEndPointMovimiento+'/paginado/'+page).pipe(
        tap((response:any)=> (response.content as Movimiento[]))
      )
  }

  createMovimiento(movimiento: Movimiento): Observable<any> {
    return this.http.post<any>(this.urlEndPointMovimiento, movimiento).pipe(
      map((response: any) => response.movimiento as Movimiento),
      catchError((e) => {
        if (e.status === 400) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL CREAR EL MOVIMIENTO', error, 'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  updateMovimiento(movimiento: Movimiento): Observable<any> {
    return this.http.put<any>(`${this.urlEndPointMovimiento}/${movimiento.id}`, movimiento).pipe(
      map((response: any) => response.movimiento as Movimiento),
      catchError((e) => {
        if (e.status === 400) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL ACTUALIZAR EL MOVIMIENTO', error, 'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  deleteMovimiento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPointMovimiento}/${id}`).pipe(
      catchError((e) => {
        if (e.status === 400) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL ELIMINAR EL MOVIMIENTO', error, 'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  getMovimientosEntreFechas(fechaInicio: string, fechaFin: string, page: number): Observable<any> {
    return this.http.get(`${this.urlEndPointMovimiento}/buscar/entre-fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`).pipe(
      tap((response: any) => (response.content as Movimiento[]))
    );
  }

  getTotales(idLocal: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.urlEndPointMovimiento}/totales?idLocal=${idLocal}`);
  }

  getMovimientosFiltrados(filtros: any, page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    if (filtros.local) params = params.set('idLocal', filtros.local.toString());
    if (filtros.tipoMovimiento) params = params.set('tipoMovimiento', filtros.tipoMovimiento);
    if (filtros.nroFicha) params = params.set('nroFicha', filtros.nroFicha.toString());
    if (filtros.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros.metodoPago) params = params.set('metodoPago', filtros.metodoPago);

    return this.http.get<any>(`${this.urlEndPointMovimiento}/filtrar`, { params });
 }

  generarReporteMovimiento(idMovimiento: number): Observable<Blob> {
    const url = `${this.urlEndPointMovimiento}/reporte/${idMovimiento}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
