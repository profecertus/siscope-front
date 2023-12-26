import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemanaModel } from '../model/semana.model';
import { TipoCambioModel } from '../model/tipoCambio.model';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {

  private tipoCambio = environment.sufijoTipoCambio;
  private apiUrlTarifario = environment.urlServiceTarifario;


  constructor(private http: HttpClient) { }

  getAllTipoCambio():Observable<any>{
    return this.http.get(`${this.apiUrlTarifario}${this.tipoCambio}/getAllTipoCambio`);
  }

  getTipoCambioHoy():Observable<any>{
    return this.http.get(`${this.apiUrlTarifario}${this.tipoCambio}/getCambioHoy`)
  }

  getCambioDia(dia:number):Observable<any>{
    return  this.http.get(`${this.apiUrlTarifario}${this.tipoCambio}/getDiaSemana/${dia}`)
  }

  postGrabaTipoCambio(tipoCambio:TipoCambioModel){
    return  this.http.post(`${this.apiUrlTarifario}${this.tipoCambio}/grabarTipoCambio`, tipoCambio);
  }

  postActualizaTipoCambio(fi:number, ff:number, monto:number){
    return this.http.post(`${this.apiUrlTarifario}${this.tipoCambio}/actualizarTipoCambio/${fi}/${ff}/${monto}`, null);
  }
}
