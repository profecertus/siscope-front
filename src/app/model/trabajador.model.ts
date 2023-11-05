export class Trabajador{
  id:TrabajadorIdDto = new TrabajadorIdDto();
  idTipodoc: TipoDocumentoDto = new TipoDocumentoDto();
  nombres: string = '';
  apellidoPat: string = '';
  apellidoMat: string = '';
  idFormaPago: IdFormaPago = new IdFormaPago();
  idBanco: IdBanco = new IdBanco();
  idMoneda: IdMoneda = new IdMoneda();
  estado: boolean = true;
  estadoReg: boolean = true;
  [key:string]: any;
  setIdTipoDoc(){
    this.id.idTipodoc = this.idTipodoc.id;
  }
}

export class TrabajadorIdDto{
  idTipodoc: number = 0;
  numeroDocumento:string = '';
  [key:string]:any;
}

export class TipoDocumentoDto{
  id:number = 0;
  nombre: string = '';
  abreviatura: string = '';
  estado: boolean = true;
  estadoReg: boolean = true;
 [key:string]:any;
}

export class IdFormaPago{
  idFormaPago: number = 0;
  nombreFormaPago: string = '';
  estado: boolean = true;
  estadoReg: boolean = true;
  [key:string]: any;
}

export class IdBanco{
  idBanco:number = 0;
  nombreBanco: string = '';
  estado: boolean = true;
  estadoReg: boolean = true;
  [key:string]: any;
}

export class IdMoneda{
  id: number = 0;
  nombre: string = '';
  abreviatura: string = '';
  [key:string]: any;
}
