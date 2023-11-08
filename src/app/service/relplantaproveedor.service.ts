import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelplantaproveedorService {

  private apiUrl = environment.urlService;
  private relPlantaProv = environment.sufijoRelPlantaProv;

  constructor(private http: HttpClient) { }
  actualizaRelPlantaProv(idPlanta:string, idProveedor: string, idTipoActividad:string): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.relPlantaProv}/actualizar/${idPlanta}/${idProveedor}/${idTipoActividad}`, null );
  }

}
