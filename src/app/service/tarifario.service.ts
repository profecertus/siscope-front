import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiaSemana, SemanaModel } from '../model/semana.model';
import { TarifarioFleteModel, TarifarioModel } from '../model/tarifario.model';

@Injectable({
  providedIn: 'root'
})
export class TarifarioService {

  private apiUrl = environment.urlServiceTarifario;
  private tarifario = environment.sufijoTarifario;

  constructor(private http: HttpClient) { }
  obtenerTarifario(diaSemana:number, numpag: number, totalPag: number): Observable<any> {
    console.log(`${this.apiUrl}${this.tarifario}/getAllTarifario/${diaSemana}/${numpag}/${totalPag}`);
    return this.http.get(`${this.apiUrl}${this.tarifario}/getAllTarifario/${diaSemana}/${numpag}/${totalPag}`);
  }

  obtenerTarifarioEmbarcacion(diaSemana:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tarifario}/getAllTarifarioEmbarcacion/${diaSemana}`);
  }

  obtenerTarifarioUnaEmbarcacion(diaSemana:number, idEmbarcacion:number, idTipoServicio:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tarifario}/getTarifarioEmbarcacion/${diaSemana}/${idEmbarcacion}/${idTipoServicio}`);
  }

  obtenerTarifarioUnaPlanta(diaSemana:number, idPlanta:number, idTipoServicio:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tarifario}/getTarifarioPlanta/${diaSemana}/${idPlanta}/${idTipoServicio}`);
  }

  obtenerTarifarioPlanta(diaSemana:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tarifario}/getAllTarifarioPlanta/${diaSemana}`);
  }

  obtenerTarifarioFlete(diaSemana:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tarifario}/getAllTarifarioFlete/${diaSemana}`);
  }

  obtenerTarifarioFletexDestino(destino:string, diaSemana:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.tarifario}/getTarifaFlete/${destino}/${diaSemana}`);
  }

  grabarTarifario(tarifario:TarifarioModel): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/saveTarifa`, tarifario);
  }

  grabarTarifarioFlete(tarifario:TarifarioFleteModel): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/saveTarifaFlete`, tarifario);
  }
  grabarTarifarioEmbarcacion(tarifario:TarifarioModel): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/saveTarifaEmbarcacion`, tarifario);
  }

  grabarTarifarioPlanta(tarifario:TarifarioModel): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/saveTarifaPlanta`, tarifario);
  }
  crearSemana(diaSemana:DiaSemana):Observable<any>{
    return this.http.post(`${this.apiUrl}${this.tarifario}/createWeek`, diaSemana);
  }

}
