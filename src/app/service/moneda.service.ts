import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private apiUrl = environment.urlService;
  private moneda = environment.sufijoMoneda;

  constructor(private http: HttpClient) { }
  obtenerMonedas(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.moneda}/getAllMoneda`);
  }

}
