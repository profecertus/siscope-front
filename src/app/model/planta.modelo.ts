import { Cliente } from './cliente.model';

export class RespuestaPlanta{
  plantaDto?: PlantaDto = new PlantaDto();
  relPlantaDestinoDto: RelPlantaDestinoDto[] = [];
  relCliente: Cliente[] = [];
  nombrePlanta:String = '';
  [key: string]: any; // Agregar la firma de índice
}

export class PlantaDto{
  idPlanta: Number = 0;
  nombrePlanta: String = '';
  ruc: Ruc = new Ruc();
  direccion: String = '';
  codUbigeo: CodUbigeo = new CodUbigeo();
  estado: Boolean = true;
  estadoReg: Boolean = true;
  [key: string]: any; // Agregar la firma de índice
}

export class Ruc {
  ruc?: String = '';
  nombre?: String = '';
  [key: string]: any; // Agregar la firma de índice
}

export class CodUbigeo {
  codUbigeo: string = '';
  departamento: string = '';
  provincia: string = '';
  distrito: string = '';
  estadoReg: boolean = true;
  nombreCompleto: string = '';
  [key: string]: any; // Agregar la firma de índice
  getNombre(): string{
    return this.codUbigeo + ' - ' + this.departamento + '/' + this.provincia + '/' + this.distrito;
  }
}

export class RelPlantaDestinoDto{
  idDestino: Number = 0;
  nombre: String = '';
  abreviatura: String = '';
  estado: Boolean = true;
  estadoReg: Boolean = true;
}
