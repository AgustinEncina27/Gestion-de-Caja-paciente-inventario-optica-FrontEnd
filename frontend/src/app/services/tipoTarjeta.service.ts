import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';


export interface TipoTarjeta {
  id: number;
  nombre: string; // Ej: VISA, OTRA
  tipo: 'CREDITO' | 'DEBITO';
}

@Injectable({
  providedIn: 'root'
})
export class TipoTarjetaService {

  private urlEndPoint: string = URL_BACKEND + '/api/tipos-tarjeta';


  constructor(private http: HttpClient) {}

  getTiposTarjeta(): Observable<TipoTarjeta[]> {
    return this.http.get<TipoTarjeta[]>(this.urlEndPoint);
  }
}
