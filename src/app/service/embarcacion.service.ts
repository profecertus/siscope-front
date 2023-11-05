import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Embarcacion } from '../model/embarcacion.model';

@Injectable({
  providedIn: 'root'
})
export class EmbarcacionService {

  private apiUrl = environment.urlService;
  private embarcacion = environment.sufijoEmbarcacion;


  constructor(private http: HttpClient) { }
  obtenerEmbarcaciones(numpage:number, numsize:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.embarcacion}/getAllEmbarcacion/${numpage}/${numsize}`);
  }

  guardarEmbarcacion(embarcacion:Embarcacion){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Realizar la solicitud PUT enviando el objeto JSON
    return this.http.post(`${this.apiUrl}${this.embarcacion}/saveEmbarcacion`, embarcacion, { headers });
  }
}
