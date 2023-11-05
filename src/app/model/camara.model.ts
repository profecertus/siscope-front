import { ProveedorModel } from './proveedor.model';

export class Camara{
  placa:string = '';
  marca:string = '';
  modelo:string = '';
  idProveedor:ProveedorModel = new ProveedorModel();
  estado:boolean = true;
  estadoReg:boolean = true;
  [key:string]:any;
}
