import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormLayout } from '@devui';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SemanaService } from '../../../../service/semana.service';
import { EmbarcacionService } from '../../../../service/embarcacion.service';
import { Embarcacion } from '../../../../model/embarcacion.model';
import { MonedaService } from '../../../../service/moneda.service';
import { Moneda } from '../../../../model/moneda.model';
import { PlantaService } from '../../../../service/planta.service';
import { CamaraService } from '../../../../service/camara.service';
import { RespuestaPlanta } from '../../../../model/planta.modelo';
import { Camara } from '../../../../model/camara.model';
import { PescaService } from '../../../../service/pesca.service';
import { TarifarioService } from '../../../../service/tarifario.service';
import { ProveedorService } from '../../../../service/proveedor.service';
import Swal from 'sweetalert2';
import { format, parse } from 'date-fns';
import { DescargaPesca } from '../../../../model/local/descargaPesca';
import { ProveedorModel } from '../../../../model/proveedor.model';

@Component({
  selector: 'da-nueva-descarga',
  templateUrl: './nueva-descarga.component.html',
  styleUrls: ['./nueva-descarga.component.scss']
})

export class NuevaDescargaComponent  implements OnInit {
  layoutDirection: FormLayout = FormLayout.Columns;
  fechaNumber = 0;
  monedas:Moneda[]=[];
  proveedorDescargaMuelle: ProveedorModel[] = [];
  proveedorComisionPlanta: ProveedorModel[] = [];
  camaras:Camara[]=[];
  tipoAccion:string='';
  datoCargado:boolean = false;
  monedaAtraqueDis:boolean = false;

  @Input() set tipo(val: string) {
    this.tipoAccion = val;
  }

  @Input() set formData(val:any) {
    // @ts-ignore
    let dp:DescargaPesca = val;
    if( Object.keys( this.fb.group(dp).value).length > 0){
      this.fechaNumber = dp.fecha.idDia;
      this.formDescarga = this.fb.group(dp);
      if(dp.muelle.idProveedor != 0){
        this.datoCargado = true;
        this.formDescarga.get('muelle')?.disable();
        this.formDescarga.get('precioAtraque')?.disable();
        this.monedaAtraqueDis = true;
        this.formDescarga.get('monedaAtraque')?.disable();
        this.formDescarga.get('precioMuelle')?.disable();
        this.formDescarga.get('monedaMuelle')?.disable();
      }
      this.formDescarga.get('toneladasCompra')?.disable();
      this.formDescarga.get('toneladasVenta')?.disable();
      this.formDescarga.get('totalFlete')?.disable();
      this.formDescarga.get('proveedorFlete')?.disable();
      this.formDescarga.get('proveedorDescargaPlanta')?.disable();
      this.formDescarga.get('proveedorDescargaMuelle')?.disable();
      this.formDescarga.get('proveedorComisionEmbarcacion')?.disable();
      this.formDescarga.get('proveedorComisionPlanta')?.disable();
    }
  }

  @Output() canceled = new EventEmitter();

  @Output() submit = new EventEmitter();

  formDescarga: FormGroup = this.fb.group({ });

  destinos: any[] = [];
  muelles:any[]=[];
  lavadoCubetas:any[]=[];
  administraciones:any[]=[];

  l_flete:string = 'Total Flete';
  l_renta:string = 'Retención (S/)';

  constructor(private fb: FormBuilder, private semanaService:SemanaService, private pescaService:PescaService,
              private proveedorService:ProveedorService,
              private monedaService:MonedaService, private tarifarioService: TarifarioService,
              private camaraService:CamaraService) {
  }

