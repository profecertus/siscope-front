import { ProveedorxTipo } from './proveedor.model';

export class GastosModel{
  nombreDia:string = '';
  idDiaString:string= '';
  idDia:number = 0;
  idProveedor:ProveedorxTipo = new ProveedorxTipo();
  idProveedorItem:boolean = false;
  cantidad:number = 0;
  precio:number = 0;
  idMoneda: number = 0;
  monedaString:string = '';
  precioCadena:string = '';
  total:number = 0;
  valorCambio:number = 0;
  [key:string]:any;
}
