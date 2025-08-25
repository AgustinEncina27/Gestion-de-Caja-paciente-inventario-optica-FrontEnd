import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { ProveedorDTO } from '../dto/ProveedorDTO';

interface ProveedorCreateUpdate {
  nombre: string;
  celular?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private base = `${URL_BACKEND}/api/proveedores`; // ✅ plural

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<ProveedorDTO[]> {
    return this.http.get<ProveedorDTO[]>(this.base);
  }

  crearProveedor(nombre: string, celular?: string | null): Observable<ProveedorDTO> {
    const body: ProveedorCreateUpdate = { nombre, celular: celular ?? null };
    return this.http.post<any>(this.base, body).pipe(
      map(res => res.proveedor as ProveedorDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const msg = e.error.errors.join(' ');
          Swal.fire('ERROR AL CREAR EL PROVEEDOR', msg, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  actualizarProveedor(id: number, nombre: string, celular?: string | null): Observable<ProveedorDTO> {
    const body: ProveedorCreateUpdate = { nombre, celular: celular ?? null };
    return this.http.put<any>(`${this.base}/${id}`, body).pipe(
      map(res => res.proveedor as ProveedorDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const msg = e.error.errors.join(' ');
          Swal.fire('ERROR AL ACTUALIZAR EL PROVEEDOR', msg, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }
}