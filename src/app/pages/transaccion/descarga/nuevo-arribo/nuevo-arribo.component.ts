import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { Embarcacion } from '../../../../model/embarcacion.model';
import { SemanaService } from '../../../../service/semana.service';
import { EmbarcacionService } from '../../../../service/embarcacion.service';
import { DValidateRules } from 'ng-devui/form';
import Swal from 'sweetalert2';
import { PescaService } from '../../../../service/pesca.service';

@Component({
  selector: 'app-nuevo-arribo',
  templateUrl: './nuevo-arribo.component.html',
  styleUrls: ['./nuevo-arribo.component.scss']
})
export class NuevoArriboComponent implements OnInit {
  layoutDirection: FormLayout = FormLayout.Vertical;

  constructor(private semanaService:SemanaService,
              private pescaService:PescaService,
              private embarcacionService:EmbarcacionService) {
  }

  max:Date = new Date();
  fechaNumero:number = 0;
  fecha:Date = new Date();
  semana:number = 0;
  embarcaciones:Embarcacion[] = [];
  // @ts-ignore
  embarcacion:Embarcacion;


  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();

  ngOnInit() {
    this.fechaNumero = this.fecha.getFullYear() * 10000 + (this.fecha.getMonth() + 1) * 100 + this.fecha.getDate();
    this.getEmbarcaciones();
    this.getSemana();
  }

  singleSelectRules: DValidateRules = {validators: [{required: true,message:'El campo es obligatorio'}]};

  getEmbarcaciones(){
    this.embarcacionService.obtenerEmbarcaciones(0,100).subscribe(value => {
      this.embarcaciones = value.content;
    });
  }
  getValue(value: any):void {
    if(value == null) return;
    let fecha:Date = new Date(value);
    this.fechaNumero = fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate();
    this.getSemana();

  }

  getSemana(){
    this.semanaService.semanaxFecha(this.fechaNumero).subscribe(value => {
        this.semana =  value.idSemana;
    });
  }

  // @ts-ignore
  submitPlanForm({valid, directive, data, errors}) {
    let existeArribo:boolean = false;
    if (valid) {
      Swal.fire({
        title: "Verificando arribo",
        html: "No cierre esta ventana.",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          //Aca llamo a pesca para que me diga si existe o no
          //this.pescaService.
          Swal.close();
        }
      }).then((result) => {

      });
      //Envio el ExisteArribo a submitted
      let objetoRetorno = {
        fecha: new Date(this.fecha),
        embarcacion: this.embarcacion,
        existeArribo: existeArribo,
      }

      this.submitted.emit(objetoRetorno);
    }
  }

  cancel():void{
    this.canceled.emit();
  }

}
