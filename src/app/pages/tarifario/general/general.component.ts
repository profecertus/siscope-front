import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TarifarioService } from '../../../service/tarifario.service';
import { SemanaService } from '../../../service/semana.service';
import { DiaSemana, SemanaModel } from '../../../model/semana.model';
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
        this.tarifarioService.obtenerTarifario(elemento.idDia).subscribe(
          (elemento:TarifarioModel[]) =>{
            if (elemento.length <= 0){
              Swal.fire({
                title:"Información",
                text:"Al parecer no tenemos productos cargados para esta semana, proceda a Cargar los Productos",
                icon:"warning",
                timer:1500
              });
            }else{
              this.basicDataSource = elemento;
              this.basicDataSourceBkp = elemento;
            }
          }
        );
      }
    );
  }


  fechaSeleccionada = null;
  today = new Date();
  min = new Date(this.today.setDate(this.today.getDate() - 1));
  max = new Date(this.today.setDate(this.today.getDate() + 1));

  getValue(value: any) {
    if (value.selectedDate == null) return;
    let fecha : Date = value.selectedDate;
    console.log(format(fecha, 'yyyyMMdd'));

    this.tarifarioService.obtenerTarifario(Number( format(fecha, 'yyyyMMdd') )).subscribe(
      (elemento:TarifarioModel[]) =>{
        if (elemento.length <= 0){
          Swal.fire({
            title:"Información",
            text:"Al parecer no tenemos productos cargados para esta semana, proceda a Cargar los Productos",
            icon:"warning",
            timer:1500
          });
        }else{
          this.basicDataSource = elemento;
          this.basicDataSourceBkp = elemento;
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
    Swal.fire({
      title: "¿Desea cargar los productos a esta semana?",
      showCancelButton: true,
      confirmButtonText: "Si, cargar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(this.DiaActual);
        this.tarifarioService.crearSemana(this.DiaActual).subscribe(
          (elemento) => {
            this.refresh();
            Swal.fire("Cargado!", "Se cargaron los productos", "success");
          }
        );

      }
    });
  }

  cargarPrecios() {
    Swal.fire({
      title: "¿Desea cargar los precios de la semana pasada?",
      showCancelButton: true,
      confirmButtonText: "Si, cargar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
            Swal.fire("Cargado!", "Se cargaron los precios!!", "success");
      }
    });
  }
  getFecha(idDia: number):string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');

    return fechaFormateada;
  }
}
