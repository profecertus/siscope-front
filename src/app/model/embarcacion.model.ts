import { ProveedorModel } from './proveedor.model';

export class Embarcacion{
  idEmbarcacion:number = 0;
  idProveedor: ProveedorModel = new ProveedorModel();
  nombre:string = '';
  numMatricula:string = '';
  tonelaje:number = 0;
  estado:boolean = true;
  estadoReg:boolean = true;
  [key:string]:any;
}
