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
import { UbigeoService } from '../../../service/ubigeo.service';
import { CodUbigeo } from '../../../model/planta.modelo';
import { CamaraService } from '../../../service/camara.service';
import { Camara } from '../../../model/camara.model';

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
        label: 'Camara',
        prop: 'placa',
        type: 'select',
        deep: 1,
        filterKey: 'placa',
        required: true,
        options:[{}],
        tips: 'Camara Placa',
        placeholder: 'Camara',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Destino',
        prop: 'codUbigeo',
        type: 'select',
        deep: 1,
        filterKey: 'distrito',
        required: true,
        options:[{}],
        tips: 'Destino de Camara',
        placeholder: 'Destino',
        rule:{validators: [{ required: true }]},
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
  ubigeos : CodUbigeo[] =[];
  camaras: Camara[] = [];
  monedas : Moneda[] =[];
  DiaActual:DiaSemana = new DiaSemana();
  fechaSeleccionada: any;
  today = new Date();


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
              private ubigeoService: UbigeoService,
              private camaraService: CamaraService,
              private monedaService: MonedaService,
  ) {}

  ngOnInit() {
    this.getList();
    this.getUbigeo();
    this.getCamara();
    this.getMonedas();
  }

  getUbigeo(){
    this.busy = this.ubigeoService.obtenerUbigeos().subscribe(
      (elemento: CodUbigeo[]) =>{
        this.ubigeos = elemento;
      }
    );
  }

  getCamara(){
    this.busy = this.camaraService.getAllCamara().subscribe(
      (elemento: Camara[]) =>{
        this.camaras = elemento;
      }
    );
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
    this.formData = row;
    this.formConfig.items[0].soloLectura = true;
    this.formConfig.items[1].soloLectura = true;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
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
    this.formConfig.items[0].soloLectura = false;
    this.formConfig.items[1].soloLectura = false;
    this.formConfig.items[0].options = this.camaras;
    this.formConfig.items[1].options = this.ubigeos;
    this.formConfig.items[2].options = this.monedas;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
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
    e.idDia = this.DiaActual;
    e.id.idDia = e.idDia.idDia;
    e.id.codUbigeo = e.codUbigeo.codUbigeo;
    e.id.placa  = e.placa.placa;
    const objetoAModificar =this.basicDataSource.find(objeto => objeto.id.idDia == e.id.idDia &&
      objeto.id.codUbigeo == e.id.codUbigeo && objeto.id.placa == e.id.placa);

    if (objetoAModificar) {
      let mensaje:string="Se actualizo correctamente la Tarifa";
      Swal.showLoading( );
      this.tarifarioService.grabarTarifarioCamara(e).forEach(() => {}).then(()  => {
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
      //Inserto el
      this.tarifarioService.grabarTarifarioCamara(e).forEach(() => {}).then(()  => {
        this.basicDataSource.push(e);
        Swal.fire('Exito',"Se grabo correctamente la tarifa de la camara",'success');
      }).catch( (error: any) =>{
        console.error(error);
        Swal.fire('Error',"Hubo Problemas al grabar la tarifa." + error,'error');
      });

    }

  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }



}
