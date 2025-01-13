import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { URL_BACKEND } from 'src/app/config/config';
import { Local } from 'src/app/models/local';
import { LocalService } from 'src/app/services/local.service';
import { Movimiento } from 'src/app/models/movimiento';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { MetodoPago } from 'src/app/models/metodoPago';

@Component({
  selector: 'app-listar-movimiento',
  templateUrl: './listar-movimiento.component.html',
  styleUrls: ['./listar-movimiento.component.css']
})
export class ListarMovimientoComponent {
  movimientos: Movimiento[] = [];
  movimiento:Movimiento= new Movimiento();
  paginador: any;
  pages: number[] = []; // Array para el paginador
  URL_BACKEND: string=URL_BACKEND;
  totales: { [key: string]: number } = {};
  mostrarTotales: boolean = false;
  locales: Local[] = [];  // Lista de locales obtenida desde el servicio
  localSeleccionado: number = 0; // Almacena el ID del local seleccionado
  metodosPago: MetodoPago[] = [];
  tipoMovimientoSeleccionado: string = '';
  nroFicha: string = '';
  fechaSeleccionada: string = '';
  metodoPagoSeleccionado: string = '';

 constructor(private movimientoService: MovimientoService,
  private localService: LocalService,
  public authService: AuthService,
  private metodoPagoService: MetodoPagoService,
  ){
  }

  ngOnInit(): void{
    this.cargarLocales();
    this.cargarMetodosPago();
    this.aplicarFiltros();
  }

  cargarLocales(){
    this.localService.getLocales().subscribe(data => {
      this.locales = data; // Almacena los locales en el array
    });
  }

  cargarMetodosPago(): void {
    this.metodoPagoService.getmetodosPagos().subscribe(data => {
      this.metodosPago = data;
    });
  }

  eliminarMovimiento(movimientoAEliminar:Movimiento){
    Swal.fire({
      title: '¿Estás seguro ?',
      text: "No puedes revertir este cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.movimientoService.deleteMovimiento(movimientoAEliminar.id).subscribe(
          response=>{
            Swal.fire(
              'Movimiento eliminado','El producto ha sido eliminada con éxito!','success'
            )
            this.cargarMovimientos();
          }
        )
        
      }
    })
  }

  cargarMovimientos(page: number = 0): void {
    this.movimientoService.getMovimientos(page).subscribe({
      next: response => {
        this.movimientos = response.content as Movimiento[];
        this.paginador = response;
        this.generarPaginador(response.totalPages); // Actualiza el paginador
      },
      error: error => {
        Swal.fire('Error', 'Hubo un problema al cargar los movimientos.', 'error');
        console.error(error);
      },
      complete: () => {
        console.log('Carga de movimientos completada.');
      }
    });
  }
  
  paginaAnterior() {
    const paginaActual = this.paginador.number;
    if (paginaActual > 0) {
    }
  }
  
  paginaSiguiente() {
    const paginaActual = this.paginador.number;
    if (paginaActual < this.paginador.totalPages - 1) {
    }
  }
  
  cambiarPagina(page: number) {
    this.cargarMovimientos(page);
  }
  
  
  generarPaginador(totalPages: number) {
    this.pages = Array.from({ length: totalPages }, (_, i) => i); // Crea el array de páginas
  }

  limpiarFiltros() {
    this.localSeleccionado=0;
    this.tipoMovimientoSeleccionado='';
    this.nroFicha='';
    this.fechaSeleccionada='';
    this.metodoPagoSeleccionado='';
    this.cargarMovimientos(); // Vuelve a cargar todos los pacientes sin filtros
  }

  aplicarFiltros(page: number = 0): void {
    const filtros = {
      local: this.localSeleccionado,
      tipoMovimiento: this.tipoMovimientoSeleccionado,
      nroFicha: this.nroFicha,
      fecha: this.fechaSeleccionada,
      metodoPago: this.metodoPagoSeleccionado
    };
  
    this.movimientoService.getMovimientosFiltrados(filtros, page).subscribe({
      next: (response) => {
        this.movimientos = response.content as Movimiento[];
        this.paginador = response;
        this.generarPaginador(response.totalPages); // Generar paginador
  
        // Calcular totales basados en los filtros aplicados
        this.movimientoService.getTotales(this.localSeleccionado).subscribe({
          next: (totales) => {
            this.totales = totales;
          },
          error: (error) => {
            console.error('Error al calcular los totales:', error);
            Swal.fire('Error', 'No se pudieron calcular los totales.', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error al aplicar filtros:', error);
        Swal.fire('Error', 'No se pudieron cargar los movimientos.', 'error');
      }
    });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
}
