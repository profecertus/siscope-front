import { Component, OnInit, ViewChild } from '@angular/core';
import { SemanaModel } from '../../../model/semana.model';
import { Embarcacion } from '../../../model/embarcacion.model';
import { PescaService } from '../../../service/pesca.service';
import { SemanaService } from '../../../service/semana.service';
import { EmbarcacionService } from '../../../service/embarcacion.service';
import { format, parse } from 'date-fns';
import { RegistroGasto, RegistroGastoHijo } from '../../../model/local/registroGasto';
import { TipoServicio } from '../../../model/tipoServicio.model';
import { Subscription } from 'rxjs';
import { CheckableRelation, DataTableComponent, TableWidthConfig } from 'ng-devui/data-table';
import { shouldReportDiagnostic } from '@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics';
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
          Swal.fire('Exito','Se pago el '+ rowItem.tipoServicio.nombreProducto ,'success');
        }
    });
  }

  buscarGastos():void{
    this.listaRegistroGasto =[];
    // @ts-ignore
    this.pescaService.getGastos(this.producto['idProducto'], this.embarcacion.idEmbarcacion, this.semana.id).subscribe((valor) => {
      //Por cada producto obtengo el total sabiendo que esta ordenado
      this.productos.forEach((prod:any) => {
        if(prod.idProducto != 0) {
          const registroGasto: RegistroGasto = new RegistroGasto();
          //filtro el valor por el tipo de producto
          const tipoPrd = valor.filter((dato: any) => {
            return dato.idTipoServicio == prod.idProducto
          });
          let totalGastoSoles = 0;
          let totalGastoDolares = 0;
          tipoPrd.forEach((unGasto: any) => {
            registroGasto.embarcacion = unGasto.embarcacion;
            registroGasto.semana = unGasto.semana;
            //Ahora busco en cada dato por Moneda (tener en cuenta)
            const gastoSemana = unGasto.datos.filter((dato: any) => {
              return dato.idProveedor.idProveedor != 0
            });
            gastoSemana.forEach((unDia: any) => {
              var registroDia: RegistroGastoHijo = new RegistroGastoHijo();
              // @ts-ignore
              registroDia.tipoServicio["nombreProducto"] = unDia.idDiaString + ' - ' + unDia.idProveedor.razonSocial;
              // @ts-ignore
              registroDia.tipoServicio["fecha"] = unDia.idDia;
              if (unDia.idMoneda == 1) {
                totalGastoSoles = totalGastoSoles + unDia.total;
                registroDia.totalSoles = unDia.total;
              } else {
                totalGastoDolares = totalGastoDolares + unDia.total;
                registroDia.totalDolares = unDia.total;
              }
              registroGasto.children.push(registroDia);
            });
            registroGasto.children.sort((a, b) =>{
              // @ts-ignore
              return a.tipoServicio["fecha"] - b.tipoServicio["fecha"];
            });
          });
          registroGasto.tipoServicio = new TipoServicio();
          registroGasto.totalSoles = totalGastoSoles;
          registroGasto.totalDolares = totalGastoDolares;
          registroGasto.tipoServicio = prod;
          this.listaRegistroGasto.push(registroGasto);
        }
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
