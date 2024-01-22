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

  estadoCheck:boolean = true;

  onChange(rowItem:SemanaModel, rowIndex:number, status:any) {
    if(status){
      Swal.fire({
        title: '¿Seguro de Re-aperturar la Semana?',
        html: 'Esto puede traer <strong>Problemas en su cuadre de pagos.</strong>',
        showCancelButton: true,
        confirmButtonText: 'Si,Re-aperturar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          rowItem.estado = status;
          this.basicDataSource[rowIndex] = rowItem;
          this.semanaService.guardarSemana(rowItem).subscribe(value => {
            Swal.fire('Re-apertura Semana', 'Se procedio correctamente', 'success');
          });
        }else{
          this.basicDataSource[rowIndex].estado = false;
          rowItem.estado = false;
          console.log(rowItem);
        }
      })
    }else{
      rowItem.estado = status;
      this.basicDataSource[rowIndex] = rowItem;
      this.semanaService.guardarSemana(rowItem).subscribe();
    }

  }
}
