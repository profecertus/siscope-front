import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from '@devui';
import { FormConfig } from '../../../@shared/components/admin-form';
import { Subscription } from 'rxjs';
import { ProveedorModel, RespuestaProveedor, TipoDocumento } from '../../../model/proveedor.model';
import Swal from 'sweetalert2';
import { RespuestaPlanta } from '../../../model/planta.modelo';
import { EmbarcacionService } from '../../../service/embarcacion.service';
import { Embarcacion } from '../../../model/embarcacion.model';
import { ProveedorService } from '../../../service/proveedor.service';

@Component({
  selector: 'app-embarcacion',
  templateUrl: './embarcacion.component.html',
  styleUrls: ['./embarcacion.component.scss']
})

export class EmbarcacionComponent {
  basicDataSource: Embarcacion[] = [];
  basicDataSourceBkp: Embarcacion[] = [];
  proveedores: ProveedorModel[] = [];
  DatoABuscar: string = "";


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Nombre',
        prop: 'nombre',
        type: 'input',
        maxi:100,
        deep: 1,
        tips: 'Nombre',
        required: true,
        rule:{validators: [{ required: true }]},
        placeholder: 'Nombre de la Embarcacion',
      },
      {
        label: 'Proveedor',
        prop: 'idProveedor',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Proveedor',
        filterKey: 'razonSocial',
        multipleselect: [],
        tips:'Solo Proveedores de Pesca',
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Num. Matricula',
        prop: 'numMatricula',
        type: 'input',
        maxi:50,
        deep: 1,
        placeholder: 'Número de Matricula',
      },
      {
        label: 'Tonelaje',
        prop: 'tonelaje',
        type: 'number',
        deep: 1,
        placeholder: 'Tonelaje',
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


  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription = new Subscription() ;

  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate: TemplateRef<any> | undefined;

  constructor(private dialogService: DialogService, private cdr: ChangeDetectorRef,
              private embarcacionService: EmbarcacionService, private proveedorService: ProveedorService
  ) {}

  ngOnInit() {
    this.getList();
    this.getListProveedor();
  }


  getList() {
    return this.busy = this.embarcacionService.obtenerEmbarcaciones((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : Embarcacion[]  = elemento.content;
      //console.log(res);
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }

  getListProveedor(){
    //Obtengo los proveedores y filtro por FLETE (06)
    return this.busy = this.proveedorService.obtenerProveedoresCamara().
    pipe().subscribe((elemento) => {
      let respuesta = elemento.filter(item =>
        item.relProvTiposervDto.filter((valor) => valor['idTipoServicio'].id == 1).length > 0
      );
      this.proveedores = respuesta;
    });
  }

  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.formData = row;
    console.log(row);
    this.formConfig.items[1].options = this.proveedores;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Embarcaciones - Edición',
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
    let row = new Embarcacion();
    this.editRowIndex = -1;
    this.formData = row;
    this.formConfig.items[1].options = this.proveedores;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Embarcaciones - Nuevo',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(e: Embarcacion, index: number) {
    e.estadoReg = false;
    Swal.fire({
      title: '¿Seguro de eliminar la Planta?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.embarcacionService.guardarEmbarcacion(e).forEach(value => {
          //console.log(value);
        }).then(value => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Planta Eliminada!','success');
        }).catch( error =>{
          Swal.fire('Error',"Hubo Problemas al Eliminar la planta, intentelo más tarde",'error');
        }).finally(()=>{
          this.editForm!.modalInstance.hide();
        });
      }
    })
  }

  onSearch(term: any) {
    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      for (const key in element.plantaDto) {
        if (Object.hasOwnProperty.call(element.plantaDto, key)) {
          if (element.plantaDto[key] == null) continue;
          if (element.plantaDto[key].toString().toLowerCase().includes(term.toLowerCase())) {
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

  onSubmitted(e: any) {
    let mensaje:string="Se actualizo correctamente la Planta";
    Swal.showLoading( );
    //En caso sea modificación.
    // @ts-ignore
    if (!(e.idEmbarcacion > 0)){
      // @ts-ignore
      e.idEmbarcacion = null;
      mensaje = "Se grabo correctamente la Planta";
    }
    this.embarcacionService.guardarEmbarcacion(e).forEach(value => {
      //console.log(value);
      e = value;
    }).then(value => {
      // @ts-ignore
      if(e.idEmbarcacion > 0)
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      else
        this.basicDataSource.push(e);
      this.basicDataSourceBkp = this.basicDataSource;
      //Ahora debo de actualizar la relación proveedor con servicio.
      Swal.fire('Exito',mensaje,'success');
    }).catch( error =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar la Planta.",'error');
    }).finally(()=>{
      this.editForm!.modalInstance.hide();
    });

  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
}

