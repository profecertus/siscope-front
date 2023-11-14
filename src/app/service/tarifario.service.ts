import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiaSemana, SemanaModel } from '../model/semana.model';
import { TarifarioModel } from '../model/tarifario.model';

@Injectable({
  providedIn: 'root'
})
export class TarifarioService {

  private apiUrl = environment.urlServiceTarifario;
  private tarifario = environment.sufijoTarifario;

  constructor(private http: HttpClient) { }
  obtenerTarifario(diaSemana:number): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/getAllTarifario`, diaSemana);
  }

  grabarTarifario(tarifario:TarifarioModel): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/saveTarifa`, tarifario);
  }

  crearSemana(diaSemana:DiaSemana):Observable<any>{
    return this.http.post(`${this.apiUrl}${this.tarifario}/createWeek`, diaSemana);
  }

}
