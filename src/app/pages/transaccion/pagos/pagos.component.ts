import { Component, OnInit } from '@angular/core';
import { SemanaModel } from '../../../model/semana.model';
import { Embarcacion } from '../../../model/embarcacion.model';
import { PescaService } from '../../../service/pesca.service';
import { SemanaService } from '../../../service/semana.service';
import { EmbarcacionService } from '../../../service/embarcacion.service';
import { format, parse } from 'date-fns';
import { RegistroGasto } from '../../../model/local/registroGasto';
import { TipoServicio } from '../../../model/tipoServicio.model';


@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit{
  listaRegistroGasto:RegistroGasto[] = [];
  nuevoGasto:boolean = false;
  semana:SemanaModel = new SemanaModel();
  embarcacion:Embarcacion = new Embarcacion();
  semanaTodos:SemanaModel = new SemanaModel();
  embTodos :Embarcacion = new Embarcacion();
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

    this.embarcacionService.obtenerEmbarcaciones(0,100).subscribe((naves) => {
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
  volver():void{}

  grabarPagos():void{}

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
            })
            gastoSemana.forEach((unDia: any) => {
              if (unDia.idMoneda == 1) {
                totalGastoSoles = totalGastoSoles + unDia.total;
              } else {
                totalGastoDolares = totalGastoDolares + unDia.total;
              }
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
    console.log(this.listaRegistroGasto);
  }

  onProductoChange(event:any):void{}

  onEmbarcacionChange(event:any):void{}

  onSemanaChange(event:any):void{}
  /****************************************************************/

}
