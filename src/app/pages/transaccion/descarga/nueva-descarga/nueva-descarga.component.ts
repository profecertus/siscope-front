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
    monedaVenta: {  },
    planta:{},
    camara:{},
    tarifaFlete: new FormControl({ value: 0, disabled: true }),
    toneladasCompra: new FormControl({ value: 0, disabled: true }),
    toneladasVenta: new FormControl({ value: 0, disabled: true }),
    totalFlete: new FormControl({ value: 0, disabled: true }),
    proveedorFlete: new FormControl({ value: '', disabled: true }),
  });



  constructor(private fb: FormBuilder, private semanaService:SemanaService, private pescaService:PescaService,
              private embarcacionService:EmbarcacionService, private monedaService:MonedaService, private tarifarioService: TarifarioService,
              private plantaService:PlantaService, private camaraService:CamaraService) {
  }

  ngOnInit() {
    this.getValue({ selectedDate: new Date() });
    this.getEmbarcaciones();
    this.getMonedas();
    this.getPlantas();
    this.getCamaras();
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
    this.tarifarioService.obtenerTarifarioFletexDestino(this.formDescarga.value.planta.plantaDto.codUbigeo.codUbigeo,
      this.formDescarga.value.fechaNumero).subscribe(value => {
      this.formDescarga.patchValue({
        tarifaFlete: value.monto,
        totalFlete: (value.monto * this.formDescarga.value.cajaReal)
      });
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
