export class RespuestaPlanta{
  plantaDto?: PlantaDto = new PlantaDto();
  relPlantaDestinoDto: RelPlantaDestinoDto[] = [];
  [key: string]: any; // Agregar la firma de índice
}

export class PlantaDto{
  idPlanta?:number;
  nombre?:string = '';
  ruc?:Ruc = new Ruc();
  direccion?:string = '';
  codUbigeo:CodUbigeo = new CodUbigeo();
  estado?: boolean = true;
  estadoReg?: boolean = true;
  [key: string]: any; // Agregar la firma de índice
}

export class Ruc {
  ruc?: string = "";
  nombre?: string = "";
  [key: string]: any; // Agregar la firma de índice
}

export class CodUbigeo {
  codUbigeo: string = "";
  departamento: string = "";
  provincia: string = "";
  distrito: string = "";
  estadoReg: boolean = true;
  nombreCompleto: string = '';
  [key: string]: any; // Agregar la firma de índice
  getNombre():string{
    return this.codUbigeo + " - " + this.departamento + "/" + this.provincia + "/" + this.distrito;
  }
}

export class RelPlantaDestinoDto{
  idDestino?:number = 0;
  nombre?:string = '';
  abreviatura:string='';
  estado?: boolean = true;
  estadoReg?: boolean = true;
}
