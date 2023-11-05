export class Trabajador{
  idTipodoc: IdTipoDoc = new IdTipoDoc();
  numeroDocumento: string = '';
  nombres: string = '';
  apellidoPat: string = '';
  apellidoMat: string = '';
  idFormaPago: IdFormaPago = new IdFormaPago();
  idBanco: IdBanco = new IdBanco();
  idMoneda: IdMoneda = new IdMoneda();
  estado: boolean = true;
  estadoReg: boolean = true;
  [key:string]: any;
}

export class IdTipoDoc{
  id:number = 0;
  nombre: string = '';
  abreviatura: string = '';
  estado: boolean = true;
  estadoReg: boolean = true;
 [key:string]:any;
}

export class IdFormaPago{
  idFormaPago: number = 0;
  nombre: string = '';
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
