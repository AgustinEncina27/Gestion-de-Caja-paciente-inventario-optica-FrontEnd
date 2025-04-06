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
import { ProductoService } from 'src/app/services/producto.service';
import { StockTotalSucursal } from 'src/app/dto/StockTotalSucursal';
import { PacienteService } from 'src/app/services/paciente.service';
import { PacientesPorSucursal } from 'src/app/dto/PacientesPorSucursal';
import { StockPorMaterial } from 'src/app/dto/StockPorMaterial';

@Component({
  selector: 'app-pagina-estadistica',
  templateUrl: './pagina-estadistica.component.html',
  styleUrls: ['./pagina-estadistica.component.css']
})
export class PaginaEstaditicaComponent {
  totales: { [metodo: string]: { entrada: number; salida: number } } = {};
  mostrarTotales: boolean = false;
  locales: Local[] = [];  // Lista de locales obtenida desde el servicio
  localSeleccionado: number = 0; // Almacena el ID del local seleccionado
  metodosPago: MetodoPago[] = [];
  fechaSeleccionadaInicio: string = '';
  fechaSeleccionadaFin: string = '';
  stockPorSucursal: StockTotalSucursal[] = [];
  pacientesPorSucursal: PacientesPorSucursal[] = [];
  sucursalDatos: { localNombre: string; stockTotal: number; cantidadPacientes: number }[] = [];
  stockPorMaterial: StockPorMaterial[] = [];


 constructor(private movimientoService: MovimientoService,
  private localService: LocalService,
  public authService: AuthService,
  private productoService: ProductoService,
  private pacienteService: PacienteService,
  ){
  }

  ngOnInit(): void{
    this.cargarLocales();
    this.cargarDatos();
  }


  cargarDatos(): void {
    this.productoService.obtenerStockTotalPorSucursal().subscribe(stockResponse => {
      this.stockPorSucursal = stockResponse;
      this.pacienteService.obtenerCantidadPacientesPorSucursal().subscribe(pacientesResponse => {
        this.pacientesPorSucursal = pacientesResponse;

        // Unir los datos en una misma lista usando el nombre de la sucursal como clave
        this.sucursalDatos = this.stockPorSucursal.map(stock => {
          const pacientes = this.pacientesPorSucursal.find(p => p.localNombre === stock.localNombre);
          return {
            localNombre: stock.localNombre,
            stockTotal: stock.stockTotal,
            cantidadPacientes: pacientes ? pacientes.cantidadPacientes : 0 // Si no hay pacientes, pone 0
          };
        });
      });
    });
  }


  cargarLocales(){
    this.localService.getLocales().subscribe(data => {
      this.locales = data; // Almacena los locales en el array
    });
    
  }

  aplicarFiltros(): void {
    if(this.fechaSeleccionadaInicio==='' || this.fechaSeleccionadaFin ===''){
      Swal.fire('ADVERTENCIA', 'Ingresar fecha de inicio y fin por favor', 'warning');
      return 
    }

    const filtros = {
      local: this.localSeleccionado,
      fechaInicio: this.fechaSeleccionadaInicio || null,
      fechaFin: this.fechaSeleccionadaFin || null,
    };
  
    // Obtener total de ganancias con desglose por método de pago
    this.movimientoService.obtenerTotalGanado(filtros).subscribe({
      next: (totales) => {
        this.totales = totales;
      },
      error: (error) => {
        console.error('Error al calcular los totales:', error);
        Swal.fire('ERROR', 'No se pudieron calcular los totales.', 'error');
      }
    });

    if(this.localSeleccionado != null){
      this.productoService.obtenerStockPorMaterialYSucursal(this.localSeleccionado).subscribe(response => {
        this.stockPorMaterial = response;
      });
    }
     
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getNeto(metodo: string): number {
    const data = this.totales[metodo];
    if (!data) return 0;
    return (data.entrada || 0) - (data.salida || 0);
  }
  
  limpiarFiltros() {
    this.localSeleccionado=0;
    this.fechaSeleccionadaInicio='';
    this.fechaSeleccionadaFin='';
    this.totales= {};
    this.stockPorMaterial=[];
  }
}
