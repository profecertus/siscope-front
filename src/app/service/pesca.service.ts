import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PescaService {

  private apiUrlPesca = environment.urlServicePesca;
  private pesca = environment.sufijoPesca;

  constructor(private http: HttpClient) { }
  obtenerPesca(): Observable<any> {
    return this.http.get(`${this.apiUrlPesca}${this.pesca}/getDescargas`);
  }

  guardarPesca(pesca:any, accion:string):Observable<any>{
    return  this.http.post(`${this.apiUrlPesca}${this.pesca}/saveDescarga/${accion}`, pesca);
  }

  guardarPago(dato:any):Observable<any>{
    return  this.http.post(`${this.apiUrlPesca}${this.pesca}/marcarPagado`, dato);
  }


  guardarGastos(gastos:any):Observable<any>{
    return  this.http.post(`${this.apiUrlPesca}${this.pesca}/saveGastosEmb`, gastos);
  }

  eliminarGastoEmb(embarcacion:number, semana:number, servicio:number):Observable<any>{
    return  this.http.get(`${this.apiUrlPesca}${this.pesca}/eliminarGastosEmb/${embarcacion}/${semana}/${servicio}`);
  }

  getCorrelativo(anio:number):Observable<any>{
    return  this.http.get(`${this.apiUrlPesca}${this.pesca}/getCorrelativo/${anio}`);
  }

  getGastoEmb(embarcacion:number, semana:number, servicio:number):Observable<any>{
    return  this.http.get(`${this.apiUrlPesca}${this.pesca}/getGastosEmb/${embarcacion}/${semana}/${servicio}`);
  }

  getGastos(servicio:number, embarcacion:number, semana:number):Observable<any>{
    return  this.http.get(`${this.apiUrlPesca}${this.pesca}/getGastos/${servicio}/${embarcacion}/${semana}`);
  }
  getAllGastoEmb():Observable<any>{
    return  this.http.get(`${this.apiUrlPesca}${this.pesca}/getAllGastosEmb`);
  }

}
