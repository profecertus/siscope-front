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

  guardarPesca(pesca:any):Observable<any>{
    return  this.http.post(`${this.apiUrlPesca}${this.pesca}/saveDescarga`, pesca);
  }
}