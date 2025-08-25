import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, catchError, map, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { StockTotalSucursal } from '../dto/StockTotalSucursal';
import { StockPorMaterial } from '../dto/StockPorMaterial';
import { ActualizacionRequest } from '../dto/ActualizacionRequest';
import { ProductoDTO } from '../dto/ProductoDTO';
import { ProductoUpsertDTO } from '../dto/ProductoUpsertDTO';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private base = `${URL_BACKEND}/api/productos`;
  private dataUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getProducto(id: number): Observable<ProductoDTO> {
    return this.http.get<ProductoDTO>(`${this.base}/${id}`).pipe(
      catchError(e => {
        if (e.error?.mensaje) Swal.fire('ERROR', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  getProductos(page: number): Observable<{ content: ProductoDTO[]; [k: string]: any }> {
    return this.http.get<{ content: ProductoDTO[]; [k: string]: any }>(`${this.base}/page/${page}`).pipe(
      tap(() => {})
    );
  }

  getProductosPorModelo(modelo: string): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.base}/buscar-por-modelo/${modelo}`);
  }

  getProductosPorModeloNoEstricto(modelo: string): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.base}/modelo/${modelo}`);
  }

  getProductosPorMarcaNoEstricto(marca: string): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.base}/marca/${marca}`);
  }

  // ahora el backend usa el tenant; no se envía localId
  getProductosPorModeloEnMiLocal(modelo: string): Observable<ProductoDTO[]> {
    const params = new HttpParams().set('modelo', modelo);
    return this.http.get<ProductoDTO[]>(`${this.base}/buscar`, { params });
  }

  obtenerStockTotalPorSucursal(): Observable<StockTotalSucursal[]> {
    return this.http.get<StockTotalSucursal[]>(`${this.base}/stock-total-sucursal`);
  }

  // localId es opcional (si omitís, el backend usa tenant.currentLocalId())
  obtenerStockPorMaterialYSucursal(localId?: number): Observable<StockPorMaterial[]> {
    const options = localId != null ? { params: { localId: String(localId) } } : {};
    return this.http.get<StockPorMaterial[]>(`${this.base}/stock-material`, options);
  }

  // Crear 1 (si quisieras)
  createProducto(dto: ProductoUpsertDTO): Observable<ProductoDTO> {
    return this.http.post<any>(this.base, dto).pipe(
      map(res => res.producto as ProductoDTO),
      catchError(e => {
        Swal.fire('ERROR', e.error?.mensaje ?? 'Error al guardar el producto', 'error');
        return throwError(() => e);
      })
    );
  }

  // Crear varios (lo que usás en tu pantalla)
  createVariosProductos(dtos: ProductoUpsertDTO[]): Observable<any> {
    return this.http.post<any>(`${this.base}/crearVarios`, dtos).pipe(
      catchError(e => {
        if (e.status === 400 && e.error?.mensaje) {
          Swal.fire('ERROR', e.error.mensaje, 'error');
          console.error('Errores:', e.error.errores);
        } else {
          Swal.fire('ERROR', 'Ocurrió un error al guardar los productos', 'error');
        }
        return throwError(() => e);
      })
    );
  }

  actualizarMasivo(payload: ActualizacionRequest): Observable<any> {
    return this.http.post(`${this.base}/actualizar-precios`, payload).pipe(
      tap(() => Swal.fire('Actualización Exitosa', 'Se actualizaron precios/costos.', 'success')),
      catchError(e => {
        Swal.fire('Error', 'Ocurrió un error al actualizar los productos', 'error');
        return throwError(() => e);
      })
    );
  }

  updateProducto(id: number, dto: ProductoUpsertDTO): Observable<ProductoDTO> {
    return this.http.put<any>(`${this.base}/${id}`, dto).pipe(
      map(res => res.producto as ProductoDTO),
      catchError(e => {
        Swal.fire('ERROR', e.error?.mensaje ?? 'Error al actualizar el producto', 'error');
        return throwError(() => e);
      })
    );
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(
      catchError(e => {
        if (e.error?.mensaje) Swal.fire('ERROR AL ELIMINAR EL PRODUCTO', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  getDataUpdatedObservable(): Observable<void> {
    return this.dataUpdated.asObservable();
  }
  triggerDataUpdated() {
    this.dataUpdated.next();
  }

  validarModelos(modelos: string[], marcaId: number): Observable<string[]> {
    const params = new HttpParams().set('marcaId', String(marcaId));
    return this.http.post<string[]>(`${this.base}/validar-modelos`, modelos, { params });
  }
}
