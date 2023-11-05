import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TipodocumentoService {
  private apiUrl = environment.urlService;
  private tipoDocumento = environment.sufijoTipoDocumento;

  constructor(private http: HttpClient) { }

  obtenerTipoDocumentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tipoDocumento}/getAll`);
  }
}
