import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { MaterialProducto } from '../models/materialProducto';

@Injectable({
  providedIn: 'root'
})
export class MaterialProductoService{
  private urlEndPointMaterialProducto:string =URL_BACKEND+'/api/materialProducto';

  constructor(private http: HttpClient) { }

  getMaterialesProducto(): Observable<MaterialProducto[]> {
    return this.http.get<MaterialProducto[]>(this.urlEndPointMaterialProducto)
  }

  crearMaterialProducto(materialProducto:MaterialProducto): Observable<any>{
    return this.http.post<any>(this.urlEndPointMaterialProducto,materialProducto).pipe(
      map((response: any)=>response.materialProducto as MaterialProducto),
      catchError(e=>{
        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL CREAR EL MATERIAL",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  actualizarMaterialProducto(materialProducto:MaterialProducto): Observable<any>{
    return this.http.put<any>(`${this.urlEndPointMaterialProducto}/${materialProducto.id}`,materialProducto).pipe(
      map((response: any)=>response.materialProducto as MaterialProducto),
      catchError(e=>{

        if (e.status == 400) {
          let error = e.error.errors.join(" ")
          Swal.fire("ERROR AL ACTUALIZAR EL MATERIAL",error,'error');
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje,e.error.error,'error');
        }
        return throwError(() => e);
      })
    )
  }

  eliminarMaterialProducto(id:number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPointMaterialProducto}/${id}`).pipe(
      catchError(e => {
        let error = "";
    
        switch (e.status) {
          case 400:
            error = e.error.errors.join(" ");
            Swal.fire("ERROR AL ELIMINAR EL MATERIAL", error, 'error');
            break;
    
          case 500:
            Swal.fire("ERROR AL ELIMINAR EL MATERIAL", "Existen producto con este material. Por favor elimine esos productos para continuar", 'error');
            break;
    
          default:
            if (e.error.mensaje) {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje, e.error.error, 'error');
            }
            break;
        }
        return throwError(() => e);
      })
    )
  }


}
