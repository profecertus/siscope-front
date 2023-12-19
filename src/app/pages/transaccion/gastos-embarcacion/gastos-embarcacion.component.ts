import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EditableTip } from '@devui';
import { SemanaService } from '../../../service/semana.service';
import { DiaSemana, SemanaModel } from '../../../model/semana.model';
import { format, parse } from 'date-fns';
import { EmbarcacionService } from '../../../service/embarcacion.service';
import { Embarcacion } from '../../../model/embarcacion.model';
import { GastosModel } from '../../../model/gastos.model';
import { ProveedorxTipo } from '../../../model/proveedor.model';
import { ProveedorService } from '../../../service/proveedor.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TarifarioService } from '../../../service/tarifario.service';
import { PescaService } from '../../../service/pesca.service';

@Component({
  selector: 'app-gastos-embarcacion',
  templateUrl: './gastos-embarcacion.component.html',
  styleUrls: ['./gastos-embarcacion.component.scss']
})
export class GastosEmbarcacionComponent implements OnInit {
  diaSemana: DiaSemana = new DiaSemana();
  semanas: SemanaModel[] = [];
  embarcaciones: Embarcacion[] = [];
  diasxSemana: DiaSemana[] = [];
  semana: SemanaModel = new SemanaModel();
  embarcacion: Embarcacion = new Embarcacion();
  editableTip = EditableTip.btn;
  proveedorHielo: ProveedorxTipo[] = [];
  proveedorPetroleo: ProveedorxTipo[] = [];
  buscado: boolean = false;
  idEmbarcacion: number = 0;
  idSemana: number = 0;
  embarcacionSeleccionada: Embarcacion = new Embarcacion();
  semanaSeleccionada: SemanaModel = new SemanaModel();

  petroleo: GastosModel[] = [];
  viveres: GastosModel[] = [];
  otros: GastosModel[] = [];
  hielos: FormGroup;


  ngOnInit(): void {
    this.getSemanaActual();
    this.getAllSemanas();
    this.getAllEmbarcaciones();
    this.getAllProveedorHielo();
    this.getAllProveedorPetroleo();
  }

  constructor(private semanaService: SemanaService, private fb: FormBuilder, private tarifarioService: TarifarioService,
              private proveedorService: ProveedorService, private embarcacionService: EmbarcacionService,
              private pescaService:PescaService) {
    this.hielos = this.fb.group({
      idEmbarcacion: 0,
      idSemana: 0,
      idTipoServicio: 3,
      datos: this.fb.array([]),
    });
    //(this.hielos.get('datos')?.value as FormArray).push(this.fb.group({ "nombre":"Edwin" }));
  }

  get valores(): FormArray {
    return (this.hielos.get('datos') as FormArray)
  }

  getAllProveedorHielo(): void {
    this.proveedorService.obtenerProveedorxTipo(3).subscribe(value => {
      this.proveedorHielo = value;
    })
  }

  getAllProveedorPetroleo(): void {
    this.proveedorService.obtenerProveedorxTipo(2).subscribe(value => {
      this.proveedorPetroleo = value;
    })
  }

  getAllEmbarcaciones(): void {
    this.embarcacionService.obtenerEmbarcaciones(0, 100).subscribe(value => {
      this.embarcaciones = value.content;
    })
  }

  getAllSemanas(): void {
    this.semanaService.obtenerSemanas(0, 52).subscribe(value => {
      this.semanas = value.content;
      this.semanas.forEach(valor => {
        valor.nombreCompleto = valor.id.toString() + " (" + this.getFecha(valor.fechaInicio) + " - " + this.getFecha(valor.fechaFin) + ")";
      })
    });
  }

  getSemanaActual() {
    this.semanaService.semanaActual().subscribe(value => {
      this.diaSemana = value;
    })
  }

