import { Component, OnInit, ViewChild } from '@angular/core';
import { SemanaModel } from '../../../model/semana.model';
import { Embarcacion } from '../../../model/embarcacion.model';
import { PescaService } from '../../../service/pesca.service';
import { SemanaService } from '../../../service/semana.service';
import { EmbarcacionService } from '../../../service/embarcacion.service';
import { format, parse } from 'date-fns';
import { DetalleGasto, RegistroGasto, RegistroGastoHijo } from '../../../model/local/registroGasto';
import { TipoServicio } from '../../../model/tipoServicio.model';
import { Subscription } from 'rxjs';
import { CheckableRelation, DataTableComponent, TableWidthConfig } from 'ng-devui/data-table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit{
  listaRegistroGasto:RegistroGasto[] = [];
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  busy: Subscription = new Subscription() ;
  checkableRelation: CheckableRelation = {downward: true, upward: true};
  loadChildrenTable = (rowItem: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (rowItem.title === 'table title1') {
          if (rowItem.children && rowItem.children.length === 0) {
            rowItem.children.push({
              title: 'table title11',
              lastName: 'Mark',
              status: 'done',
              dob: new Date(1989, 1, 1),
              startDate: new Date(2020, 1, 4),
              endDate: new Date(2020, 1, 8)
            });
          }
        }
        resolve(rowItem);
      }, 500);

    });
  };
  semana:SemanaModel = new SemanaModel();
  embarcacion:Embarcacion = new Embarcacion();
  semanaTodos:SemanaModel = new SemanaModel();
  embTodos :Embarcacion = new Embarcacion();
  iconParentOpen: string='';
  iconParentClose: string='';
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent | undefined;

  producto={
    "idProducto":0,
    "nombreProducto":"TODOS"
  };
  semanas:SemanaModel[] = [];
  embarcaciones:Embarcacion[]=[];
  productos  = [{
    "idProducto":0,
    "nombreProducto":"TODOS"
    },
    {
      "idProducto": 2,
      "nombreProducto":"PETROLEO",
    },
    {
    "idProducto":3,
    "nombreProducto":"HIELO"
  },  {
      "idProducto": 4,
      "nombreProducto":"OTROS",
    },
    {
    "idProducto": 17,
    "nombreProducto":"VIVERES",
  }];


  tableWidthConfig: TableWidthConfig[] = [
    {
      field: '#',
      width: '5%'
    },
    {
      field: 'idProveedor',
      width: '65%'
    },
    {
      field: 'totalSoles',
      width: '10%'
    },
    {
      field: 'totalDolares',
      width: '10%'
    },
    {
      field: 'acciones',
      width: '10%'
    }
  ];

  constructor(private pescaService:PescaService,
              private semanaService:SemanaService,
              private embarcacionService:EmbarcacionService ) {
  }
  ngOnInit(): void {
    /*******Creo la embarcacion TODOS************/
    this.embTodos.nombre = 'TODOS';
    this.embTodos.idEmbarcacion = 0;
    this.embarcacion = this.embTodos;

    this.semanaTodos.nombreCompleto = 'TODOS';
    this.semanaTodos.id = 0;
    this.semana = this.semanaTodos;
    /****************************************/

    this.semanaService.obtenerSemanas(0,54).subscribe(valor =>{
      this.semanas = valor.content;
      this.semanas.forEach(valor => {
        valor.nombreCompleto = valor.id.toString() + " (" + this.getFecha(valor.fechaInicio) + " - " + this.getFecha(valor.fechaFin) + ")";
      })
      this.semanas.unshift(this.semanaTodos);
    });

    this.busy = this.embarcacionService.obtenerEmbarcaciones(0,100).subscribe((naves) => {
      this.embarcaciones = naves.content;
      this.embarcaciones.unshift(this.embTodos)
    });
  }

  getFecha(idDia: number): string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');
    return fechaFormateada;
  }

  /************Metodos de Llamado de los botones*******************/

  grabarPagos(rowItem:any, rowIndex:any):void{

    Swal.fire({
      title:'Seguro de pagar el ' + rowItem.tipoServicio.nombreProducto,
      html:"Una vez marcado el pago no podrá revertir la acción",
      icon:"warning",
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
          this.pescaService.guardarPago(rowItem).subscribe(valor => {
            Swal.fire('Exito','Se pago el '+ rowItem.tipoServicio.nombreProducto ,'success');
          });
        }
    });
  }

  buscarGastos():void{
    this.listaRegistroGasto =[];
    const productoSeleccionado :any[] = [];
    productoSeleccionado.push( this.productos.filter( value => {
      return this.producto.idProducto == 0?value.idProducto != this.producto.idProducto:value.idProducto == this.producto.idProducto;
    }));

    productoSeleccionado[0].forEach((producto:any) =>{
      const registroGasto : RegistroGasto = new RegistroGasto();
      registroGasto.tipoServicio = { nombreProducto: producto.nombreProducto, idProducto: producto.idProducto,idServicio:producto.idProducto };
      this.listaRegistroGasto.push(registroGasto);
    });

    // @ts-ignore
    this.pescaService.getGastos(this.producto['idProducto'], this.embarcacion.idEmbarcacion, this.semana.id).subscribe((valor) => {
      valor.forEach( (unRegistro: any) => {
        //Por cada producto obtengo el total sabiendo que esta ordenado
        this.listaRegistroGasto.filter( registro => {
          if(unRegistro.idTipoServicio == registro.tipoServicio.idServicio){
            //Ahora recorro datos de valor para encontrar los valores.
            unRegistro.datos.forEach( (a:any) => {
              //Ahora debo de actualizar el hijo
              const hijoFiltrado = registro.children.filter( unHijo => {
                return unHijo.tipoServicio.idProducto == a.idProveedor.idProveedor;
              });
              let rgh:RegistroGastoHijo = new RegistroGastoHijo();
              if(hijoFiltrado.length == 0){
                rgh.tipoServicio.idProducto = a.idProveedor.idProveedor;
                rgh.tipoServicio.idServicio = registro.tipoServicio.idServicio;
                rgh.tipoServicio.nombreProducto = a.idProveedor.razonSocial;
              }else{
                rgh = hijoFiltrado[0];
              }
              let miDetalle:DetalleGasto = new DetalleGasto();
              miDetalle.embarcacion = unRegistro.embarcacion;
              miDetalle.semana = a.semanaRel;
              miDetalle.idDia = a.idDia;
              rgh.detalleGasto.push(miDetalle);

              if(a.idMoneda == 1){
                registro.totalSoles +=  a.total;
                rgh.totalSoles += a.total;
              }else{
                registro.totalDolares +=  a.total;
                rgh.totalDolares += a.total;
              }
              //Agrego a la lista
              if(hijoFiltrado.length == 0) {
                registro.children.push(rgh);
              }
            });
          }
        });
      });

      //Busqueda de los valores de descarga
      this.pescaService.getGastosDescarga(this.producto['idProducto'], this.embarcacion.idEmbarcacion, this.semana.id).subscribe((valores) => {
        var tsNombre:String = "";
        var rsHijo:String = "";
        var registroGastoHijo:RegistroGastoHijo = new RegistroGastoHijo();
        var registroGasto:RegistroGasto = new RegistroGasto();

        valores.sort((a:any, b:any) => {
          const comparacionNombre = a.tipoServicioNombre.localeCompare(b.tipoServicioNombre);
          if(comparacionNombre !== 0){
            return comparacionNombre;
          }
          return a.razonSocial.localeCompare(b.razonSocial);
        });

        valores.forEach( (unRegistro: any) => {
          //Valido para la cabecera
          if(unRegistro.tipoServicioNombre != tsNombre){
            registroGasto = new RegistroGasto();
            tsNombre = unRegistro.tipoServicioNombre;
            registroGasto.tipoServicio.nombreProducto = unRegistro.tipoServicioNombre.toUpperCase();
            registroGasto.isParent = true;
            if(unRegistro.idMoneda == 1){
              registroGasto.totalSoles = unRegistro.precio;
            }else{
              registroGasto.totalDolares = unRegistro.precio;
            }
            this.listaRegistroGasto.push(registroGasto);
          }else{
            if(unRegistro.idMoneda == 1){
              registroGasto.totalSoles += unRegistro.precio;
            }else{
              registroGasto.totalDolares += unRegistro.precio;
            }
          }

          //Valido para el cuerpo, OJO acá preocupate por la razón social
          if(unRegistro.razonSocial != rsHijo){
            registroGastoHijo = new RegistroGastoHijo();
            rsHijo = unRegistro.razonSocial;
            registroGastoHijo.isParent = false;
            registroGastoHijo.tipoServicio.nombreProducto = unRegistro.razonSocial;
            if(unRegistro.idMoneda == 1){
              registroGastoHijo.totalSoles = unRegistro.precio;
            }else{
              registroGastoHijo.totalDolares = unRegistro.precio;
            }
            registroGasto.children.push(registroGastoHijo);
          }else{
            if(unRegistro.idMoneda == 1){
              registroGastoHijo.totalSoles += unRegistro.precio;
            }else{
              registroGastoHijo.totalDolares += unRegistro.precio;
            }
          }

        });
        //this.listaRegistroGasto[this.listaRegistroGasto.length - 1].children.push(registroGastoHijo);
      });
    });
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
  }

  formatearDecimales(numero:number, decimales:number):string{
    let array = numero.toString().split(".")
    if (array.length > 1){
      while (array[1].length < decimales) {
        array[1] += "0";
      }
    }else{
      array.push("00");
    }
    return array[0] + '.' + array[1];
  }

  /****************************************************************/

}
