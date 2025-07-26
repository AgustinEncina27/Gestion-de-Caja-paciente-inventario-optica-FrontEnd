import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Factura } from '../models/factura';
import { SolicitudFacturaDTO } from '../dto/SolicitudfacturaDTO';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private urlEndPoint: string = URL_BACKEND + '/api/facturas';

  constructor(private http: HttpClient) {}

  emitirFactura(solicitud: SolicitudFacturaDTO): Observable<Factura> {
    return this.http.post<Factura>(`${this.urlEndPoint}/emitir`, solicitud);
  }
}