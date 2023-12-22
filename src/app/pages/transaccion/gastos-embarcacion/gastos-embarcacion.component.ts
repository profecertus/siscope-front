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
import { Subscription } from 'rxjs';

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
  basicDataSource: any[] = [];
  productos  = [{
    "idProducto":3,
    "nombreProducto":"HIELO"
  },{
    "idProducto": 2,
    "nombreProducto":"PETROLEO",
  }, {
    "idProducto": 17,
    "nombreProducto":"VIVERES",
  }];
  producto:any[] = [];
  nuevoDetalle: boolean = false;
  semana: SemanaModel = new SemanaModel();
  embarcacion: Embarcacion = new Embarcacion();
  editableTip = EditableTip.btn;
  proveedorHielo: ProveedorxTipo[] = [];
  proveedorViveres: ProveedorxTipo[] = [];
  proveedorPetroleo: ProveedorxTipo[] = [];
  buscado: boolean = false;
  idEmbarcacion: number = 0;
  idSemana: number = 0;

  busy: Subscription = new Subscription() ;

  hielos: FormGroup;
  petroleos: FormGroup;
  viveres: FormGroup;


  ngOnInit(): void {
    this.getSemanaActual();
    this.getAllSemanas();
    this.getAllEmbarcaciones();
    this.getAllProveedorHielo();
    this.getAllProveedorPetroleo();
    this.getAllProveedorViveres();
    this.getAllGastosEmb();
  }

  constructor(private semanaService: SemanaService, private fb: FormBuilder, private tarifarioService: TarifarioService,
              private proveedorService: ProveedorService, private embarcacionService: EmbarcacionService,
              private pescaService:PescaService) {
    this.hielos = this.fb.group({
      embarcacion: new Embarcacion(),
      semana: new SemanaModel(),
      idTipoServicio: 3,
      datos: this.fb.array([]),
    });

    this.petroleos = this.fb.group({
      embarcacion: new Embarcacion(),
      semana: new SemanaModel(),
      idTipoServicio: 2,
      datos: this.fb.array([]),
    });

    this.viveres = this.fb.group({
      embarcacion: new Embarcacion(),
      semana: new SemanaModel(),
      idTipoServicio: 17,
      datos: this.fb.array([]),
    });
    //(this.hielos.get('datos')?.value as FormArray).push(this.fb.group({ "nombre":"Edwin" }));
  }

  get valores(): FormArray {
    return (this.hielos.get('datos') as FormArray)
  }

  get valPetroleo(): FormArray {
    return (this.petroleos.get('datos') as FormArray)
  }

  get valViveres(): FormArray {
    return (this.viveres.get('datos') as FormArray)
  }

  getAllGastosEmb(){
    return this.busy = this.pescaService.getAllGastoEmb().subscribe(value => {
      this.basicDataSource = value;
    });
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

  getAllProveedorViveres(): void {
    this.proveedorService.obtenerProveedorxTipo(17).subscribe(value => {
      this.proveedorViveres = value;
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

  }

  buscarGastos() {
    if (this.embarcacion.idEmbarcacion == 0 || this.semana.id == 0 || this.producto.length == 0) {
      Swal.fire('Error', "Debe seleccionar una embarcacion, una semana y al menos un producto", 'error');
      return;
    }
    this.buscado = true;
    this.nuevoDetalle = true;
    //Verifico si existe gastos para esa semana embarcacion
    this.pescaService.getGastoEmb(this.embarcacion.idEmbarcacion, this.semana.id, 3).subscribe(valor=>{
      if(valor.length > 0){
        this.hielos = this.fb.group({
          embarcacion: valor[0].embarcacion,
          semana: valor[0].semana,
          idTipoServicio: 3,
          datos: this.fb.array(valor[0].datos),
        });
      }else{
        this.valores.clear();
        this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
          this.diasxSemana = value;
          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de hielo
            let hielo = new GastosModel();
            hielo.nombreDia = valor.nombreDia;
            hielo.idDia = valor.idDia;
            hielo.idDiaString = this.getFecha(valor.idDia);
            hielo.precio = 0;
            hielo.cantidad = 0
            hielo.total = 0;
            this.valores.push(this.fb.group(hielo));
          });
        });
      }
    });

    //Verifico si existe gastos para esa semana en Petroleo
    this.pescaService.getGastoEmb(this.embarcacion.idEmbarcacion, this.semana.id, 2).subscribe(valor=>{
      if(valor.length > 0){
        this.petroleos = this.fb.group({
          embarcacion: valor[0].embarcacion,
          semana: valor[0].semana,
          idTipoServicio: 2,
          datos: this.fb.array(valor[0].datos),
        });
      }else{
        this.valPetroleo.clear();
        this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
          this.diasxSemana = value;
          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de hielo
            let gastoPetroleo = new GastosModel();
            gastoPetroleo.nombreDia = valor.nombreDia;
            gastoPetroleo.idDia = valor.idDia;
            gastoPetroleo.idDiaString = this.getFecha(valor.idDia);
            gastoPetroleo.precio = 0;
            gastoPetroleo.cantidad = 0
            gastoPetroleo.total = 0;
            this.valPetroleo.push(this.fb.group(gastoPetroleo));
          });
        });
      }
    });

    //Verifica si existe gastos para esa semana en Viveres
    this.pescaService.getGastoEmb(this.embarcacion.idEmbarcacion, this.semana.id, 17).subscribe(valor=>{
      if(valor.length > 0){
        this.viveres = this.fb.group({
          embarcacion: valor[0].embarcacion,
          semana: valor[0].semana,
          idTipoServicio: 17,
          datos: this.fb.array(valor[0].datos),
        });
      }else{
        this.valViveres.clear();
        this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
          this.diasxSemana = value;
          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de viveres
            let viveres = new GastosModel();
            viveres.nombreDia = valor.nombreDia;
            viveres.idDia = valor.idDia;
            viveres.idDiaString = this.getFecha(valor.idDia);
            viveres.precio = 0;
            viveres.cantidad = 0
            viveres.total = 0;
            this.valViveres.push(this.fb.group(viveres));
          });
        });
      }
    });
    //Si todo esta OK procedo a buscar los dias de la semana
    this.getDiasPorSemana();
  }

  limpiarGastos() {
    Swal.fire({
      title:"Volver a la Lista sin grabar",
      html:"¿Seguro de volver a la lista de Gastos por Embarcación?",
      icon:"question",
      showCancelButton: true,
      confirmButtonText: 'Si, Volver',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.nuevoDetalle = false;
        this.embarcacion = new Embarcacion();
        this.semana = new SemanaModel();
        this.producto = [];
      }
    });
  }

  onPrecioHieloChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.hielos.value.datos[rowIndex].total = nuevoPrecio * this.hielos.value.datos[rowIndex].cantidad;
  }

  onPrecioPetroleoChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.petroleos.value.datos[rowIndex].total = nuevoPrecio * this.petroleos.value.datos[rowIndex].cantidad;
  }

  onPrecioViveresChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.viveres.value.datos[rowIndex].total = nuevoPrecio * this.viveres.value.datos[rowIndex].cantidad;
  }

  onCantidadHieloChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.hielos.value.datos[rowIndex].total = nuevoPrecio * this.hielos.value.datos[rowIndex].precio;
  }

  onCantidadPetroleoChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.petroleos.value.datos[rowIndex].total = nuevoPrecio * this.petroleos.value.datos[rowIndex].precio;
  }

  onCantidadViveresChange(nuevoPrecio: number, rowIndex: any, rowItem: any) {
    this.viveres.value.datos[rowIndex].total = nuevoPrecio * this.viveres.value.datos[rowIndex].precio;
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

  buscarProductoSeleccionado(idProducto:number):boolean{
    let productoSeleccionado : boolean =  false;
    this.producto.forEach(value =>{
      if (value.idProducto == idProducto){
        productoSeleccionado = true;
      }
    } );
    return productoSeleccionado;
  }
  grabarGastos() {
    this.producto.forEach(value => {
      if(value.idProducto == 2){
        this.pescaService.guardarGastos(this.petroleos.value).forEach(valor =>{
          Swal.fire({
            title: "Exito!!",
            html: "Se grabo correctamente los Gastos",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: 'Seguir Editando',
            cancelButtonText: 'Volver a la Lista',
          }).then((result) => {
            if (result.isDismissed) {
              this.nuevoDetalle = false;
            }
          });
        }).catch((falta)=>{
          if(falta.status==200){
            Swal.fire({
              title: "Exito!!",
              html: "Se grabo correctamente los Gastos",
              icon: "success",
              showCancelButton: true,
              confirmButtonText: 'Seguir Editando',
              cancelButtonText: 'Volver a la Lista',
            }).then((result) => {
              if (result.isDismissed) {
                this.nuevoDetalle = false;
              }
            });
          }else{
            Swal.fire("Error", "Sucedio un error al momento de grabar, intente luego", "error")
          }
        });
      }

      if(value.idProducto == 3){
        this.pescaService.guardarGastos(this.hielos.value).forEach(valor =>{
          Swal.fire({
            title: "Exito!!",
            html: "Se grabo correctamente los Gastos",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: 'Seguir Editando',
            cancelButtonText: 'Volver a la Lista',
          }).then((result) => {
            if (result.isDismissed) {
              this.nuevoDetalle = false;
            }
          });
        }).catch((falta)=>{
          if(falta.status==200){
            Swal.fire({
              title: "Exito!!",
              html: "Se grabo correctamente los Gastos",
              icon: "success",
              showCancelButton: true,
              confirmButtonText: 'Seguir Editando',
              cancelButtonText: 'Volver a la Lista',
            }).then((result) => {
              if (result.isDismissed) {
                this.nuevoDetalle = false;
              }
            });
          }else{
            Swal.fire("Error", "Sucedio un error al momento de grabar, intente luego", "error")
          }
        });
      }

      if(value.idProducto == 17){
        this.pescaService.guardarGastos(this.viveres.value).forEach(valor =>{
          Swal.fire({
            title: "Exito!!",
            html: "Se grabo correctamente los Gastos",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: 'Seguir Editando',
            cancelButtonText: 'Volver a la Lista',
          }).then((result) => {
            if (result.isDismissed) {
              this.nuevoDetalle = false;
            }
          });
        }).catch((falta)=>{
          if(falta.status==200){
            Swal.fire({
              title: "Exito!!",
              html: "Se grabo correctamente los Gastos",
              icon: "success",
              showCancelButton: true,
              confirmButtonText: 'Seguir Editando',
              cancelButtonText: 'Volver a la Lista',
            }).then((result) => {
              if (result.isDismissed) {
                this.nuevoDetalle = false;
              }
            });
          }else{
            Swal.fire("Error", "Sucedio un error al momento de grabar, intente luego", "error")
          }
        });
      }
    });
  }

  onProveedorHieloChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.hielos.value.datos[rowIndex].idProveedor.idProveedor,
      this.hielos.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.hielos.value.datos[rowIndex].idDia).subscribe(value => {
      this.hielos.value.datos[rowIndex].monedaString = value.abreviatura;
      this.hielos.value.datos[rowIndex].precio = value.precio;
      this.hielos.value.datos[rowIndex].idMoneda = value.idMoneda;
    });
  }

  onProveedorViveresChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.viveres.value.datos[rowIndex].idProveedor.idProveedor,
      this.viveres.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.viveres.value.datos[rowIndex].idDia).subscribe(value => {
      this.viveres.value.datos[rowIndex].monedaString = value.abreviatura;
      this.viveres.value.datos[rowIndex].precio = value.precio;
      this.viveres.value.datos[rowIndex].idMoneda = value.idMoneda;
    });
  }

  onProveedorPetroleoChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.petroleos.value.datos[rowIndex].idProveedor.idProveedor,
      this.petroleos.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.petroleos.value.datos[rowIndex].idDia).subscribe(value => {
      this.petroleos.value.datos[rowIndex].monedaString = value.abreviatura;
      this.petroleos.value.datos[rowIndex].precio = value.precio;
      this.petroleos.value.datos[rowIndex].idMoneda = value.idMoneda;
    });
  }

  deleteRow(rowItem: any, rowIndex: any) {
    Swal.fire({
      title:"Eliminar Gasto Embarcación",
      html: `¿Seguro de Eliminar el Gasto de ${rowItem.idTipoServicio == 3? 'Hielo':rowItem.idTipoServicio == 2?'Petroleo':'Viveres'} para la embarcación  ${rowItem.embarcacion.nombre} en la semana ${rowItem.semana.id} ?`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
  }

  onEmbarcacionChange(event: any) {
    this.embarcacion = event;
    this.hielos.patchValue({
      embarcacion:event,
    });

    this.petroleos.patchValue({
      embarcacion:event,
    });

    this.viveres.patchValue({
      embarcacion:event,
    });
  }

  onSemanaChange(event: any) {
    this.semana = event;
    this.hielos.patchValue({
      semana:event,
    });

    this.petroleos.patchValue({
      semana:event,
    });

    this.viveres.patchValue({
      semana:event,
    });
  }

  onProductoChange(event: any) {
    this.producto = event;
  }

  editRow(rowItem: any, rowIndex: number) {
    this.embarcacion = rowItem.embarcacion;
    this.semana = rowItem.semana;
    console.log(rowItem);
    switch (rowItem.idTipoServicio){
      case 2:
        this.producto = [{
          "idProducto": 2,
          "nombreProducto":"PETROLEO",
        }];
        break;
      case 3:
        this.producto = [{
          "idProducto":3,
          "nombreProducto":"HIELO"
        }];
        break;
      case 17:
        this.producto = [{
          "idProducto": 17,
          "nombreProducto":"VIVERES",
        }];
    }
    this.buscarGastos();
  }
}
