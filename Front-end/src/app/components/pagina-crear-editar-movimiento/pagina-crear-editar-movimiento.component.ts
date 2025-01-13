import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movimiento } from 'src/app/models/movimiento';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Paciente } from 'src/app/models/paciente';
import { Producto } from 'src/app/models/producto';
import { Local } from 'src/app/models/local';
import { MetodoPago } from 'src/app/models/metodoPago';
import { DetalleMovimiento } from 'src/app/models/detalleMovimiento';
import { PacienteService } from 'src/app/services/paciente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { LocalService } from 'src/app/services/local.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-crear-editar-movimiento',
  templateUrl: './pagina-crear-editar-movimiento.component.html',
  styleUrls: ['./pagina-crear-editar-movimiento.component.css']
})
export class PaginaCrearEditarMovimientoComponent implements OnInit {
  movimiento: Movimiento = new Movimiento();
  locales: Local[] = [];
  metodosPago: MetodoPago[] = [];
  detalles: DetalleMovimiento[] = [];
  titulo: string = 'Crear Movimiento';
  pacienteEncontrado: Paciente | null = null;
  productoEncontrado: Producto | null = null;
  fichaPaciente: string = ''; // Número de ficha para buscar al paciente
  codigoProducto: string = ''; // Código o criterio para buscar el producto

  constructor(
    private movimientoService: MovimientoService,
    private pacienteService: PacienteService,
    private productoService: ProductoService,
    private localService: LocalService,
    private metodoPagoService: MetodoPagoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMovimiento();
    this.cargarLocales();
    this.cargarMetodosPago();
  }

  cargarLocales(): void {
    this.localService.getLocales().subscribe((data) => (this.locales = data));
  }

  cargarMetodosPago(): void {
    this.metodoPagoService.getmetodosPagos().subscribe((data) => (this.metodosPago = data));
  }

  cargarMovimiento(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      if (id) {
        this.titulo = 'Editar Movimiento';
        this.movimientoService.getMovimiento(id).subscribe((data) => {
          this.movimiento = data;
          this.detalles = data.detalles || [];
        });
      }
    });
  }

  buscarPaciente(): void {
    if (this.fichaPaciente) {
      this.pacienteService.getPacientePorFicha(this.fichaPaciente).subscribe({
        next: (paciente) => {
          this.pacienteEncontrado = paciente;
          this.movimiento.paciente = paciente;
        },
        error: () => Swal.fire('Error', 'Paciente no encontrado', 'error')
      });
    }
  }

  buscarProducto(): void {
    if (this.codigoProducto) {
      this.productoService.getProductoPorModelo(this.codigoProducto).subscribe({
        next: (producto) => {
          // Buscar el stock del producto en el local específico
          const productoLocal = producto.productoLocales.find(
            (pl: any) => pl.local.id === this.movimiento.local.id
          );

          if(productoLocal && productoLocal.stock <= 0){
            Swal.fire('Error', 'Producto no posee stock suficiente', 'error')
            this.codigoProducto = ''; // Resetear el campo de búsqueda
          }else{
            this.productoEncontrado = producto;
          }
        },
        error: () => Swal.fire('Error', 'Producto no encontrado', 'error')
      });
    }
  }

  agregarDetalle(): void {
    if (this.productoEncontrado) {
      const nuevoDetalle: DetalleMovimiento = new DetalleMovimiento();
      nuevoDetalle.producto = this.productoEncontrado;
      nuevoDetalle.cantidad = 1; // Cantidad por defecto
      nuevoDetalle.precioUnitario = this.productoEncontrado.precio;
      nuevoDetalle.subtotal = nuevoDetalle.cantidad * nuevoDetalle.precioUnitario;
      this.detalles.push(nuevoDetalle);
      this.productoEncontrado = null; // Limpiar producto encontrado
      this.codigoProducto = ''; // Resetear el campo de búsqueda
      this.calcularTotal();
    } else {
      Swal.fire('Error', 'Debe buscar y seleccionar un producto antes de agregarlo', 'error');
    }
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
    this.calcularTotal();
  }

  guardarMovimiento(): void {
    this.movimiento.detalles = this.detalles;

    if (this.movimiento.id) {
      this.movimientoService.updateMovimiento(this.movimiento).subscribe({
        next: () => {
          Swal.fire('Movimiento Actualizado', 'El movimiento ha sido actualizado con éxito', 'success');
          this.router.navigate(['/movimientos']);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el movimiento', 'error')
      });
    } else {
      this.movimientoService.createMovimiento(this.movimiento).subscribe({
        next: () => {
          Swal.fire('Movimiento Creado', 'El movimiento ha sido creado con éxito', 'success');
          this.router.navigate(['/movimientos']);
        },
        error: () => Swal.fire('Error', 'No se pudo crear el movimiento', 'error')
      });
    }
  }

  verificarCantidad(detalle: DetalleMovimiento): void {
    if (detalle.cantidad < 0) {
      detalle.cantidad = 0; // Restablece a 0 si el valor es negativo
      Swal.fire('Advertencia', 'La cantidad no puede ser negativa.', 'warning');
    }
    this.calcularSubtotal(detalle); // Calcula nuevamente el subtotal
  }

  calcularSubtotal(detalle: DetalleMovimiento): void {
    detalle.subtotal=detalle.cantidad * detalle.precioUnitario;
    this.calcularTotal(); // Llama al cálculo del total
  }

  // Método para calcular el total general
  calcularTotal(): void {
    this.movimiento.total = this.detalles.reduce((acc, detalle) => acc + detalle.subtotal, 0);
    this.movimiento.totalImpuesto = this.movimiento.total - (this.movimiento.total * this.movimiento.metodoPago.impuesto/100)
  }
}
