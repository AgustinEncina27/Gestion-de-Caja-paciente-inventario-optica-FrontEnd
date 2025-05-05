import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Local } from 'src/app/models/local';
import { LocalService } from 'src/app/services/local.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { MetodoPago } from 'src/app/models/metodoPago';
import { ProductoService } from 'src/app/services/producto.service';
import { StockTotalSucursal } from 'src/app/dto/StockTotalSucursal';
import { PacienteService } from 'src/app/services/paciente.service';
import { PacientesPorSucursal } from 'src/app/dto/PacientesPorSucursal';
import { StockPorMaterial } from 'src/app/dto/StockPorMaterial';
import { ExcelService } from 'src/app/services/excel.service';

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
  cantidadTotalVendida: number = -1;
  isLoading = false; // Variable para la pantalla de carga

 constructor(private movimientoService: MovimientoService,
  private localService: LocalService,
  public authService: AuthService,
  private productoService: ProductoService,
  private pacienteService: PacienteService,
  private excelService: ExcelService,
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

    
    this.movimientoService.obtenerCantidadTotalVendida({
      local: this.localSeleccionado,
      fechaInicio: this.fechaSeleccionadaInicio,
      fechaFin: this.fechaSeleccionadaFin,
    }).subscribe(response => {
      this.cantidadTotalVendida = response.total; // debe venir así desde backend
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
    this.cantidadTotalVendida=-1;
  }

  descargarExcelProductosVendidos(): void {
    if(this.fechaSeleccionadaInicio==='' || this.fechaSeleccionadaFin ===''){
      Swal.fire('ADVERTENCIA', 'Ingresar fecha de inicio y fin por favor', 'warning');
      return 
    }

    const filtros = {
      local: this.localSeleccionado,
      fechaInicio: this.fechaSeleccionadaInicio,
      fechaFin: this.fechaSeleccionadaFin,
    };

    let nombreSucursal = 'todos los locales';

    if (this.localSeleccionado != 0) {
      const local = this.locales.find(l => l.id == this.localSeleccionado);
      nombreSucursal = local ? local.nombre.toLowerCase().replace(/\s+/g, '_') : 'sucursal';
    }

    this.isLoading = true; // Activar pantalla de carga
    
    this.excelService.descargarExcelVentas(filtros).subscribe({
      next: (response) => {

        this.isLoading = false; // Desactivar pantalla de carga
    
        const file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = `ventas_${nombreSucursal}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
      },
      error: (err) => {
        this.isLoading = false; // Asegurate de desactivarlo acá también
        console.error('Error al generar el Excel:', err);
        Swal.fire('ERROR', 'No se pudo generar el Excel', 'error');
      },
    });
  }

  descargarExcelMarcasVendidas(): void {
    if (this.fechaSeleccionadaInicio === '' || this.fechaSeleccionadaFin === '') {
      Swal.fire('ADVERTENCIA', 'Ingresar fecha de inicio y fin por favor', 'warning');
      return;
    }
  
    const filtros = {
      local: this.localSeleccionado,
      fechaInicio: this.fechaSeleccionadaInicio,
      fechaFin: this.fechaSeleccionadaFin,
    };
  
    this.isLoading = true;
  
    this.excelService.descargarExcelResumenMarcas(filtros).subscribe({
      next: (response) => {
        const fechaHoy = new Date();
        const dia = String(fechaHoy.getDate()).padStart(2, '0');
        const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
        const anio = fechaHoy.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${anio}`;
  
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `resumen_marcas_vendidas_${fechaFormateada}.xlsx`;
        link.click();
  
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al generar el Excel:', err);
        Swal.fire('ERROR', 'No se pudo generar el Excel', 'error');
      },
    });
  }
  
}
