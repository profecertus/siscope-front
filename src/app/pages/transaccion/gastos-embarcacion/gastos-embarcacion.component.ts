import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService, EditableTip } from '@devui';
import { SemanaService } from '../../../service/semana.service';
import { MonedaService } from '../../../service/moneda.service';
import { DiaSemana, SemanaModel } from '../../../model/semana.model';
import { format, parse } from 'date-fns';
import { EmbarcacionService } from '../../../service/embarcacion.service';
import { Embarcacion } from '../../../model/embarcacion.model';
import { GastosModel } from '../../../model/gastos.model';
import { ProveedorxTipo } from '../../../model/proveedor.model';
import { ProveedorService } from '../../../service/proveedor.service';

@Component({
  selector: 'app-gastos-embarcacion',
  templateUrl: './gastos-embarcacion.component.html',
  styleUrls: ['./gastos-embarcacion.component.scss']
})
export class GastosEmbarcacionComponent implements OnInit{
  diaSemana: DiaSemana = new DiaSemana();
  semanas: SemanaModel[] = [];
  embarcaciones: Embarcacion[] = [];
  diasxSemana: DiaSemana[] = [];
  semana: SemanaModel = new SemanaModel();
  embarcacion: Embarcacion = new Embarcacion();
  editableTip = EditableTip.btn;
  proveedorHielo:ProveedorxTipo[] = [];
  visible:boolean = false;
  hielo:GastosModel[] = [];
  petroleo:GastosModel[] = [];
  viveres:GastosModel[] = [];
  otros:GastosModel[] = [];

  ngOnInit(): void {
    this.getSemanaActual();
    this.getAllSemanas();
    this.getAllEmbarcaciones();
    this.getAllProveedorxTipo();
  }

  constructor(private dialogService: DialogService, private semanaService: SemanaService,
              private proveedorService: ProveedorService, private embarcacionService: EmbarcacionService) {}

  getAllProveedorxTipo():void{
    this.proveedorService.obtenerProveedorxTipo(3).subscribe(value => {
      this.proveedorHielo = value;
    })
  }

  getAllEmbarcaciones():void{
    this.embarcacionService.obtenerEmbarcaciones(0,100).subscribe(value => {
      this.embarcaciones = value.content;
    })
  }

  getAllSemanas():void{
    this.semanaService.obtenerSemanas(0,52).subscribe(value => {
      this.semanas = value.content;
      this.semanas.forEach(valor => {
        valor.nombreCompleto = valor.id.toString() + " (" + this.getFecha(valor.fechaInicio) + " - " + this.getFecha(valor.fechaFin) + ")";
      })
    });
  }

  getSemanaActual(){
    this.semanaService.semanaActual().subscribe(value => {
        this.diaSemana = value;
    })
  }

  getFecha(idDia: number):string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');
    return fechaFormateada;
  }

  getDiasxSemana(){
    this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
      this.diasxSemana = value;
      this.diasxSemana.forEach(valor=>{
        //Empiezo a crear el arreglo de hielo
        let hielo = new GastosModel();
        hielo.nombreDia = valor.nombreDia;
        hielo.idSemana = valor.idSemana.id;
        hielo.idDia = valor.idDia;
        hielo.idDiaString = this.getFecha(valor.idDia);
        hielo.precio = 0;
        hielo.cantidad = 0
        hielo.idEmbarcacion = 0;
        hielo.total = 0;
        this.hielo.push(hielo);

        //Empiezo a crear el arreglo de Petroleo
        let gastoPetroleo = new GastosModel();
        gastoPetroleo.nombreDia = valor.nombreDia;
        gastoPetroleo.idSemana = valor.idSemana.id;
        gastoPetroleo.idDia = valor.idDia;
        gastoPetroleo.idDiaString = this.getFecha(valor.idDia);
        gastoPetroleo.precio = 0;
        gastoPetroleo.cantidad = 0
        gastoPetroleo.idEmbarcacion = 0;
        gastoPetroleo.total = 0;
        this.petroleo.push(gastoPetroleo);

        //Empiezo a crear el arreglo de viveres
        let viveres = new GastosModel();
        viveres.nombreDia = valor.nombreDia;
        viveres.idSemana = valor.idSemana.id;
        viveres.idDia = valor.idDia;
        viveres.idDiaString = this.getFecha(valor.idDia);
        viveres.precio = 0;
        viveres.cantidad = 0
        viveres.idEmbarcacion = 0;
        viveres.total = 0;
        this.viveres.push(viveres);

        //Empiezo a crear el arreglo de viveres
        let otro = new GastosModel();
        otro.nombreDia = valor.nombreDia;
        otro.idSemana = valor.idSemana.id;
        otro.idDia = valor.idDia;
        otro.idDiaString = this.getFecha(valor.idDia);
        otro.precio = 0;
        otro.cantidad = 0
        otro.idEmbarcacion = 0;
        otro.total = 0;
        this.otros.push(otro);
      })
    }).then(value => {
      //Obtengo lo guardado en petroleo
      this.petroleo.forEach(objeto=>{
        objeto.cantidad = 5.0;
      });
    });
  }


  buscarGastos() {
    if (this.embarcacion.idEmbarcacion == 0 || this.semana.id == 0){
      Swal.fire('Error',"Debe seleccionar una embarcacion y una semana",'error');
      return;
    }
    this.visible = false;
    this.hielo = [];
    this.petroleo = [];
    this.viveres = [];
    this.otros = [];

    //Si todo esta OK procedo a buscar los dias de la semana
    this.getDiasxSemana();

    this.visible = true;
  }

  limpiarGastos() {
    this.embarcacion = new Embarcacion();
    this.semana = new SemanaModel();
  }

  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    console.log(rowItem[field]);
    if (rowItem || rowItem[field] > 0) {
      return false;
    } else {
      return true;
    }
  };

  cambiaProvHielo(rowItem: any, rowIndex: any) {
    //Obtengo el precio del dia
    this.proveedorService.obtenerPrecioxDia(rowItem.idProveedor.idProveedor, rowItem.idProveedor.idTipoServicio, rowItem.idDia).subscribe(value => {
      rowItem.precioCadena = value.precioCadena;
      rowItem.precio = value.precio;
      rowItem.moneda = value.idMoneda;
    });
  }

  onKeyDown(event: KeyboardEvent, rowItem: any, rowIndex:any) {
    if (event.key === 'Enter') {
      // Realizar acciones cuando se presiona Enter
      console.log(rowItem);
    }
  }
}
