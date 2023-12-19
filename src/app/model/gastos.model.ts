import { ProveedorxTipo } from './proveedor.model';

export class GastosModel{
  nombreDia:string = '';
  idDiaString:string= '';
  idDia:number = 0;
  idProveedor:ProveedorxTipo = new ProveedorxTipo();
  cantidad:number = 0;
  precio:number = 0;
  idMoneda: number = 0;
  monedaString:string = '';
  precioCadena:string = '';
  total:number = 0;
  [key:string]:any;
}
