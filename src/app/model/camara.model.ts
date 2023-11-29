import { ProveedorModel } from './proveedor.model';

export class Camara{
  placa:string = '';
  marca:string = '';
  modelo:string = '';
  eje: number = 0;
  idProveedor:ProveedorModel = new ProveedorModel();
  estado:boolean = true;
  estadoReg:boolean = true;
  [key:string]:any;
}
