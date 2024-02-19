import { DiaSemana, SemanaModel } from '../semana.model';
import { Embarcacion } from '../embarcacion.model';
import { PlantaDto } from '../planta.modelo';
import { Moneda } from '../moneda.model';
import { Destino } from '../destino.model';
import { Camara } from '../camara.model';
import { ProveedorModel } from '../proveedor.model';

export class DescargaPesca {
  public existeArribo: boolean = false;
  public cajaReal: number = 0;
  public cajaGuia: number = 0;
  public numTicket:string = '';
  public fechaNumero:number = 0;
  public kgCajaCompra:number = 0;
  public precioCompra:number = 0;
  public monedaCompra:Moneda = new Moneda();
  public toneladasCompra:number = 0;
  public kgCajaVenta:number = 0;
  public precioVenta:number = 0;
  public monedaVenta:Moneda = new Moneda();
  public toneladasVenta:number = 0;
  public destino:Destino = new Destino();
  public muelle:Muelle = new Muelle();
  public precioMuelle:number = 0;
  public monedaMuelle:Moneda =new Moneda();
  public precioHabilitacion:number = 0;
  public monedaHabilitacion:Moneda = new Moneda();
  public precioAtraque:number = 0;
  public monedaAtraque:Moneda = new Moneda();
  public precioHielo:number = 0;
  public monedaHielo:Moneda = new Moneda();
  public precioCertificado:number = 0;
  public monedaCertificado:Moneda = new Moneda();
  public precioRenta:number =0;
  public camara:Camara = new Camara();
  public tarifaFlete:number =0;
  public monedaFlete:Moneda = new Moneda();
  public totalFlete:number = 0;
  public proveedorFlete:ProveedorModel = new ProveedorModel()
  public precioDescargaMuelle:number = 0;
  public monedaDescargaMuelle:Moneda = new Moneda();
  public proveedorDescargaMuelle: ProveedorModel = new ProveedorModel();
  public precioDescargaPlanta:number = 0;
  public monedaDescargaPlanta:Moneda = new Moneda();
  public proveedorDescargaPlanta: ProveedorModel = new ProveedorModel();
  public precioComisionEmbarcacion:number = 0;
  public monedaComisionEmbarcacion:Moneda = new Moneda();
  public proveedorComisionEmbarcacion:ProveedorModel = new ProveedorModel();
  public precioComisionPlanta:number = 0;
  public monedaComisionPlanta:Moneda = new Moneda();
  public proveedorComisionPlanta:ProveedorModel = new ProveedorModel();
  public precioLavadoCubeta:number = 0;
  public monedaLavadoCubeta:Moneda = new Moneda();
  public proveedorLavadoCubeta:ProveedorModel = new ProveedorModel();
  public precioAdministracion:number = 0;
  public monedaAdministracion:Moneda = new Moneda();
  public proveedorAdministracion:ProveedorModel = new ProveedorModel();

  constructor(
    public fecha: DiaSemana,
    public semana: SemanaModel,
    public embarcacion: Embarcacion,
    public planta: PlantaDto,
  ) {}
}

export class Muelle{
  public idProveedor:number = 0;
  public idTipoServicio:number = 0;
  public razonSocial:string = '';
}