  ngOnInit() {
    this.getMonedas();
    this.getCamaras();
    this.getMuelles();
    this.getLavadoCubetas();
    this.getAdministraciones();

    //this.selectEmbarcacion(  );
    this.selectPlanta(this.formDescarga.get("planta")?.value);
    //Valores por defecto a cambiar luego luego
    this.formDescarga.get('kgCajaCompra')?.setValue(23.00);
    this.modifiedkgCompra(23.00);
    this.formDescarga.get('kgCajaVenta')?.setValue(25.00);
    this.modifiedkgVenta(25.00);
    this.formDescarga.get('monedaCompra')?.setValue({"idMoneda": 2,"nombre": "DOLARES","abreviatura": "$    "});
    this.formDescarga.get('monedaVenta')?.setValue({"idMoneda": 2,"nombre": "DOLARES","abreviatura": "$    "});
    this.modifiedMonedaVenta({"idMoneda": 2,"nombre": "DOLARES","abreviatura": "$    "});
    //*********************************************************************


    this.formDescarga.get("monedaFlete")?.valueChanges.subscribe((nuevoValor) =>{
      this.selectMoneda(nuevoValor)
    });

    this.formDescarga.get("cajaReal")?.valueChanges.subscribe((nuevoValor:number) =>{
      this.modifiedCajaReal(nuevoValor);
    });

    this.formDescarga.get("kgCajaCompra")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedkgCompra(nuevoValor);
    });

    this.formDescarga.get("monedaVenta")?.valueChanges.subscribe((moneda:any):void =>{
      this.modifiedMonedaVenta(moneda);
    });

    this.formDescarga.get("kgCajaVenta")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedkgVenta(nuevoValor);
    });

    this.formDescarga.get("precioVenta")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedPrecioVenta(nuevoValor);
    });

    this.formDescarga.get("camara")?.valueChanges.subscribe((nuevoValor:any):void =>{
      this.selectPlanta(this.formDescarga.get("planta")?.value);
      this.selectCamara(nuevoValor);
    });

    this.formDescarga.get("muelle")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.selectMuelle(nuevoValor);
    });

    this.formDescarga.get("proveedorDescargaMuelle")?.valueChanges.subscribe((nuevoValor:any):void =>{
      if(nuevoValor.idProveedor == undefined) return;
      this.proveedorService.obtenerPrecioxDia(nuevoValor.idProveedor, nuevoValor.idTipoServicio, this.formDescarga.get("fecha")?.value.idDia ).
      subscribe({
        next:(valor)=>{
          //Ahora debo de buscar la moneda
          this.monedaService.obtenerMoneda(valor.idMoneda).
          subscribe({
            next:(value) => {
              this.formDescarga.patchValue({
                precioDescargaMuelle: valor.precio,
                monedaDescargaMuelle: value,
              });
            }
          });
        }
      });
    });

    if(this.formDescarga.get("planta")?.value.relPlantaProveedorDtoList[0]?.id.idProveedor!=undefined){
      this.tarifarioService.obtenerTarifarioUnaPlanta(this.formDescarga.get("fecha")?.value.idDia,
        this.formDescarga.get("planta")?.value.plantaDto.idPlanta,8).subscribe({
        next:(valor)=>{
          //this.proveedorService.
          this.monedaService.obtenerMoneda(valor.idMoneda).subscribe({
            next:(val) => {
              this.proveedorService.obtenerProveedor(8).subscribe({
                next:(proveedor)=>{
                  console.log(proveedor);
                  this.formDescarga.patchValue({
                    proveedorDescargaPlanta: proveedor,
                    precioDescargaPlanta: valor.monto,
                    monedaDescargaPlanta: val,
                  });
                }
              });

            }
          });
        }
      });
    }

    //Obtengo los proveedores de descarga de muelles
    this.proveedorService.obtenerProveedorxTipo(12).subscribe({
      next:(v)=>{
        this.proveedorComisionPlanta = v;
        this.formDescarga.patchValue({
          proveedorComisionPlanta: v,
        });

      }
    });

    //Obtengo los proveedores de descarga de muelles
    this.proveedorService.obtenerProveedorxTipo(7).subscribe({
      next:(v)=>{
        this.proveedorDescargaMuelle = v;
        this.formDescarga.patchValue({
          proveedorDescargaMuelle: v,
        });

      }
    });

    this.tarifarioService.obtenerTarifarioUnaEmbarcacion( this.formDescarga.get("fecha")?.value.idDia,
                                                          this.formDescarga.get("embarcacion")?.value.idEmbarcacion,
                                                          11 ).subscribe( {
      complete: () => {},
      error: (e) => {console.error(e)},
      next:(v)=>{
        this.monedaService.obtenerMoneda(v.idMoneda).subscribe({
          next:(m)=>{
            this.formDescarga.patchValue({
              precioComisionEmbarcacion: v.monto,
              monedaComisionEmbarcacion: m,
              proveedorComisionEmbarcacion: this.formDescarga.get("embarcacion")?.value.relEmbarcacionProveedorDto[0]?.idProovedor,
            });
          }
        });
      }
    });
  }

  getMuelles():void{
    this.proveedorService.obtenerProveedorxTipo(13).subscribe(value => {
      this.muelles = value;
    });
  }
  getLavadoCubetas():void{
    this.proveedorService.obtenerProveedorxTipo(9).subscribe(value => {
      this.lavadoCubetas = value;
    });
  }
  getAdministraciones():void{
    this.proveedorService.obtenerProveedorxTipo(10).subscribe(value => {
      this.administraciones = value;
    });
  }
  getMonedas(){
    this.monedaService.obtenerMonedas().subscribe(value => {
      this.monedas = value;
    })
  }
  selectMoneda(moneda:any):void{
    this.l_flete = 'Total Flete (' + moneda.abreviatura.trim() + ')';
  }
  selectPlanta(planta:any):void{
    this.destinos = planta.relPlantaDestinoDto;
    this.tarifarioService.obtenerTarifarioFletexDestino(planta.plantaDto.codUbigeo.codUbigeo,
      this.fechaNumber).subscribe(value => {
      if(value.id != null){
        this.l_flete = 'Total Flete (' + value.idMoneda.abreviatura + ')';
        this.formDescarga.patchValue({
          tarifaFlete: value.monto.toFixed(2),
          totalFlete: (value.monto * this.formDescarga.value.cajaReal).toFixed(2),
          monedaFlete:value.idMoneda,
        });
      }
    });
  }


  getCamaras(){
    this.camaraService.getAllCamara().subscribe(value => {
      this.camaras = value;
    });
  }
  selectCamara(camara:any):void{
    this.formDescarga.patchValue({
      proveedorFlete:camara.idProveedor.nombreComercial,
    });

  }
  selectMuelle(muelle:any):void{
    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, muelle.idTipoServicio, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        precioMuelle:value.precio,
        monedaMuelle:monedaEncontrada,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 14, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        monedaHabilitacion:monedaEncontrada,
        precioHabilitacion:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 15, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        precioAtraque:value.precio,
        monedaAtraque:monedaEncontrada,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 16, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        precioCertificado:value.precio,
        monedaCertificado:monedaEncontrada,
      });
    });

    this.formDescarga.patchValue({
      precioRenta:(this.formDescarga.get("toneladasVenta")?.value * this.formDescarga.value.precioVenta * 0.0015).toFixed(2),
    });
  }
  modifiedCajaReal(valor:number):void{
    this.formDescarga.patchValue({
      totalFlete: (this.formDescarga.get('tarifaFlete')?.value * valor).toFixed(2),
      toneladasCompra: this.formDescarga.value.kgCajaCompra * valor / 1000,
      toneladasVenta: this.formDescarga.value.kgCajaVenta * valor / 1000,
      precioRenta:(this.formDescarga.get("toneladasVenta")?.value * this.formDescarga.value.precioVenta * 0.0015).toFixed(2),
    });
  }
  grabar(){
    if (this.formDescarga.valid) {
      Swal.fire({
        title: '¿Seguro de grabar la Descarga de Pesca?',
        showCancelButton: true,
        confirmButtonText: 'Grabar',
        cancelButtonText: 'Cancelar',
      }).then((respuesta) => {
        if (respuesta.isConfirmed) {
          this.formDescarga.get('semana')?.enable();
          this.formDescarga.get('toneladasCompra')?.enable();
          this.formDescarga.get('toneladasVenta')?.enable();
          this.formDescarga.get('totalFlete')?.enable();
          this.formDescarga.get('proveedorFlete')?.enable();
          this.formDescarga.get('proveedorDescargaPlanta')?.enable();
          this.formDescarga.get('proveedorDescargaMuelle')?.enable();
          this.formDescarga.get('proveedorComisionEmbarcacion')?.enable();
          this.formDescarga.get('proveedorComisionPlanta')?.enable();


          let resultado:string = this.formDescarga.get('numTicket')?.value;
          if(resultado.trim().length > 0){
            this.tipoAccion = "M";
          }

          if(this.tipoAccion == "N"){
            this.pescaService.getCorrelativo( Number.parseInt( this.fechaNumber.toString().substring(0,4)) ).
            subscribe(valor =>{
              resultado = `${valor.anio}-${valor.corre.toString().padStart(4, '0')}`;
              this.formDescarga.patchValue({
                numTicket:resultado,
                //_id:resultado,
              });
              this.pescaService.guardarPesca(this.formDescarga.value, this.tipoAccion).forEach(value => {
                this.submit.emit(resultado);
              }).catch((rason) =>{
                if(rason.status == 200 && rason.statusText == "OK"){
                  this.submit.emit(resultado);
                  this.tipoAccion = "M";
                }else{
                  Swal.fire("Error", "Hubo un error al momento de grabar la descarga", 'error')
                }
              });
            });

          }else{
            //en cualquier otro caso es actualización.
            const objetoSinId = { ...this.formDescarga.value };
            delete objetoSinId._id;
            this.pescaService.guardarPesca(objetoSinId, this.tipoAccion).forEach(value => {
              this.submit.emit(resultado);
            }).catch((rason) =>{
              if(rason.status == 200 && rason.statusText == "OK"){
                this.submit.emit(resultado);
              }else{
                Swal.fire("Error", "Hubo un error al momento de grabar la descarga", 'error')
              }
            });
          }
        }
      });


    } else {
      // El formulario no es válido, muestra un mensaje de error o realiza otra acción
      console.error('El formulario no es válido, verifica los campos requeridos.');
    }
  }
  modifiedkgCompra(valor: number) {
    this.formDescarga.patchValue({
      toneladasCompra: this.formDescarga.value.cajaReal * valor / 1000,
    });
  }
  modifiedkgVenta(valor: number) {
    this.formDescarga.patchValue({
      toneladasVenta: this.formDescarga.value.cajaReal * valor / 1000,
      precioRenta:(valor * this.formDescarga.value.precioVenta * 0.0015).toFixed(2),
    });
  }
  modifiedPrecioVenta(valor: number) {
    this.formDescarga.patchValue({
      precioRenta: (valor * this.formDescarga.get("toneladasVenta")?.value * 0.0015).toFixed(2),
    });
  }
  modifiedMonedaVenta(moneda:any):void{
    this.l_renta = 'Retención (' + moneda.abreviatura.trim() + ')';
  }
  protected readonly format = format;
}
