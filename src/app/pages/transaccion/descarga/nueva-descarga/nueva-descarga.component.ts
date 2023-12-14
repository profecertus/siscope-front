import { Component, OnInit, signal } from '@angular/core';
import { FormLayout } from '@devui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SemanaService } from '../../../../service/semana.service';
import { EmbarcacionService } from '../../../../service/embarcacion.service';
import { Embarcacion } from '../../../../model/embarcacion.model';
import { MonedaService } from '../../../../service/moneda.service';
import { Moneda } from '../../../../model/moneda.model';
import { PlantaService } from '../../../../service/planta.service';
import { CamaraService } from '../../../../service/camara.service';
import { RespuestaPlanta } from '../../../../model/planta.modelo';
import { Camara } from '../../../../model/camara.model';

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

  formDescarga: FormGroup = this.fb.group({
    semana:0,
    fecha:this.today,
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
  });


  getValue(value: any) {
    let fecha:Date = new Date(value.selectedDate);
    this.fechaNumber = fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate();
    this.getSemana();
  }

  constructor(private fb: FormBuilder, private semanaService:SemanaService,
              private embarcacionService:EmbarcacionService, private monedaService:MonedaService,
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

  getMonedas(){
    this.monedaService.obtenerMonedas().subscribe(value => {
      this.monedas = value;
    })
  }

  getPlantas(){
    this.plantaService.obtenerPlantas(0,100).subscribe(value => {
      this.plantas = value.content;
      this.plantas.forEach(valor => {
        // @ts-ignore
        valor.nombrePlanta = valor.plantaDto.nombrePlanta + ' (' + valor.plantaDto.codUbigeo.distrito + ')';
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
  grabar(){
    console.log(this.formDescarga.value);
  }
}
