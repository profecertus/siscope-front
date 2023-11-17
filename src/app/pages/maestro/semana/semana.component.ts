import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Camara } from '../../../model/camara.model';
import { SemanaService } from '../../../service/semana.service';
import { SemanaModel } from '../../../model/semana.model';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-semana',
  templateUrl: './semana.component.html',
  styleUrls: ['./semana.component.scss']
})
export class SemanaComponent {
  basicDataSource: SemanaModel[] = [];
  basicDataSourceBkp: SemanaModel[] = [];
  DatoABuscar: string = "";
  accion:number = 0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Semana',
        prop: 'id',
        type: 'input',
        deep: 1,
        soloLectura:true,
        tips: 'Id Semana',
      },
      {
        label: 'Fecha Inicio',
        prop: 'fechaInicio',
        type: 'input',
        deep: 1,
        soloLectura:true,
      },
      {
        label: 'Fecha Fin',
        prop: 'fechaFin',
        type: 'input',
        deep: 1,
        soloLectura:true,
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

  constructor(private dialogService: DialogService, private semanaService: SemanaService) {}

  ngOnInit() {
    this.getList();
  }


  getList() {
    return this.busy = this.semanaService.obtenerSemanas((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : SemanaModel[]  = elemento.content;
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }


  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.accion = 0;
    this.formData = row;
      this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Semanas - Edición',
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
      title: 'Semanas - Nuevo',
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
      title: '¿Seguro de eliminar la Semana?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // @ts-ignore
        this.semanaService.guardarSemana(e).forEach((value: string) => {
          e.placa = value;
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Cámara Eliminada!','success');
        }).catch( (error: any) =>{
          console.log(error);
          Swal.fire('Error',"Hubo Problemas al Eliminar la Cámara, intentelo más tarde",'error');
        }).finally(()=>{
          this.editForm!.modalInstance.hide();
        });
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
    // @ts-ignore
    this.semanaService.guardarSemana(e).forEach(() => {}).then(()  => {
      if(this.accion == 1)
        { // @ts-ignore
          this.basicDataSource.push(e);
        }
      else
        { // @ts-ignore
          this.basicDataSource.splice(this.editRowIndex, 1, e);
        }
      this.basicDataSourceBkp = this.basicDataSource;
      Swal.fire('Exito',mensaje,'success');
      this.editForm!.modalInstance.hide();
    }).catch( (error: any) =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar la Cámara." + error,'error');
    });
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

  valor:boolean = true;
  onChange(rowItem:SemanaModel, rowIndex:number, status:any) {
    rowItem.estado = status;
    this.basicDataSource[rowIndex] = rowItem;
    this.semanaService.guardarSemana(rowItem).subscribe();
  }
}
