import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { MarcaDTO } from '../dto/MarcaDTO';

interface MarcaCreateUpdate { nombre: string; }

@Injectable({ providedIn: 'root' })
export class MarcaService {
  private base = `${URL_BACKEND}/api/marcas`; // ✅ plural

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<MarcaDTO[]> {
    return this.http.get<MarcaDTO[]>(this.base);
  }

  crearMarca(nombre: string): Observable<MarcaDTO> {
    const body: MarcaCreateUpdate = { nombre: nombre.trim() };
    return this.http.post<any>(this.base, body).pipe(
      map(res => res.marca as MarcaDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const msg = e.error.errors.join(' ');
          Swal.fire('ERROR AL CREAR LA MARCA', msg, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  actualizarMarca(id: number, nombre: string): Observable<MarcaDTO> {
    const body: MarcaCreateUpdate = { nombre: nombre.trim() };
    return this.http.put<any>(`${this.base}/${id}`, body).pipe(
      map(res => res.marca as MarcaDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const msg = e.error.errors.join(' ');
          Swal.fire('ERROR AL ACTUALIZAR LA MARCA', msg, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  eliminarMarca(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.error?.mensaje) {
          // Backend envía mensaje legible si hay productos asociados
          Swal.fire('ERROR AL ELIMINAR LA MARCA', e.error.mensaje, 'error');
        }
        return throwError(() => e);
      })
    );
  }
}
