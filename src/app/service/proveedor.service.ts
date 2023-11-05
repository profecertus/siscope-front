import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProveedorModel } from '../model/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = environment.urlService;
  private proveedor = environment.sufijoProveedor;

  constructor(private http: HttpClient) { }

  obtenerProveedores(numpage:number, numsize:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.proveedor}/getAllPage/${numpage}/${numsize}`);
  }

  obtenerProveedoresCamara(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.proveedor}/getAll`);
  }

  guardarProveedor(datos: ProveedorModel):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Realizar la solicitud PUT enviando el objeto JSON
    return this.http.post(`${this.apiUrl}${this.proveedor}/saveProveedorWithService`, datos, { headers });
  }

}
