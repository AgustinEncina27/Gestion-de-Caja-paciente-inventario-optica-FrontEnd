import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { MaterialProductoDTO } from '../dto/MaterialProductoDTO';

interface MaterialCreateUpdate { nombre: string; }

@Injectable({ providedIn: 'root' })
export class MaterialProductoService {
  private base = `${URL_BACKEND}/api/materiales`; // ✅ plural, nuevo backend

  constructor(private http: HttpClient) {}

  getMateriales(): Observable<MaterialProductoDTO[]> {
    return this.http.get<MaterialProductoDTO[]>(this.base);
  }

  crear(nombre: string): Observable<MaterialProductoDTO> {
    const body: MaterialCreateUpdate = { nombre };
    return this.http.post<any>(this.base, body).pipe(
      map(res => res.material as MaterialProductoDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL CREAR EL MATERIAL', error, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  actualizar(id: number, nombre: string): Observable<MaterialProductoDTO> {
    const body: MaterialCreateUpdate = { nombre };
    return this.http.put<any>(`${this.base}/${id}`, body).pipe(
      map(res => res.material as MaterialProductoDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL ACTUALIZAR EL MATERIAL', error, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(
      catchError((e: HttpErrorResponse) => {
        // tu backend responde 400 si está en uso, 500 para errores internos
        if (e.status === 400 && e.error?.mensaje) {
          Swal.fire('No se puede eliminar', e.error.mensaje, 'error');
        } else if (e.status === 500) {
          Swal.fire('ERROR AL ELIMINAR EL MATERIAL',
                    'Existen productos con este material. Eliminá esos productos para continuar.',
                    'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }
}