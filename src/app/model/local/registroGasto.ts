import { Embarcacion } from '../embarcacion.model';
import { SemanaModel } from '../semana.model';
import { ProveedorModel } from '../proveedor.model';

export class RegistroGasto{
  tipoServicio:TipoServicio = new TipoServicio();
  totalSoles:number = 0;
  totalDolares:number = 0;
  children:RegistroGastoHijo[] = [];
  isParent:boolean = true;
  [key:string]:any;
}

export class TipoServicio{
  nombreProducto:string = '';
  idProducto:number= 0;
  idServicio:number = 0;
  [key:string]:any;
}

export class RegistroGastoHijo{
  tipoServicio:TipoServicio = new TipoServicio();
  totalSoles:number = 0;
  totalDolares:number = 0;
  isParent:boolean = false;
  detalleGasto:DetalleGasto[] = [];
  [key:string]:any;
}

export class DetalleGasto{
  embarcacion:Embarcacion = new Embarcacion();
  semana:SemanaModel = new SemanaModel();
  idDia:number = 0;
  [key:string]:any;
}
