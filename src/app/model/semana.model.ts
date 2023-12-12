export class SemanaModel{
  id:number = 0;
  fechaInicio:number = 0;
  fechaFin:number = 0;
  tipoSemana:string = '';
  estado:boolean = true;
  nombreCompleto:string = '';
  [key:string]:any;
}

export class DiaSemana{
  idDia:number = 0;
  idSemana:SemanaModel = new SemanaModel();
  nombreDia: string = '';
  caracteristica:string = '';
  [key:string]:any;

}

