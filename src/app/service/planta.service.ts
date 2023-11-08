import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProveedorModel } from '../model/proveedor.model';
import { Destino } from '../model/destino.model';
import { Cliente } from '../model/cliente.model';
import { RespuestaPlanta } from '../model/planta.modelo';

@Injectable({
  providedIn: 'root'
})
export class PlantaService {

  private apiUrl = environment.urlService;
  private planta = environment.sufijoPlanta;
  private destino = environment.sufijoDestino;
  private cliente = environment.sufijoCliente;

  constructor(private http: HttpClient) { }

  obtenerPlantas(numpage:number, numsize:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.planta}/getAllPage/${numpage}/${numsize}`);
  }

  obtenerPlanta(idPlanta:number):Observable<any>{
    return  this.http.get(`${this.apiUrl}${this.planta}/getPlanta/${idPlanta}`);
  }

  obtenerDestinos() : Observable<Destino[]>{
    // @ts-ignore
    return this.http.get(`${this.apiUrl}${this.destino}/getAllDestino`);
  }

  obtenerClientes() : Observable<Cliente[]>{
    // @ts-ignore
    return this.http.get(`${this.apiUrl}${this.cliente}/getAllCliente`);
  }

  guardarCliente(cliente:Cliente) : Observable<Cliente>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // @ts-ignore
    return this.http.post(`${this.apiUrl}${this.cliente}/saveCliente`, cliente, {headers});
  }

  guardarPlanta(datos: RespuestaPlanta):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Realizar la solicitud PUT enviando el objeto JSON
    return this.http.post(`${this.apiUrl}${this.planta}/savePlanta`, datos, { headers });
  }



}
