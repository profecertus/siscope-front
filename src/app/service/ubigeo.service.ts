import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemanaModel } from '../model/semana.model';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private apiUrl = environment.urlServiceTarifario;
  private ubigeo = environment.sufijoUbigeo;



  constructor(private http: HttpClient) { }

  obtenerUbigeos(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.ubigeo}/getAllUbigeo`);
  }
}
