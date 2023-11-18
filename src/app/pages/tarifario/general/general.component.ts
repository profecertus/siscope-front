import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TarifarioService } from '../../../service/tarifario.service';
import { SemanaService } from '../../../service/semana.service';
import { DiaSemana } from '../../../model/semana.model';
import { TarifarioModel } from '../../../model/tarifario.model';
import { Moneda } from '../../../model/moneda.model';
import { MonedaService } from '../../../service/moneda.service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {
  basicDataSource: TarifarioModel[] = [];
  basicDataSourceBkp: TarifarioModel[] = [];
  DatoABuscar: string = "";
  editRowIndex:number = 0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Semana',
        prop: 'idDia',
        cabecera: 'idDia',
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
  fechaSeleccionada:any;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription = new Subscription() ;

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
    return this.busy = this.monedaService.obtenerMonedas().subscribe(
      (elemento: Moneda[]) =>{
        this.monedas = elemento;

      }
    )
  }

  getList() {
    return this.busy = this.semanaService.semanaActual().
    subscribe((elemento:DiaSemana) => {
        this.DiaActual = elemento;
        this.fechaSeleccionada = parse(this.DiaActual.idDia.toString(), 'yyyyMMdd', new Date());
        this.tarifarioService.obtenerTarifario(this.DiaActual.idDia, (this.pager.pageIndex - 1), this.pager.pageSize).subscribe(
          (elemento) =>{
            if (elemento.length <= 0){
              this.cargarProductos();
            }else{
              let tm: TarifarioModel[] = elemento.content;
              this.basicDataSource = tm;
              this.basicDataSourceBkp = tm;
              this.pager.total = elemento.totalElements;
            }
          }
        );
      }
    );
  }

  getListBusca() {
    return this.busy = this.tarifarioService.
    obtenerTarifario( parseInt(format(this.fechaSeleccionada, 'yyyyMMdd')), (this.pager.pageIndex - 1),
      this.pager.pageSize).subscribe(
          (elemento) =>{
            if (elemento.length <= 0){
              this.cargarProductos();
            }else{
              let tm: TarifarioModel[] = elemento.content;
              this.basicDataSource = tm;
              this.basicDataSourceBkp = tm;
              this.pager.total = elemento.totalElements;
            }
          }
        );
  }


  getValue(value: any) {
    if (value.selectedDate == null) return;
    let fecha : Date = value.selectedDate;

    this.tarifarioService.obtenerTarifario(Number( format(fecha, 'yyyyMMdd') ), (this.pager.pageIndex - 1), this.pager.pageSize).subscribe(
      (elemento) =>{
        if (elemento.content.length <= 0){
          Swal.fire({
            title:"Información",
            text:"Lo sentimos, No tenemos tarifario cargado para esta fecha",
            icon:"warning",
            timer:1500
          });
          this.fechaSeleccionada = parse(this.DiaActual.idDia.toString(), 'yyyyMMdd', new Date());
          this.tarifarioService.obtenerTarifario(this.DiaActual.idDia, (this.pager.pageIndex - 1), this.pager.pageSize).subscribe(
            (elem) => {
              this.basicDataSource = elem.content;
              this.basicDataSourceBkp = elem.content;
              this.pager.total = elem.totalElements;
          });
        }else{
          this.fechaSeleccionada = fecha;
          this.basicDataSource = elemento.content;
          this.basicDataSourceBkp = elemento.content;
          this.pager.total = elemento.totalElements;
        }
      });
  }

  editRow(row: any, index: number) {
    this.editRowIndex = index;
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

    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      if(term == null || term.toString().trim().length == 0)
        return true;
      if(JSON.stringify(element, null, 2).toLowerCase().indexOf( term.toLowerCase() ) > 0)
        return true;
      return false;
    });
  }


  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getListBusca();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getListBusca();
  }

  reset() {
    this.pager.pageIndex = 1;
    this.DatoABuscar = "";
    this.getList();
  }

  onSubmitted(e: TarifarioModel) {
    let mensaje:string="Se actualizo correctamente la Tarifa";
    Swal.showLoading( );
    this.tarifarioService.grabarTarifario(e).forEach(() => {}).then(()  => {
      this.basicDataSource.splice(this.editRowIndex, 1, e);
      this.basicDataSourceBkp = this.basicDataSource;
      Swal.fire('Exito',mensaje,'success');
      this.editForm!.modalInstance.hide();
    }).catch( (error: any) =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar la tarifa." + error,'error');
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  cargarProductos() {
    this.tarifarioService.crearSemana(this.DiaActual).subscribe(
    (elemento) => {
          this.tarifarioService.obtenerTarifario(this.DiaActual.idDia, (this.pager.pageIndex - 1), this.pager.pageSize).subscribe(
            (elemento) =>{
              if (elemento.length > 0){
                this.basicDataSource = elemento.content;
                this.basicDataSourceBkp = elemento.content;
                this.pager.total = elemento.content.totalElements;
              }
            }
          );
      }
    );
  }

  getFecha(idDia: number):string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');

    return fechaFormateada;
  }
}
