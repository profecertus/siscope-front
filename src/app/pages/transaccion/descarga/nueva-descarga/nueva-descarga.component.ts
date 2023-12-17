import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormLayout } from '@devui';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SemanaService } from '../../../../service/semana.service';
import { EmbarcacionService } from '../../../../service/embarcacion.service';
import { Embarcacion } from '../../../../model/embarcacion.model';
import { MonedaService } from '../../../../service/moneda.service';
import { Moneda } from '../../../../model/moneda.model';
import { PlantaService } from '../../../../service/planta.service';
import { CamaraService } from '../../../../service/camara.service';
import { RespuestaPlanta } from '../../../../model/planta.modelo';
import { Camara } from '../../../../model/camara.model';
import { PescaService } from '../../../../service/pesca.service';
import { TarifarioService } from '../../../../service/tarifario.service';
import { ProveedorService } from '../../../../service/proveedor.service';

@Component({
  selector: 'da-nueva-descarga',
  templateUrl: './nueva-descarga.component.html',
  styleUrls: ['./nueva-descarga.component.scss']
})

export class NuevaDescargaComponent  implements OnInit {
  layoutDirection: FormLayout = FormLayout.Columns;
  today = new Date();
  max = this.today;
  fechaNumber = 0;
  embarcaciones:Embarcacion[] = [];
  monedas:Moneda[]=[];
  plantas:RespuestaPlanta[]=[];
  camaras:Camara[]=[];

  @Output() canceled = new EventEmitter();

  @Output() submit = new EventEmitter();

  formDescarga: FormGroup = this.fb.group({
    semana: new FormControl({ value: 0, disabled: true }),
    fecha:this.today,
    fechaObj:{},
    embarcacion:{},
    cajaReal:[0, [Validators.pattern('[0-9]*')]],
    cajaGuia:0,
    fechaNumero:0,
    kgCajaCompra:0,
    precioCompra:0,
    monedaCompra: { },
    kgCajaVenta:0,
    precioVenta:0,
    destino:{},
    muelle:{},
    precioMuelle:0,
    precioHabilitacion:0,
    precioAtraque:0,
    precioHielo:0,
    precioCertificado:0,
    monedaVenta: {  },
    precioRenta:0,
    planta:{},
    camara:{},
    tarifaFlete: new FormControl({ value: 0, disabled: true }),
    toneladasCompra: new FormControl({ value: 0, disabled: true }),
    toneladasVenta: new FormControl({ value: 0, disabled: true }),
    totalFlete: new FormControl({ value: 0, disabled: true }),
    proveedorFlete: new FormControl({ value: '', disabled: true }),
  });
  destinos: any[] = [];
  muelles:any[]=[];

  constructor(private fb: FormBuilder, private semanaService:SemanaService, private pescaService:PescaService,
              private proveedorService:ProveedorService,
              private embarcacionService:EmbarcacionService, private monedaService:MonedaService, private tarifarioService: TarifarioService,
              private plantaService:PlantaService, private camaraService:CamaraService) {
  }

  ngOnInit() {
    this.getValue({ selectedDate: new Date() });
    this.getEmbarcaciones();
    this.getMonedas();
    this.getPlantas();
    this.getCamaras();
    this.getMuelles();
  }

  getMuelles():void{
    this.proveedorService.obtenerProveedorxTipo(13).subscribe(value => {
      this.muelles = value;
    });
  }

  getSemana(){
    this.semanaService.semanaxFecha(this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        semana: value.idSemana,
        fechaNumero: this.fechaNumber,
      });
    });
  }

  getDiaSemana():void{
    this.semanaService.getDiaSemana(this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        fechaObj:value
      })
    });
  }

  getMonedas(){
    this.monedaService.obtenerMonedas().subscribe(value => {
      this.monedas = value;
    })
  }

  getPlantas(){
    this.plantaService.obtenerPlantas(0,100).subscribe(value => {
      this.plantas = value.content;
      this.plantas.forEach(valor => {
        valor.nombrePlanta = valor.plantaDto?.nombrePlanta + ' (' + valor.plantaDto?.codUbigeo.distrito + ')';
      });
    })
  }

  getEmbarcaciones(){
    this.embarcacionService.obtenerEmbarcaciones(0,100).subscribe(value => {
      this.embarcaciones = value.content;
    });
  }

  getCamaras(){
    this.camaraService.getAllCamara().subscribe(value => {
      this.camaras = value;
    });
  }

  getValue(value: any):void {
    if(value.selectedDate == null) return;
    let fecha:Date = new Date(value.selectedDate);
    this.fechaNumber = fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate();
    this.getSemana();
    this.getDiaSemana();
  }

  selectCamara():void{
    this.formDescarga.patchValue({
      proveedorFlete:this.formDescarga.value.camara.idProveedor.nombreComercial,
    });

  }

  selectPlanta():void{
    console.log("ENTRO");
    console.log(this.formDescarga.value.planta);
    this.destinos = this.formDescarga.value.planta.relPlantaDestinoDto;
    this.tarifarioService.obtenerTarifarioFletexDestino(this.formDescarga.value.planta.plantaDto.codUbigeo.codUbigeo,
      this.formDescarga.value.fechaNumero).subscribe(value => {
      this.formDescarga.patchValue({
        tarifaFlete: value.monto,
        totalFlete: (value.monto * this.formDescarga.value.cajaReal)
      });
    });
  }

  selectMuelle():void{
    let muelle:any = this.formDescarga.value.muelle;
    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, muelle.idTipoServicio, this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        precioMuelle:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 14, this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        precioHabilitacion:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 15, this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        precioAtraque:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 16, this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        precioCertificado:value.precio,
      });
    });

    this.formDescarga.patchValue({
      precioRenta:this.formDescarga.get("toneladasVenta")?.value * this.formDescarga.value.precioVenta * 0.015,
    });
  }


  modifiedCajaReal(event:number):void{
    this.formDescarga.patchValue({
      totalFlete: this.formDescarga.get('tarifaFlete')?.value * event,
      toneladasCompra: this.formDescarga.value.kgCajaCompra * event / 1000,
      toneladasVenta: this.formDescarga.value.kgCajaVenta * event / 1000,
    });
  }
  grabar(){
    this.pescaService.guardarPesca(this.formDescarga.value).subscribe(value => {
      this.submit.emit();
    });

    this.submit.emit();
  }

  salir():void{
    this.canceled.emit();
  }

  modifiedkgCompra(valor: number) {
    this.formDescarga.patchValue({
      toneladasCompra: this.formDescarga.value.cajaReal * valor / 1000,
    });
  }


  modifiedkgVenta(valor: number) {
    this.formDescarga.patchValue({
      toneladasVenta: this.formDescarga.value.cajaReal * valor / 1000,
    });
  }

}
