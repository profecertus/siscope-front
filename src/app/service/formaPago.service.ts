import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  private apiUrl = environment.urlService;
  private formaPago = environment.sufijoFormaPago;

  constructor(private http: HttpClient) { }
  obtenerFormaPago(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.formaPago}/getAllFormaPago`);
  }

}