  getFecha(idDia: number): string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');
    return fechaFormateada;
  }

  getDiasPorSemana() {
    this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
      this.diasxSemana = value;

      this.diasxSemana.forEach(valor => {
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
        this.valores.push(this.fb.group(hielo));

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
      });
    }).then(value => {

    }).finally(() => {

    });
  }

  buscarGastos() {
    if (this.embarcacion.idEmbarcacion == 0 || this.semana.id == 0) {
      Swal.fire('Error', "Debe seleccionar una embarcacion y una semana", 'error');
      return;
    }
    this.buscado = true;
      //Reinicio los hielos
      this.hielos = this.fb.group({
        idEmbarcacion: this.idEmbarcacion,
        idSemana: this.idSemana,
        idTipoServicio: 3,
        datos: this.fb.array([]),
      });
    //Verifico si existe gastos para esa semana embarcacion
    this.pescaService.getGastoEmb(this.idEmbarcacion, this.idSemana, 3).subscribe(valor=>{
      if(valor.length > 0){
        this.hielos = this.fb.group({
          idEmbarcacion: valor[0].idEmbarcacion,
          idSemana: valor[0].idSemana,
          idTipoServicio: 3,
          datos: this.fb.array(valor[0].datos),
        });
      }
    });
    this.petroleo = [];
    this.viveres = [];
    this.otros = [];


    //Si todo esta OK procedo a buscar los dias de la semana
    this.getDiasPorSemana();
  }

  limpiarGastos() {
    this.embarcacion = new Embarcacion();
    this.semana = new SemanaModel();
  }

  onPrecioChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.hielos.value.datos[rowIndex].total = nuevoPrecio * this.hielos.value.datos[rowIndex].cantidad;
  }

  onCantidadChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.hielos.value.datos[rowIndex].total = nuevoPrecio * this.hielos.value.datos[rowIndex].precio;
  }

  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    if (rowItem) {
      return false;
    } else {
      return true;
    }
  };


  grabarGastos() {
    this.pescaService.guardarGastos(this.hielos.value).subscribe(valor =>{
      Swal.fire("Exito!!", "Se grabo correctamente los Gastos", "success");
    });
    Swal.fire("Exito!!", "Se grabo correctamente los Gastos", "success");
  }

  onProveedorChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.hielos.value.datos[rowIndex].idProveedor.idProveedor,
      this.hielos.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.hielos.value.datos[rowIndex].idDia).subscribe(value => {
      this.hielos.value.datos[rowIndex].monedaString = value.abreviatura;
      this.hielos.value.datos[rowIndex].precio = value.precio;
      this.hielos.value.datos[rowIndex].idMoneda = value.idMoneda;
    });
  }

  deleteRow(rowItem: any, rowIndex: any) {
    this.hielos.value.datos[rowIndex].monedaString = '';
    this.hielos.value.datos[rowIndex].precio = 0;
    this.hielos.value.datos[rowIndex].idMoneda = 0;
    this.hielos.value.datos[rowIndex].cantidad = 0;
    this.hielos.value.datos[rowIndex].total = 0;
    this.hielos.value.datos[rowIndex].idProveedor = new ProveedorxTipo();
    rowItem.value.idProveedorItem = !rowItem.value.idProveedorItem;
  }

  onEmbarcacionChange(event: any) {
    if (this.buscado) {
      Swal.fire({
        title: 'Advertencia',
        text:'¿Seguro de cambiar de embarcación? Se perderán los cambios no grabados.',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          //Blanqueo los Proveedores sin grabar
          this.hielos = this.fb.group({
            datos: this.fb.array([]),
          });
          this.idEmbarcacion = event.idEmbarcacion;
          this.embarcacionSeleccionada = event;
        } else {
          this.embarcacion = this.embarcacionSeleccionada;
        }
      });
      return;
    }
    this.idEmbarcacion = event.idEmbarcacion;
    this.embarcacionSeleccionada = event;
  }

  onSemanaChange(event: any) {
    if (this.buscado) {
      Swal.fire({
        title: 'Advertencia',
        text:'¿Seguro de cambiar de embarcación? Se perderán los cambios no grabados.',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          //Blanqueo los Proveedores sin grabar
          this.hielos = this.fb.group({
            datos: this.fb.array([]),
          });
          this.idSemana = event.id;
          this.semanaSeleccionada = event;
        } else {
          this.semana = this.semanaSeleccionada;
        }
      });
      return;
    }
    this.idSemana = event.id;
    this.semanaSeleccionada = event;
  }
}
