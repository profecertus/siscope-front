export class TipoServicio {
  id?: number = 0;
  nombre?:string = "";
  idUm?: UnidadMedida = new UnidadMedida();
  estado?: boolean = true;
  estadoReg?: boolean = true;
}

export class UnidadMedida {
  id?: number = 0;
  nombre?: string = "";
  abreviatura?: string = "";
  estado?: boolean = true;
  estadoReg?: boolean = true;
}
