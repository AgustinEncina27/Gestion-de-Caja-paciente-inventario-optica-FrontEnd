import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { URL_FRONTEND } from 'src/app/config/config';
import { Local } from 'src/app/models/local';
import { LocalService } from 'src/app/services/local.service';
import { Movimiento } from 'src/app/models/movimiento';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { MetodoPago } from 'src/app/models/metodoPago';
import { ActivatedRoute, Router } from '@angular/router';
import { CajaMovimiento } from 'src/app/models/cajaMovimiento';

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
  URL_FRONTEND: string=URL_FRONTEND;
  totales: { [key: string]: number } = {};
  mostrarTotales: boolean = false;
  locales: Local[] = [];  // Lista de locales obtenida desde el servicio
  localSeleccionado: number = 0; // Almacena el ID del local seleccionado
  metodosPago: MetodoPago[] = [];
  tipoMovimientoSeleccionado: string = '';
  nombrePaciente: string = '';
  fechaSeleccionada: string = '';
  metodoPagoSeleccionado: string = '';

 constructor(private movimientoService: MovimientoService,
  private localService: LocalService,
  public authService: AuthService,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private metodoPagoService: MetodoPagoService,
  ){
  }

  ngOnInit(): void{
    this.cargarLocales();
    this.cargarFiltroConFicha();
    this.cargarMetodosPago();
    this.aplicarFiltros();
  }

  cargarLocales(){
    this.localService.getLocales().subscribe(data => {
      this.locales = data; // Almacena los locales en el array
    });
  }

  cargarFiltroConFicha() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const pacienteFicha = params.get('pacienteFicha'); // No conviertas a número aún
      const rutaActual = this.router.url; // Obtiene la ruta actual
    
      if (rutaActual.includes("adminitrarCajaPaciente")) {
        if (pacienteFicha) {
          this.nombrePaciente = pacienteFicha.toString();
        } 
      }
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
              'MOVIMIENTO ELIMINADO','El movimiento ha sido eliminado con éxito!','success'
            )
            this.aplicarFiltros();
          }
        )
        
      }
    })
  }
  
  paginaAnterior() {
    const paginaActual = this.paginador.number;
    if (paginaActual > 0) {
      this.cambiarPagina(paginaActual - 1);
    }
  }
  
  paginaSiguiente() {
    const paginaActual = this.paginador.number;
    if (paginaActual < this.paginador.totalPages - 1) {
      this.cambiarPagina(paginaActual + 1);
    }
  }
  
  cambiarPagina(page: number) {
    if (page >= 0 && page < this.paginador.totalPages) {
      this.aplicarFiltros(page);
    }
  }
  
  
  generarPaginador(totalPages: number) {
    const maxPagesToShow = 5; // Número máximo de páginas visibles
    const currentPage = this.paginador.number; // Página actual
  
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
  
    // Ajuste si la página inicial está muy cerca del inicio
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
  
    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  

  limpiarFiltros() {
    this.localSeleccionado=0;
    this.tipoMovimientoSeleccionado='';
    this.nombrePaciente='';
    this.fechaSeleccionada='';
    this.metodoPagoSeleccionado='';
    this.aplicarFiltros(); // Vuelve a cargar todos los pacientes sin filtros
  }

  aplicarFiltros(page: number = 0): void {
    const filtros = {
      local: this.localSeleccionado,
      tipoMovimiento: this.tipoMovimientoSeleccionado,
      nombrePaciente: this.nombrePaciente,
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
            Swal.fire('ERROR', 'No se pudieron calcular los totales.', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error al aplicar filtros:', error);
        Swal.fire('ERROR', 'No se pudieron cargar los movimientos.', 'error');
      }
    });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
  generarPdfCliente(idMovimiento: number): void {
    this.movimientoService.generarReporteMovimientoCliente(idMovimiento).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
  
        // Crear un enlace temporal para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_movimiento_cliente_${idMovimiento}.pdf`;
        a.click();
  
        // Liberar memoria
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al generar el PDF:', error);
        Swal.fire('ERROR', 'No se pudo generar el PDF.', 'error');
      },
    });
  }

  generarPdfOptica(idMovimiento: number): void {
    this.movimientoService.generarReporteMovimientoOptica(idMovimiento).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
  
        // Crear un enlace temporal para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_movimiento_optica_${idMovimiento}.pdf`;
        a.click();
  
        // Liberar memoria
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al generar el PDF:', error);
        Swal.fire('ERROR', 'No se pudo generar el PDF.', 'error');
      },
    });
  }

  esPagoTotal(movimiento: any): boolean {
    if (!movimiento.cajaMovimientos || movimiento.cajaMovimientos.length === 0) {
      return false;
    }
  
    const totalPagado = movimiento.cajaMovimientos.reduce((sum: number, caja: any) => sum + caja.monto, 0);
    return totalPagado >= movimiento.total;
  }



  copiarEnlace(id: number): void {
    const enlace = `${this.URL_FRONTEND}/estadoCompra/${id}`;
    navigator.clipboard.writeText(enlace).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Enlace copiado',
        text: 'El enlace fue copiado al portapapeles.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el enlace.',
      });
      console.error('Error al copiar el enlace:', err);
    });
  }

  esMismaFechaHoraMinuto(fecha1: string | Date, fecha2: string | Date): boolean {
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);
  
    return (
      f1.getFullYear() === f2.getFullYear() &&
      f1.getMonth() === f2.getMonth() &&
      f1.getDate() === f2.getDate() &&
      f1.getHours() === f2.getHours() &&
      f1.getMinutes() === f2.getMinutes()
    );
  }

  formatearMetodo(tipo: string): string {
    return tipo.replace('_', ' ').toUpperCase();
  }

  mostrarMetodoPago(cajaMovimiento: CajaMovimiento): string {
    const tipo = cajaMovimiento.metodoPago?.tipo;
    let texto = tipo?.replace('_', ' ') ?? '';
  
    if (tipo === 'TARJETA_CREDITO' || tipo === 'TARJETA_DEBITO') {
      const detalle = cajaMovimiento.tarjetaDetalle; // 🔁 ahora está directamente en CajaMovimiento
      if (detalle?.tipoTarjeta) {
        texto += ' - ' + detalle.tipoTarjeta.nombre;
  
        if (detalle.tipoTarjeta.nombre === 'OTRA' && detalle.nombreOtro) {
          texto += ` (${detalle.nombreOtro})`;
        }
      }
    }
  
    return texto;
  }
  
}
