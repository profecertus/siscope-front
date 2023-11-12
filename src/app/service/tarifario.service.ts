import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemanaModel } from '../model/semana.model';

@Injectable({
  providedIn: 'root'
})
export class TarifarioService {

  private apiUrl = environment.urlServiceTarifario;
  private tarifario = environment.sufijoTarifario;

  constructor(private http: HttpClient) { }
  obtenerTarifario(semanaModel:SemanaModel): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.tarifario}/getAllTarifario`, semanaModel);
  }

  crearSemana(semanaModel:SemanaModel):Observable<any>{
    return this.http.post(`${this.apiUrl}${this.tarifario}/createWeek`, semanaModel);
  }

}
