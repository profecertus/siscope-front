import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProveedorModel } from '../model/proveedor.model';
import { Destino } from '../model/destino.model';
import { Cliente } from '../model/cliente.model';
import { RespuestaPlanta } from '../model/planta.modelo';
import { Camara } from '../model/camara.model';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  private apiUrl = environment.urlService;
  private camara = environment.sufijoCamara;
  private apiUrlCamara = environment.urlServiceTarifario;

  constructor(private http: HttpClient) { }
  obtenerCamaras(numpage:number, numsize:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.camara}/getPageCamara/${numpage}/${numsize}`);
  }

  guardarCamara(datos: Camara):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Realizar la solicitud PUT enviando el objeto JSON
    return this.http.post(`${this.apiUrl}${this.camara}/saveCamara`, datos, { headers });
  }

  getAllCamara():Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Realizar la solicitud PUT enviando el objeto JSON
    return this.http.get(`${this.apiUrlCamara}${this.camara}/getAllCamara`, { headers });
  }
}
