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
  }, {
    "idProducto": 4,
    "nombreProducto":"OTROS",
  }];
  producto:any[] = [];
  nuevoDetalle: boolean = false;
  semana: SemanaModel = new SemanaModel();
  semanaRel: SemanaModel = new SemanaModel();
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
  otros: FormGroup;


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

    this.otros = this.fb.group({
      embarcacion: new Embarcacion(),
      semana: new SemanaModel(),
      idTipoServicio: 17,
      datos: this.fb.array([]),
    });
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

  get valOtros(): FormArray {
    return (this.otros.get('datos') as FormArray)
  }

  getAllGastosEmb(){
    this.producto = [];
    this.semana = new SemanaModel();
    this.embarcacion = new Embarcacion();
    return this.busy = this.pescaService.getAllGastoEmb().subscribe(valuex => {
      valuex.forEach((value: { datos: any[], total?:number; })=>{
        let totalMonto:number = 0;
        value.datos.forEach(valor =>{
          if (valor.idMoneda != 1){
            totalMonto += valor.total * valor.valorCambio;
          }else{
            totalMonto += valor.total;
          }
        });
        value.total = totalMonto;
      });
      valuex.slice().forEach((a: any) => {console.log(a.semana.id)});
      this.basicDataSource =  valuex.slice().sort((a:any,b:any) => {return a.semana.id < b.semana.id})
      //this.basicDataSource = valuex;
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
      const semanavalue = value.content;

      this.semanas = semanavalue.filter( (valor: SemanaModel) => {return valor.estado == true} );

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
         //Obtengo el estado Actual de la semana
         this.semanaService.getSemana(valor[0].semana.id).subscribe( semanaEncontrada =>{
           // @ts-ignore
           semanaEncontrada['nombreCompleto']  = semanaEncontrada['id'] + " (" + this.getFecha(semanaEncontrada['fechaInicio']) + " - " + this.getFecha(semanaEncontrada['fechaFin']) + ")";

           this.hielos = this.fb.group({
             embarcacion: valor[0].embarcacion,
             semana: semanaEncontrada,
             idTipoServicio: 3,
             datos: this.fb.array(valor[0].datos),
           });
         });
      }else{
        this.valores.clear();
        this.semanaService.getDiasxSemana(this.semana.id).subscribe(value => {
          this.diasxSemana = [];
          value.forEach((valor: string) => {
            this.diasxSemana.push(JSON.parse(valor))
          });

          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de hielo
            let hielo:GastosModel = new GastosModel();
            hielo.nombreDia = valor["nombreDia"];
            hielo.idDia = valor["idDia"];
            hielo.idDiaString = this.getFecha(valor["idDia"]);
            hielo.precio = 0;
            hielo.cantidad = 0
            hielo.total = 0;
            hielo.valorCambio = valor["valorCambio"];
            //hielo.semanaRel = this.semana;
            hielo.precioCadena = '';
            this.valores.push(this.fb.group(hielo));
          });
        });
      }
    });
   /* this.valores.controls.slice().forEach(a=>{console.log(a)})
    this.valores.controls.slice().sort((a,b) => {
      const aValue = a.value;
      const bValue = b.value;
      return aValue.localeCompare(bValue);
    });*/

    //Verifico si existe gastos para esa semana en Petroleo
    this.pescaService.getGastoEmb(this.embarcacion.idEmbarcacion, this.semana.id, 2).subscribe(valor=>{
      if(valor.length > 0){
        this.semanaService.getSemana(valor[0].semana.id).subscribe( semanaEncontrada =>{
          // @ts-ignore
          semanaEncontrada['nombreCompleto']  = semanaEncontrada['id'] + " (" + this.getFecha(semanaEncontrada['fechaInicio']) + " - " + this.getFecha(semanaEncontrada['fechaFin']) + ")";
          this.petroleos = this.fb.group({
            embarcacion: valor[0].embarcacion,
            semana: semanaEncontrada,
            idTipoServicio: 2,
            //nombreCompleto: semanaEncontrada.id.toString() + " (" + this.getFecha(semanaEncontrada.fechaInicio) + " - " + this.getFecha(semanaEncontrada.fechaFin) + ")",
            datos: this.fb.array(valor[0].datos),
          });
        });
      }else{
        this.valPetroleo.clear();
        this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
          this.diasxSemana = [];
          value.forEach((valor: string) => {
            this.diasxSemana.push(JSON.parse(valor))
          });

          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de hielo
            let gastoPetroleo = new GastosModel();
            gastoPetroleo.nombreDia = valor["nombreDia"];
            gastoPetroleo.idDia = valor["idDia"];
            gastoPetroleo.idDiaString = this.getFecha(valor["idDia"]);
            gastoPetroleo.precio = 0;
            gastoPetroleo.cantidad = 0
            gastoPetroleo.total = 0;
            gastoPetroleo.valorCambio = valor["valorCambio"];
            gastoPetroleo.precioCadena = '';
            this.valPetroleo.push(this.fb.group(gastoPetroleo));
          });
        });
      }
    });

    //Verifica si existe gastos para esa semana en Viveres
    this.pescaService.getGastoEmb(this.embarcacion.idEmbarcacion, this.semana.id, 17).subscribe(valor=>{
      if(valor.length > 0){
        this.semanaService.getSemana(valor[0].semana.id).subscribe( semanaEncontrada =>{
          // @ts-ignore
          semanaEncontrada['nombreCompleto']  = semanaEncontrada['id'] + " (" + this.getFecha(semanaEncontrada['fechaInicio']) + " - " + this.getFecha(semanaEncontrada['fechaFin']) + ")";
          this.viveres = this.fb.group({
            embarcacion: valor[0].embarcacion,
            semana: semanaEncontrada,
            idTipoServicio: 17,
            //nombreCompleto: semanaEncontrada.id.toString() + " (" + this.getFecha(semanaEncontrada.fechaInicio) + " - " + this.getFecha(semanaEncontrada.fechaFin) + ")",
            datos: this.fb.array(valor[0].datos),
          });
        });
      }else{
        this.valViveres.clear();
        this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
          this.diasxSemana = [];
          value.forEach((valor: string) => {
            this.diasxSemana.push(JSON.parse(valor))
          });
          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de viveres
            let viveres = new GastosModel();
            viveres.nombreDia = valor["nombreDia"];
            viveres.idDia = valor["idDia"];
            viveres.idDiaString = this.getFecha(valor["idDia"]);
            viveres.precio = 0;
            viveres.cantidad = 0
            viveres.total = 0;
            viveres.valorCambio = valor["valorCambio"];
            //viveres.semanaRel = this.semana;
            viveres.precioCadena = '';
            this.valViveres.push(this.fb.group(viveres));
          });
        });
      }
    });

    //Verifica si existe gastos para esa semana en Otros
    this.pescaService.getGastoEmb(this.embarcacion.idEmbarcacion, this.semana.id, 4).subscribe(valor=>{
      if(valor.length > 0){
        this.semanaService.getSemana(valor[0].semana.id).subscribe( semanaEncontrada =>{
          // @ts-ignore
          semanaEncontrada['nombreCompleto']  = semanaEncontrada['id'] + " (" + this.getFecha(semanaEncontrada['fechaInicio']) + " - " + this.getFecha(semanaEncontrada['fechaFin']) + ")";
          this.otros = this.fb.group({
            embarcacion: valor[0].embarcacion,
            semana: semanaEncontrada,
            idTipoServicio: 17,
            datos: this.fb.array(valor[0].datos),
          });
        });
      }else{
        this.valOtros.clear();
        this.semanaService.getDiasxSemana(this.semana.id).forEach(value => {
          this.diasxSemana = [];
          value.forEach((valor: string) => {
            this.diasxSemana.push(JSON.parse(valor))
          });
          this.diasxSemana.forEach(valor => {
            //Empiezo a crear el arreglo de viveres
            let otros = new GastosModel();
            otros.nombreDia = valor["nombreDia"];
            otros.idDia = valor["idDia"];
            otros.idDiaString = this.getFecha(valor["idDia"]);
            otros.precio = 0;
            otros.cantidad = 0
            otros.total = 0;
            otros.valorCambio = valor["valorCambio"];
            otros.precioCadena = '';
            this.valOtros.push(this.fb.group(otros));
          });
        });
      }
    });
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

  formatearDecimales(numero:number, decimales:number):string{
    let array = numero.toString().split(".")
    if (array.length > 1){
      while (array[1].length < decimales) {
        array[1] += "0";
      }
    }else{
      array.push("000");
    }
    return array[0] + '.' + array[1];
  }


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
    const listaGastosPromises: Promise<any>[] = [];
    //Primero verifico que todos tienen al menos un proveedor seleccionado en la semana
    let encontrado:boolean = false;
    let valorCero:boolean = false;
    this.producto.forEach(value => {
      let total = 0;
      if(value.idProducto == 2){
        this.petroleos.value.datos.forEach((valor: any) => {
          if(valor["idProveedorItem"]==true){
            if(valor["total"] == 0){
              valorCero = true;
            }
          }
          if(valor["pagado"] == undefined){
            valor["pagado"] = false;
          }
          total += valor.idProveedor.idProveedor;
        });
        if(total == 0){
          encontrado = true;
        }
      }

      if(value.idProducto == 3 && !encontrado){
        this.hielos.value.datos.forEach((valor: any) => {
          //Valido que no haya precio ni cantidad cero
          if(valor["idProveedorItem"]==true){
            if(valor["total"] == 0){
              valorCero = true;
            }
          }
          if(valor["pagado"] == undefined){
            valor["pagado"] = false;
          }
          total += valor.idProveedor.idProveedor;
        });
        if(total == 0){
          encontrado = true;
        }
      }

      if(value.idProducto == 17 && !encontrado){
        this.viveres.value.datos.forEach((valor: any) => {
          //Valido que no haya precio ni cantidad cero
          if(valor["idProveedorItem"]==true) {
            if (valor["total"] == 0) {
              valorCero = true;
            }
          }
          if(valor["pagado"] == undefined){
            valor["pagado"] = false;
          }
          total += valor.idProveedor.idProveedor;
        });
        if(total == 0){
          encontrado = true;
        }
      }
    });

    if(encontrado){
      Swal.fire("Información", "Recuerde que debe de seleccionar al menos un proveedor por producto", "warning");
      return;
    }

    if(valorCero){
      Swal.fire("Error", "No puede grabar con  cantidad/precio igual a cero", "error");
      return;
    }

    this.producto.forEach(value => {
      if(value.idProducto == 2){
        const promisePetroleo = this.pescaService.guardarGastos(this.petroleos.value)
          .forEach(() =>{})
          .catch((falta)=>{
            Swal.fire("Error", "Sucedio un error al momento de grabar, intente luego", "error");
          });
        listaGastosPromises.push(promisePetroleo);
      }

      if(value.idProducto == 3 ){
        const promiseHielo = this.pescaService.guardarGastos(this.hielos.value)
          .forEach(() =>{})
          .catch((falta)=>{
            Swal.fire("Error", "Sucedio un error al momento de grabar, intente luego", "error");1
        });
        listaGastosPromises.push(promiseHielo);
      }

      if(value.idProducto == 17){
        const promiseViveres = this.pescaService.guardarGastos(this.viveres.value)
          .forEach(()=>{}).catch((falta)=>{
          Swal.fire("Error", "Sucedio un error al momento de grabar, intente luego", "error");
        });
        listaGastosPromises.push(promiseViveres);
      }
    });

    Promise.all(listaGastosPromises)
      .then(()=>{
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
            this.getAllGastosEmb();
          }
        });
      })
      .catch(()=>{
        Swal.fire("Error","Sucedio un Error al momento de grabar", "error");
      });
  }

  onProveedorHieloChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDiaOMaximo(this.hielos.value.datos[rowIndex].idProveedor.idProveedor,
      this.hielos.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.hielos.value.datos[rowIndex].idDia).subscribe(value => {
      this.hielos.value.datos[rowIndex].monedaString = value.abreviatura==null?'S/.':value.abreviatura;
      this.hielos.value.datos[rowIndex].precio = value.precio==null?0:value.precio;
      this.hielos.value.datos[rowIndex].idMoneda = value.idMoneda==null?1:value.idMoneda;
      this.hielos.value.datos[rowIndex].semanaRel = this.semana;
    });
  }

  onProveedorViveresChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.viveres.value.datos[rowIndex].idProveedor.idProveedor,
      this.viveres.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.viveres.value.datos[rowIndex].idDia).subscribe(value => {
      this.viveres.value.datos[rowIndex].monedaString = value.abreviatura==null?'S/.':value.abreviatura;
      this.viveres.value.datos[rowIndex].precio = value.precio==null?0:value.precio;
      this.viveres.value.datos[rowIndex].idMoneda = value.idMoneda==null?1:value.idMoneda;
      this.viveres.value.datos[rowIndex].semanaRel = this.semana;
    });
  }

  onProveedorPetroleoChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.petroleos.value.datos[rowIndex].idProveedor.idProveedor,
      this.petroleos.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.petroleos.value.datos[rowIndex].idDia).subscribe(value => {
      this.petroleos.value.datos[rowIndex].monedaString = value.abreviatura==null?'S/.':value.abreviatura;
      this.petroleos.value.datos[rowIndex].precio = value.precio==null?0:value.precio;
      this.petroleos.value.datos[rowIndex].idMoneda = value.idMoneda==null?1:value.idMoneda;
      this.petroleos.value.datos[rowIndex].semanaRel = this.semana;
    });
  }

  onProveedorOtrosChange(valor: any, rowIndex: any, rowItem: any) {
    this.proveedorService.obtenerPrecioxDia(this.otros.value.datos[rowIndex].idProveedor.idProveedor,
      this.otros.value.datos[rowIndex].idProveedor.idTipoServicio,
      this.otros.value.datos[rowIndex].idDia).subscribe(value => {
      this.otros.value.datos[rowIndex].monedaString = value.abreviatura==null?'S/.':value.abreviatura;
      this.otros.value.datos[rowIndex].precio = value.precio==null?0:value.precio;
      this.otros.value.datos[rowIndex].idMoneda = value.idMoneda==null?1:value.idMoneda;
      this.otros.value.datos[rowIndex].semanaRel = this.semana;
    });
  }

  deleteRow(rowItem: any, rowIndex: any) {
    this.semanaService.getSemana(rowItem.value.semanaRel.id).subscribe(semanaEncontrada => {
      // @ts-ignore
      if(semanaEncontrada.estado){
        Swal.fire({
          title:"Eliminar Gasto Embarcación",
          html: `¿Seguro de Eliminar el Gasto de ${rowItem.idTipoServicio == 3? 'Hielo':rowItem.idTipoServicio == 2?'Petroleo':'Viveres'}  en la semana ${rowItem.value.semanaRel.id} ?`,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.pescaService
              .eliminarGastoEmb(this.idEmbarcacion, this.semana.id, rowItem.idTipoServicio)
              .subscribe(valor => {
                if(valor.length > 0){
                  Swal.fire("Exito", "Se elimino correctamente el gasto", "success");
                  this.getAllGastosEmb();
                }else{
                  Swal.fire("Error", "Sucedio un error al momento de eliminar el gasto", "error");
                }
              });
          }
        });
      }else{
        Swal.fire("Error", "El gasto que intenta eliminar esta asociado a una semana cerrada, abrá la semana si desea continuar", "error");
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
    this.semanaRel = event;
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
