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

@Component({
  selector: 'app-nuevo-arribo',
  templateUrl: './nuevo-arribo.component.html',
  styleUrls: ['./nuevo-arribo.component.scss']
})
export class NuevoArriboComponent implements OnInit {
  layoutDirection: FormLayout = FormLayout.Vertical;

  constructor(private semanaService:SemanaService,
              private plantaService:PlantaService,
              private embarcacionService:EmbarcacionService) {
  }

  max:Date = new Date();
  fechaNumero:number = 0;
  fecha:Date = new Date();
  semana:number = 0;
  embarcaciones:Embarcacion[] = [];
  plantas:PlantaDto[] = [];
  // @ts-ignore
  planta:PlantaDto;
  // @ts-ignore
  embarcacion:Embarcacion;


  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();

  ngOnInit() {
    this.fechaNumero = this.fecha.getFullYear() * 10000 + (this.fecha.getMonth() + 1) * 100 + this.fecha.getDate();
    this.getEmbarcaciones();
    this.getSemana();
    this.getPlantas();
  }

  singleSelectRules: DValidateRules = {validators: [{required: true,message:'El campo es obligatorio'}]};

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
        semana: this.semana,
        embarcacion: this.embarcacion,
        planta: this.planta,
        existeArribo: existeArribo,
        cajaReal:[0, [Validators.pattern('[0-9]*')]],
        cajaGuia:0,
        numTicket:'',
        fechaNumero:0,
        kgCajaCompra:0,
        precioCompra:0,
        monedaCompra: { },
        kgCajaVenta:0,
        precioVenta:0,
        destino:{},
        muelle:{},
        precioMuelle:0,
        monedaMuelle:{},
        precioHabilitacion:0,
        monedaHabilitacion:{},
        precioAtraque:0,
        monedaAtraque:{},
        precioHielo:0,
        monedaHielo:{},
        precioCertificado:0,
        monedaCertificado:{},
        monedaVenta: {  },
        precioRenta:0,
        camara:{},
        tarifaFlete: new FormControl({ value: 0, disabled: false }),
        monedaFlete:{},
        toneladasCompra: new FormControl({ value: 0, disabled: true }),
        toneladasVenta: new FormControl({ value: 0, disabled: true }),
        totalFlete: new FormControl({ value: 0, disabled: true }),
        proveedorFlete: new FormControl({ value: '', disabled: true }),

        precioDescargaMuelle:0,
        monedaDescargaMuelle:{},
        proveedorDescargaMuelle: new FormControl({ value: '', disabled: true }),
        precioDescargaPlanta:0,
        monedaDescargaPlanta:{},
        proveedorDescargaPlanta: new FormControl({ value: '', disabled: true }),

        precioComisionEmbarcacion:0,
        monedaComisionEmbarcacion:{},
        proveedorComisionEmbarcacion: new FormControl({ value: '', disabled: true }),
        precioComisionPlanta:0,
        monedaComisionPlanta:{},
        proveedorComisionPlanta: new FormControl({ value: '', disabled: true }),

        precioLavadoCubeta:0,
        monedaLavadoCubeta:{},
        proveedorLavadoCubeta: {  },
        precioAdministracion:0,
        monedaAdministracion:{},
        proveedorAdministracion: {  },
      }

      this.submitted.emit(objetoRetorno);
    }
  }

  cancel():void{
    this.canceled.emit();
  }

}
