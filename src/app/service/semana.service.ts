import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemanaModel } from '../model/semana.model';

@Injectable({
  providedIn: 'root'
})
export class SemanaService {

  private apiUrl = environment.urlServiceTarifario;
  private semana = environment.sufijoSemana;

  constructor(private http: HttpClient) { }

  obtenerSemanas(numero: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.semana}/getAllSemana/${numero}/${pageSize}`);
  }

  guardarSemana(semana: SemanaModel){
    return;
  }

  semanaActual():Observable<any>{
    return this.http.get(`${this.apiUrl}${this.semana}/semanaActual`)
  }
}
