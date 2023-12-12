import { ProveedorxTipo } from './proveedor.model';

export class GastosModel{
  nombreDia:string = '';
  idEmbarcacion:number = 0;
  idSemana:number = 0;
  idDiaString:string= '';
  idDia:number = 0;
  idProveedor:ProveedorxTipo = new ProveedorxTipo();
  cantidad:number = 0;
  precio:number = 0;
  moneda: number = 0;
  precioCadena:string = '';
  total:number = 0;
  [key:string]:any;
}
