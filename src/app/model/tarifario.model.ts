import { Moneda } from './moneda.model';
import { ProveedorModel } from './proveedor.model';

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
  id: Identificacion;
  idProveedor: ProveedorModel;
  idTipoServicio: TipoServicio;
  idMoneda: Moneda; // Define el tipo correcto para idMoneda
  monto: number; // Define el tipo correcto para monto
  estado: boolean;
  estadoReg: boolean;
}


