import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TarifarioService } from '../../../service/tarifario.service';
import { SemanaService } from '../../../service/semana.service';
import { DiaSemana } from '../../../model/semana.model';
import { TarifarioCamara, TarifarioCamaraModel, TarifarioPlantaModel } from '../../../model/tarifario.model';
import { Moneda } from '../../../model/moneda.model';
import { MonedaService } from '../../../service/moneda.service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.scss']
})
export class CamaraComponent {
  basicDataSource: TarifarioCamaraModel[] = [];
  basicDataSourceBkp: TarifarioCamaraModel[] = [];
  DatoABuscar: string = "";
  editRowIndex: number = 0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Planta',
        prop: 'nombrePlanta',
        cabecera: 'idPlanta',
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
  fechaSeleccionada: any;
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
        this.fechaSeleccionada = parse(this.DiaActual.idDia.toString(), 'yyyyMMdd', new Date());
        this.tarifarioService.obtenerTarifarioCamara(elemento.idDia).subscribe(
          (elemento) =>{
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

    this.tarifarioService.obtenerTarifarioPlanta(Number( format(fecha, 'yyyyMMdd') )).subscribe(
      (elemento:TarifarioCamaraModel[]) =>{
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

  newRow() {
    //this.editRowIndex = index;
    this.formData = new TarifarioCamara();
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

  onSubmitted(e: TarifarioCamaraModel) {
    const objetoAModificar =this.basicDataSource.find(objeto => objeto.id.idDia == e.id.idDia &&
      objeto.id.idPlanta == e.id.idPlanta && objeto.id.placa == e.id.placa);
    if (objetoAModificar) {
      let mensaje:string="Se actualizo correctamente la Tarifa";
      Swal.showLoading( );
      this.tarifarioService.grabarTarifarioPlanta(e).forEach(() => {}).then(()  => {
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
