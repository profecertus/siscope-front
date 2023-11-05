import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajador } from '../model/trabajador.model';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  private apiUrl = environment.urlService;
  private trabajador = environment.sufijoTrabajador;

  constructor(private http: HttpClient) { }
  obtenerTrabajadores(numpage:number, numsize:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.trabajador}/getAllTrabajador/${numpage}/${numsize}`);
  }

  guardarTrabajador(trabajador: Trabajador):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}${this.trabajador}/saveTrabajador`, trabajador, { headers });
  }
}
