import { Moneda } from './moneda.model';
import { ProveedorModel } from './proveedor.model';
import { DiaSemana } from './semana.model';
import { Embarcacion } from './embarcacion.model';
import { PlantaDto } from './planta.modelo';

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
  idProveedor: number;
  razonSocial: string;
  nombreComercial: string;
  idTipodoc: TipoDocumento;
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  correo: string;
  estado: boolean;
  estadoReg: boolean;
}

// Clase para el objeto idUm
export interface UnidadMedida {
  idUm: number;
  nombre: string;
  abreviatura: string;
  estado: boolean;
  estadoReg: boolean;
}

// Clase para el objeto idTipoServicio
export interface TipoServicio {
  idTipoServicio: number;
  nombre: string;
  idUm: UnidadMedida;
  estado: boolean;
  estadoReg: boolean;
}

// Clase para el objeto id
export interface Identificacion {
  idProveedor: number;
  idTipoServicio: number;
  idAnio: number;
}

// Clase principal que representa la estructura completa
export interface TarifarioModel {
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda:Moneda;
  monto:number;
  estado:boolean;
  estadoReg:boolean;
}

export interface TarifarioEmbarcacionModel {
  idEmbarcacion: Embarcacion;
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda:Moneda;
  monto:number;
  estado:boolean;
  estadoReg:boolean;
}

export interface TarifarioPlantaModel {
  idPlanta: PlantaDto;
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda:Moneda;
  monto:number;
  estado:boolean;
  estadoReg:boolean;
}

export interface TarifarioCamaraModel {
  idProveedor: ProveedorModel ;
  idTipoServicio: TipoServicio;
  idDia: DiaSemana;
  idMoneda:Moneda;
  monto:number;
  estado:boolean;
  estadoReg:boolean;
}


