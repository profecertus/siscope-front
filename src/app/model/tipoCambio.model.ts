export class TipoCambioModel{
  id:TipoCambioIdModel = new TipoCambioIdModel();
  valorCambio:number=0.00;
  nombreDia:string = '';
  fechaFormateada:string = '';
  [key:string]:any;
}

export class TipoCambioIdModel{
  idMoneda:number = 0;
  idDia:number = 0;
  [key:string]:any;
}
