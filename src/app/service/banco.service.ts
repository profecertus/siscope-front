import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private apiUrl = environment.urlService;
  private banco = environment.sufijoBanco;

  constructor(private http: HttpClient) { }
  obtenerBancos(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.banco}/getAllBanco`);
  }

}
