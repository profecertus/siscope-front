export class Destino{
  idDestino:number = 0;
  nombre:string = '';
  abreviatura:string = '';
  estado?: boolean = true;
  estadoReg?: boolean = true;
  [key: string]: any; // Agregar la firma de índice
}
