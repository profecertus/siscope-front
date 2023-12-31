import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TiposervicioService {
  private apiUrl = environment.urlService;
  private tipoServicio = environment.sufijoTipoServicio;
  private banco = environment.sufijoBanco;

  constructor(private http: HttpClient) { }

  obtenerTiposServicios(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tipoServicio}/getAll`);
  }

  obtenerBancos():Observable<any>{
    return this.http.get(`${this.apiUrl}${this.banco}/getAllBanco`);
  }
}
