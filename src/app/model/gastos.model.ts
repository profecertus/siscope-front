import { ProveedorxTipo } from './proveedor.model';
import { SemanaModel } from './semana.model';

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
  semanaRel:SemanaModel = new SemanaModel();
  precioCadena:string = '';
  total:number = 0;
  valorCambio:number = 0;
  [key:string]:any;
}
