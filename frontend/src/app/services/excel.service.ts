import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
    private urlEndPointExcel:string =URL_BACKEND+'/api/excel';

    constructor(private http: HttpClient) {}

    generarExcelStock(localId: number): Observable<Blob> {
    return this.http.get(`${this.urlEndPointExcel}/stock/${localId}`, {
        responseType: 'blob',
    });
    }
}
