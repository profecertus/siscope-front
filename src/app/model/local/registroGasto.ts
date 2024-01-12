import { Embarcacion } from '../embarcacion.model';
import { SemanaModel } from '../semana.model';
import { TipoServicio } from '../tipoServicio.model';

export class RegistroGasto{
  embarcacion:Embarcacion = new Embarcacion();
  semana:SemanaModel = new SemanaModel();
  tipoServicio:object = { };
  totalSoles:number = 0;
  totalDolares:number = 0;
  children:RegistroGastoHijo[] = [];
  isParent:boolean = true;
  [key:string]:any;
}

export class RegistroGastoHijo{
  embarcacion:Embarcacion = new Embarcacion();
  semana:SemanaModel = new SemanaModel();
  tipoServicio:object = { };
  totalSoles:number = 0;
  totalDolares:number = 0;
  isParent:boolean = false;
  [key:string]:any;
}
