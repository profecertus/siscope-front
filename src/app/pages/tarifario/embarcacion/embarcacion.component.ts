import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TarifarioService } from '../../../service/tarifario.service';
import { SemanaService } from '../../../service/semana.service';
import { DiaSemana } from '../../../model/semana.model';
import { TarifarioEmbarcacionModel, TarifarioModel } from '../../../model/tarifario.model';
import { Moneda } from '../../../model/moneda.model';
import { MonedaService } from '../../../service/moneda.service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-embarcacion',
  templateUrl:
    './embarcacion.component.html',
  styleUrls: ['./embarcacion.component.scss']
})
export class EmbarcacionComponent {
  basicDataSource: TarifarioEmbarcacionModel[] = [];
  basicDataSourceBkp: TarifarioEmbarcacionModel[] = [];
  DatoABuscar: string = "";
  editRowIndex:number = 0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Embarcacion',
        prop: 'nombreEmbarcacion',
        cabecera: 'idEmbarcacion',
        type: 'input',
        deep: 2,
        soloLectura:true,
      },
      {
        label: 'Proveedor',
        prop: 'nombreComercial',
        cabecera: 'idProveedor',
        type: 'input',
        deep: 2,
        soloLectura:true,
      },
      {
        label: 'Servicio',
        prop: 'nombre',
        cabecera: 'idTipoServicio',
        type: 'input',
        deep: 2,
        soloLectura:true,
      },
      {
        label: 'UM',
        prop: 'abreviatura',
        cuerpo:'idUm',
        cabecera: 'idTipoServicio',
        type: 'input',
        deep: 3,
        soloLectura:true,
      },
      {
        label: 'Moneda',
        prop: 'idMoneda',
        cabecera:'idMoneda',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Moneda',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Precio',
        prop: 'monto',
        type: 'number',
        placeholder: 'Precio del producto',
        deep: 1,
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Estado',
        prop: 'estado',
        type: 'switch',
        deep: 1,
      },
    ],
    labelSize: 'lg',
  };
  formData = {};
  editForm: any = null;
  monedas : Moneda[] =[];
  DiaActual:DiaSemana = new DiaSemana();
  fechaSeleccionada = null;
  today = new Date();
  min = new Date(this.today.setDate(this.today.getDate() - 1));
  max = new Date(this.today.setDate(this.today.getDate() + 100));


  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription = new Subscription();

  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate: TemplateRef<any> | undefined;

  constructor(private dialogService: DialogService,
              private tarifarioService: TarifarioService,
              private semanaService: SemanaService,
              private monedaService: MonedaService,
  ) {}

  ngOnInit() {
    this.getList();
    this.getMonedas();
  }

  getMonedas(){
    this.busy = this.monedaService.obtenerMonedas().subscribe(
      (elemento: Moneda[]) =>{
        this.monedas = elemento;
      }
    );
  }

  getList() {
    this.busy = this.semanaService.semanaActual().
    subscribe((elemento:DiaSemana) => {
        this.DiaActual = elemento;
        this.tarifarioService.obtenerTarifarioEmbarcacion(elemento.idDia).subscribe(
          (elemento:TarifarioEmbarcacionModel[]) =>{
            if (elemento.length <= 0){
              //this.cargarProductos();
            }else{
              this.basicDataSource = elemento;
              this.basicDataSourceBkp = elemento;
            }
          }
        );
      }
    );
  }


  getValue(value: any) {
    if (value.selectedDate == null) return;
    let fecha : Date = value.selectedDate;

    this.tarifarioService.obtenerTarifarioEmbarcacion(Number( format(fecha, 'yyyyMMdd') )).subscribe(
      (elemento:TarifarioEmbarcacionModel[]) =>{
        if (elemento.length <= 0){
          Swal.fire({
            title:"Información",
            text:"Lo sentimos, No tenemos tarifario cargado para esta fecha",
            icon:"warning",
            timer:1500
          });
        }else{
          this.basicDataSource = elemento;
          this.basicDataSourceBkp = elemento;
        }
      });
  }

  editRow(row: any) {
    //this.editRowIndex = index;
    this.formData = row;
    this.formConfig.items[4].options = this.monedas;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '400px',
      maxHeight: '600px',
      title: 'Precio Tarifario - Edición',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  refresh():void{
    this.getList();
  }

  onSearch(term: any) {
    /*
    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          if (element[key] == null) continue;
          if (element[key].toString().toLowerCase().includes(term.toLowerCase())) {
            return true;
          }
        }
      }*/
    return false;
    //});


  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }

  reset() {
    this.pager.pageIndex = 1;
    this.DatoABuscar = "";
    this.getList();
  }

  onSubmitted(e: TarifarioEmbarcacionModel) {
    console.log(e.id)
    const objetoAModificar =this.basicDataSource.find(objeto => objeto.id.idDia == e.id.idDia &&
      objeto.id.idEmbarcacion == e.id.idEmbarcacion && objeto.id.idTipoServicio == e.id.idTipoServicio && objeto.id.idProveedor == e.id.idProveedor);
    if (objetoAModificar) {
      let mensaje:string="Se actualizo correctamente la Tarifa";
      Swal.showLoading( );
      this.tarifarioService.grabarTarifarioEmbarcacion(e).forEach(() => {}).then(()  => {
        //this.basicDataSource.splice(this.editRowIndex, 1, e);
        objetoAModificar.idMoneda = e.idMoneda;
        objetoAModificar.monto = e.monto;
        this.basicDataSourceBkp = this.basicDataSource;
        Swal.fire('Exito',mensaje,'success');
        this.editForm!.modalInstance.hide();
      }).catch( (error: any) =>{
        console.error(error);
        Swal.fire('Error',"Hubo Problemas al grabar la tarifa." + error,'error');
      });
    } else {
      console.error('Objeto no encontrado');
    }
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  getFecha(idDia: number):string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');

    return fechaFormateada;
  }
}
