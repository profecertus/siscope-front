import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemanaModel } from '../model/semana.model';

@Injectable({
  providedIn: 'root'
})
export class SemanaService {

  private apiUrl = environment.urlService;
  private semana = environment.sufijoSemana;
  private apiUrlTarifario = environment.urlServiceTarifario;


  constructor(private http: HttpClient) { }

  obtenerSemanas(numero: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.semana}/getAllSemana/${numero}/${pageSize}`);
  }

  guardarSemana(semana: SemanaModel){
    return this.http.post(`${this.apiUrl}${this.semana}/saveSemana`, semana);
  }

  semanaActual():Observable<any>{
    return this.http.get(`${this.apiUrlTarifario}${this.semana}/semanaActual`)
  }

  getDiasxSemana(semana:number):Observable<any>{
    return this.http.get(`${this.apiUrlTarifario}${this.semana}/getDiasxSemana/${semana}`);
  }

  semanaxFecha(dia:number):Observable<any>{
    return this.http.get(`${this.apiUrlTarifario}${this.semana}/semanaPorFecha/${dia}`)
  }
}
