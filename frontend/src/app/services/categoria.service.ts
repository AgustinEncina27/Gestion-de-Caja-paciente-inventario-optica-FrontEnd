import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { CategoriaDTO } from '../dto/CategoriaDTO';

interface CategoriaCreateUpdate {
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  // ✅ plural
  private base = `${URL_BACKEND}/api/categorias`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(this.base);
  }

  // ✅ enviar solo { nombre }
  crearCategoria(nombre: string): Observable<CategoriaDTO> {
    const body: CategoriaCreateUpdate = { nombre };
    return this.http.post<any>(this.base, body).pipe(
      map(res => res.categoria as CategoriaDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL CREAR LA CATEGORÍA', error, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  // ✅ id en la URL, body con { nombre } solamente
  actualizarCategoria(id: number, nombre: string): Observable<CategoriaDTO> {
    const body: CategoriaCreateUpdate = { nombre };
    return this.http.put<any>(`${this.base}/${id}`, body).pipe(
      map(res => res.categoria as CategoriaDTO),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 400 && e.error?.errors) {
          const error = e.error.errors.join(' ');
          Swal.fire('ERROR AL ACTUALIZAR LA CATEGORÍA', error, 'error');
        } else if (e.error?.mensaje) {
          Swal.fire(e.error.mensaje, e.error.error, 'error');
        }
        return throwError(() => e);
      })
    );
  }

  eliminarCategoria(id: number): Observable<any> {
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