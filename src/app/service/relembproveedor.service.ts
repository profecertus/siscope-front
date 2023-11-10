import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelembproveedorService {

  private apiUrl = environment.urlService;
  private relEmbProv = environment.sufijoRelEmbProv;

  constructor(private http: HttpClient) { }
  actualizaRelEmbProv(idEmbaracion:string, idProveedor: string, idTipoActividad:string): Observable<any> {
    if(idProveedor == null)
      idProveedor = "-1";
    return this.http.post(`${this.apiUrl}${this.relEmbProv}/actualizar/${idEmbaracion}/${idProveedor}/${idTipoActividad}`, null );

  }

}
