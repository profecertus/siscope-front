import { TipoServicio } from './tipoServicio.model';
import { Moneda } from './moneda.model';
import { Banco } from './banco.model';

export class RespuestaProveedor{
  proveedor: ProveedorModel = new ProveedorModel();
  cuenta: Cuenta = new Cuenta();
  relProvTiposerv: RelProvTipoServ = new RelProvTipoServ();
  [key: string]: any; // Agregar la firma de índice
}

export class ProveedorxTipo{
  idProveedor:number = 0;
  idTipoServicio:number = 0;
  razonSocial:string = '';
  [key: string]: any;

}

export class ProveedorModel {
  id: number = 0;
  razonSocial: string = "";
  nombreComercial: string = "";
  idTipodoc: TipoDocumento = new TipoDocumento();
  numeroDocumento: string = "";
  direccion: string = "";
  telefono: string ="";
  correo: string = "";
  estado: boolean = true;
  estadoReg: boolean = true;
  relProvTiposervDto: TipoServicio[] = [];
  [key: string]: any; // Agregar la firma de índice
}

export class TipoDocumento {
  id: number = 0;
  nombre: string = "";
  abreviatura: string = "";
  estado: boolean = true;
  estadoReg: boolean = true;
  [key: string]: any; // Agregar la firma de índice
}

export class RelProvTipoServ{
  id: idRel = new idRel();
  estado: boolean = true;
  estadoReg: boolean = true;
  idTipoServicio: TipoServicio = new TipoServicio();
  [key: string]: any; // Agregar la firma de índice
}

export class idRel{
  idProveedor: number = 0;
  idTipoServicio: number = 0;
  [key: string]: any; // Agregar la firma de índice
}

export class Cuenta{
  id: IdCuenta = new IdCuenta();
  idProveedor: ProveedorModel = new ProveedorModel();
  idBanco?: Banco;//new Banco();
  idMoneda: Moneda = new Moneda();
  estado: boolean =  true;
  estadoReg: boolean =  true;
}

export class IdCuenta{
  idProveedor: number =0;
  idBanco: number = 0;
  numeroCuenta: string = '';
}
