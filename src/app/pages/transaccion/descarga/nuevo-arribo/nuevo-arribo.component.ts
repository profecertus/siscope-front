import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { Embarcacion } from '../../../../model/embarcacion.model';
import { SemanaService } from '../../../../service/semana.service';
import { EmbarcacionService } from '../../../../service/embarcacion.service';
import { DValidateRules } from 'ng-devui/form';
import Swal from 'sweetalert2';
import { PescaService } from '../../../../service/pesca.service';
import { PlantaDto } from '../../../../model/planta.modelo';
import { PlantaService } from '../../../../service/planta.service';
import { FormControl, Validators } from '@angular/forms';
import { DiaSemana, SemanaModel } from '../../../../model/semana.model';
import { format, parse } from 'date-fns';
import { DescargaPesca } from '../../../../model/local/descargaPesca';

@Component({
  selector: 'app-nuevo-arribo',
  templateUrl: './nuevo-arribo.component.html',
  styleUrls: ['./nuevo-arribo.component.scss']
})

export class NuevoArriboComponent implements OnInit {
  layoutDirection: FormLayout = FormLayout.Vertical;

  constructor(private semanaService:SemanaService,
              private plantaService:PlantaService,
              private pescaService:PescaService,
              private embarcacionService:EmbarcacionService) {
  }

  max:Date = new Date();
  fechaSel:Date = new Date();
  fecha:DiaSemana = new DiaSemana();
  semana:SemanaModel = new SemanaModel();
  embarcaciones:Embarcacion[] = [];
  plantas:PlantaDto[] = [];
  planta:PlantaDto = new PlantaDto();
  embarcacion:Embarcacion = new Embarcacion();


  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();

  ngOnInit() {
    this.fecha.idDia = this.fechaSel.getFullYear() * 10000 + (this.fechaSel.getMonth() + 1) * 100 + this.fechaSel.getDate();
    this.getDia();
    this.getEmbarcaciones();
    this.getSemana();
    this.getPlantas();
  }

  singleSelectRules: DValidateRules = {validators: [{required: true,message:'El campo es obligatorio'}]};

  getDia(){
    this.semanaService.getDiaSemana(this.fecha.idDia).subscribe(value => {
      this.fecha = value;
    });
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
  getValue(value: any):void {
    if(value == null) return;
    let fecha:Date = new Date(value);
    this.fecha.idDia = fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate();
    this.semanaService.getDiaSemana(this.fecha.idDia).subscribe(el => {
      this.fecha = el;
      this.getSemana();
      this.getDia();
    });
  }

  getSemana(){
    this.semanaService.semanaxFecha(this.fecha.idDia).subscribe(value => {
        this.semana =  value;
    });
  }

  // @ts-ignore
  submitPlanForm({valid, directive, data, errors}) {
    let objetoRetorno: DescargaPesca = new DescargaPesca({},this.fecha, this.semana, this.embarcacion, this.planta);
    Swal.showLoading();
    this.pescaService.obtenerArribo(this.embarcacion.idEmbarcacion, this.fecha.idDia).subscribe(valor =>{
      if(valor.length > 0){
        //Debo copiarle el muelle, precio atraque del primer elemento
        objetoRetorno.muelle = valor[0].muelle;
        objetoRetorno.precioAtraque = valor[0].precioAtraque;
        objetoRetorno.monedaAtraque = valor[0].monedaAtraque;
        //Si me devuelve un array debo de buscar si la planta ha sido asignada
        let descargaPorPlanta =  valor.filter((el:DescargaPesca) =>{
          return el.planta.idPlanta == this.planta.plantaDto.idPlanta;
        });
        if(descargaPorPlanta.length > 0){
          objetoRetorno = descargaPorPlanta[0];
        }
      }
      this.submitted.emit(objetoRetorno);
      Swal.close();
    });
  }

  cancel():void{
    this.canceled.emit();
  }

}
