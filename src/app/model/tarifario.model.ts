import { Moneda } from './moneda.model';
import { ProveedorModel } from './proveedor.model';
import { DiaSemana } from './semana.model';
import { Embarcacion } from './embarcacion.model';
import { CodUbigeo, PlantaDto } from './planta.modelo';
import { Camara } from './camara.model';
import { TipoServicio } from './tipoServicio.model';

export interface  TipoDocumento {
  idTipodoc: number;
  nombre: string;
  abreviatura: string;
  longitud: number | null;
  tipo: string;
  estado: boolean;
  estadoReg: boolean;
}

// Clase para el objeto idProveedor
export interface Proveedor {
  idProveedor: Number;
  razonSocial: String;
  nombreComercial: String;
  idTipodoc: TipoDocumento;
  numeroDocumento: String;
  direccion: String;
  telefono: String;
  correo: String;
  estado: Boolean;
  estadoReg: Boolean;
}

// Clase para el objeto idUm
export interface UnidadMedida {
  idUm: Number;
  nombre: String;
  abreviatura: String;
  estado: Boolean;
  estadoReg: Boolean;
}

// Clase para el objeto idTipoServicio
export interface ITipoServicio {
  idTipoServicio: Number;
  nombre: String;
  idUm: UnidadMedida;
  estado: Boolean;
  estadoReg: Boolean;
}

// Clase para el objeto id
export interface Identificacion {
  idProveedor: Number;
  idTipoServicio: Number;
  idAnio: Number;
}

// Clase principal que representa la estructura completa
export interface TarifarioModel {
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda: Moneda;
  monto: Number;
  estado: Boolean;
  estadoReg: Boolean;
}

export interface TarifarioEmbarcacionModel {
  id: Id;
  idEmbarcacion: Embarcacion;
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda: Moneda;
  monto: number;
  estado: boolean;
  estadoReg: boolean;
}

export interface  Id{
  idDia: Number;
  idEmbarcacion: Number;
  idProveedor: Number;
  idTipoServicio: Number;
}

export  interface TarifarioPlantaIdModel{
  idDia: number;
  idPlanta: number;
  idProveedor: number;
  idTipoServicio: number;

}

export interface TarifarioPlantaModel {
  id: TarifarioPlantaIdModel;
  idPlanta: PlantaDto;
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda: Moneda;
  monto: number;
  estado: boolean;
  estadoReg: boolean;
}

export interface TarifarioFleteIdModel{
  codUbigeoOrigen: string;
  codUbigeoDestino: string;
  idDia: number;
}

export class TarifarioFlete implements TarifarioFleteModel{
  estado: boolean = true;
  estadoReg: boolean = true;
  id: TarifarioFleteIdModel = new class implements TarifarioFleteIdModel {
    codUbigeoOrigen: string = '';
    codUbigeoDestino: string = '';
    idDia: number = 0;
  };
  idDia: DiaSemana = new  DiaSemana();
  idMoneda: Moneda = new Moneda();
  monto: number = 0;
  codUbigeoDestino: CodUbigeo = new CodUbigeo();

}
export interface TarifarioFleteModel {
  id: TarifarioFleteIdModel;
  idDia: DiaSemana;
  idMoneda: Moneda;
  codUbigeoDestino: CodUbigeo;
  monto: number;
  estado: boolean;
  estadoReg:boolean;
}
/*
export interface TarifarioCamaraModel {
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda: Moneda;
  monto: Number;
  estado: Boolean;
  estadoReg: Boolean;
}
*/

