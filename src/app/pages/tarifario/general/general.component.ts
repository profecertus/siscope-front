import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Camara } from '../../../model/camara.model';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { TarifarioService } from '../../../service/tarifario.service';
import { SemanaService } from '../../../service/semana.service';
import { SemanaModel } from '../../../model/semana.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {
  basicDataSource: Camara[] = [];
  basicDataSourceBkp: Camara[] = [];
  DatoABuscar: string = "";
  accion:number = 0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Placa',
        prop: 'placa',
        type: 'input',
        required: true,
        deep: 1,
        maxi:10,
        tips: 'Placa',
        placeholder: 'Placa de la Camara',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Marca',
        prop: 'marca',
        type: 'input',
        deep: 1,
        maxi:50,
        placeholder: 'Marca',
      },
      {
        label: 'Modelo',
        prop: 'modelo',
        type: 'input',
        deep: 1,
        maxi:50,
        placeholder: 'Modelo',
      },
      {
        label: 'Proveedor',
        prop: 'idProveedor',
        cabecera:'idProveedor',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Proveedor',
        filterKey: 'razonSocial',
        multipleselect: [],
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
    labelSize: '',
  };
  formData = {};
  editForm: any = null;
  editRowIndex = -1;
  semanaActual:SemanaModel = new SemanaModel();


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
              private semanaService: SemanaService
  ) {}

  ngOnInit() {
    this.getList();
  }

  getList() {

    return this.busy = this.semanaService.semanaActual().
      subscribe((elemento:SemanaModel) => {
        this.semanaActual = elemento;
        this.tarifarioService.obtenerTarifario(elemento).subscribe(
          (elemento) =>{
            if (elemento.length <= 0){
              Swal.fire({
                title:"Información",
                text:"Al parecer no tenemos productos cargados para esta semana, proceda a Cargar los Productos",
                icon:"warning",
                timer:1500
              });
            }else{
              console.log(elemento);
              this.basicDataSource = elemento;
              this.basicDataSourceBkp = elemento;
            }
          }
        );
      }
    );
  }

  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.accion = 0;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Camaras - Edición',
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
  newRow():void {
    let row = new Camara();
    this.editRowIndex = -1;
    this.accion = 1;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Camaras - Nuevo',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(e: Camara, index: number) {
    e.estadoReg = false;
    this.accion = -1;
    Swal.fire({
      title: '¿Seguro de eliminar la Cámara?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        /*this.camaraService.guardarCamara(e).forEach(value => {
          e.placa = value;
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Cámara Eliminada!','success');
        }).catch( error =>{
          console.log(error);
          Swal.fire('Error',"Hubo Problemas al Eliminar la Cámara, intentelo más tarde",'error');
        }).finally(()=>{
          this.editForm!.modalInstance.hide();
        });*/
      }
    })
  }

  onSearch(term: any) {
    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          if (element[key] == null) continue;
          if (element[key].toString().toLowerCase().includes(term.toLowerCase())) {
            return true;
          }
        }
      }
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

  onSubmitted(e: Camara) {
    let mensaje:string="Se actualizo correctamente la Cámara";
    Swal.showLoading( );
    if (this.accion == 1){
      mensaje = "Se grabó correctamente la Cámara";
    }
    /*this.camaraService.guardarCamara(e).forEach(() => {}).then(()  => {
      if(this.accion == 1)
        this.basicDataSource.push(e);
      else
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      this.basicDataSourceBkp = this.basicDataSource;
      Swal.fire('Exito',mensaje,'success');
      this.editForm!.modalInstance.hide();
    }).catch( (error: any) =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar la Cámara." + error,'error');
    });*/
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
        this.tarifarioService.crearSemana(this.semanaActual).subscribe(
          (elemento) => {
            this.refresh();
            Swal.fire("Cargado!", "Se cargaron los productos", "success");
          }
        );

      }
    });

  }

  cargarPrecios() {

  }
}
