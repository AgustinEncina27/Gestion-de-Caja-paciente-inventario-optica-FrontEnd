import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { MovimientoService } from 'src/app/services/movimiento.service';

import { MovimientoDTO, Page } from 'src/app/dto/movimiento.dto';

// DTOs mínimos que usa la UI
interface LocalDTO { id: number; nombre: string; }
interface MetodoPagoDTO { id: number; nombre: string; }

@Component({
  selector: 'app-listar-movimiento',
  templateUrl: './listar-movimiento.component.html',
  styleUrls: ['./listar-movimiento.component.css'],
})
export class ListarMovimientoComponent implements OnInit {

  // Listado + paginación
  movimientos: MovimientoDTO[] = [];
  paginador: Page<MovimientoDTO> | null = null;
  pages: number[] = [];

  // Totales por método (desde /api/movimientos/totales)
  totalesPorMetodo: { [metodo: string]: number } = {};
  mostrarTotales = false;

  // Filtros
  locales: LocalDTO[] = [];
  localSeleccionado: number = 0;        // solo ADMIN usa este filtro
  metodosPago: MetodoPagoDTO[] = [];
  tipoMovimientoSeleccionado: '' | 'ENTRADA' | 'SALIDA' = '';
  nombrePaciente = '';
  fechaSeleccionada = '';               // yyyy-MM-dd
  metodoPagoSeleccionado = '';

  constructor(
    private movimientoService: MovimientoService,
    private localService: LocalService,
    private metodoPagoService: MetodoPagoService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarLocales();
    this.cargarMetodosPago();
    this.cargarFiltroDesdeRuta();
    this.aplicarFiltros();
  }

  // ====== Cargas iniciales ======
  private cargarLocales(): void {
    this.localService.getLocales().subscribe((data: any[]) => {
      this.locales = (data || []).map(l => ({ id: l.id, nombre: l.nombre })) as LocalDTO[];
    });
  }

  private cargarMetodosPago(): void {
    this.metodoPagoService.getmetodosPagos().subscribe((data: any[]) => {
      this.metodosPago = (data || []).map(m => ({ id: m.id, nombre: m.nombre })) as MetodoPagoDTO[];
    });
  }

  private cargarFiltroDesdeRuta(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const pacienteFicha = params.get('pacienteFicha');
      const rutaActual = this.router.url;
      if (rutaActual.includes('adminitrarCajaPaciente') && pacienteFicha) {
        // el filtro del backend es por nombrePaciente (string)
        this.nombrePaciente = pacienteFicha;
      }
    });
  }

  // ====== Acciones ======
  eliminarMovimiento(m: MovimientoDTO): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No puedes revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (!result.isConfirmed) return;
      this.movimientoService.eliminar(m.id).subscribe({
        next: () => {
          Swal.fire('MOVIMIENTO ELIMINADO', 'El movimiento ha sido eliminado con éxito', 'success');
          this.aplicarFiltros(this.paginador?.number ?? 0);
        },
        error: () => {},
      });
    });
  }

  // ====== Paginación ======
  paginaAnterior(): void {
    if (!this.paginador) return;
    const prev = this.paginador.number - 1;
    if (prev >= 0) this.cambiarPagina(prev);
  }

  paginaSiguiente(): void {
    if (!this.paginador) return;
    const next = this.paginador.number + 1;
    if (next < this.paginador.totalPages) this.cambiarPagina(next);
  }

  cambiarPagina(page: number): void {
    if (!this.paginador) return;
    if (page < 0 || page >= this.paginador.totalPages) return;
    this.aplicarFiltros(page);
  }

  private generarPaginador(totalPages: number): void {
    if (!this.paginador) { this.pages = []; return; }
    const max = 5;
    const current = this.paginador.number;
    let start = Math.max(0, current - Math.floor(max / 2));
    let end = Math.min(totalPages - 1, start + max - 1);
    if (end - start < max - 1) start = Math.max(0, end - max + 1);
    this.pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // ====== Filtros ======
  limpiarFiltros(): void {
    this.localSeleccionado = 0;
    this.tipoMovimientoSeleccionado = '';
    this.nombrePaciente = '';
    this.fechaSeleccionada = '';
    this.metodoPagoSeleccionado = '';
    this.aplicarFiltros(0);
  }

  aplicarFiltros(page: number = 0): void {
    // armamos filtros para el endpoint /filtrar
    const filtros: any = {
      // Sólo ADMIN puede pasar idLocal; para vendedor se omite y el back usa el tenant
      ...(this.authService.hasRole('ROLE_ADMIN') && this.localSeleccionado
        ? { local: this.localSeleccionado }
        : {}),
      ...(this.tipoMovimientoSeleccionado ? { tipoMovimiento: this.tipoMovimientoSeleccionado } : {}),
      ...(this.nombrePaciente ? { nombrePaciente: this.nombrePaciente } : {}),
      ...(this.fechaSeleccionada ? { fecha: this.fechaSeleccionada } : {}),
      ...(this.metodoPagoSeleccionado ? { metodoPago: this.metodoPagoSeleccionado } : {}),
    };

    this.movimientoService.filtrar(filtros, page, 10).subscribe({
      next: (resp) => {
        this.movimientos = resp.content || [];
        this.paginador = resp;
        this.generarPaginador(resp.totalPages);
      },
      error: () => {
        Swal.fire('ERROR', 'No se pudieron cargar los movimientos.', 'error');
      },
    });

    // Totales por método (no filtra por fecha; el back calcula por local/tenant)
    const idLocal = this.authService.hasRole('ROLE_ADMIN') && this.localSeleccionado ? this.localSeleccionado : undefined;
    this.movimientoService.totalesPorMetodoPago(idLocal).subscribe({
      next: (t) => (this.totalesPorMetodo = t || {}),
      error: () => (this.totalesPorMetodo = {}),
    });
  }

  // ====== Helpers UI ======
  getKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  esPagoTotal(mov: MovimientoDTO): boolean {
    const totalPagado = (mov.pagos || []).reduce((s, p) => s + (p.monto || 0), 0);
    return totalPagado >= (mov.total || 0);
  }

  esMismaFechaHoraMinuto(a: string | Date, b: string | Date): boolean {
    const f1 = new Date(a);
    const f2 = new Date(b);
    return (
      f1.getFullYear() === f2.getFullYear() &&
      f1.getMonth() === f2.getMonth() &&
      f1.getDate() === f2.getDate() &&
      f1.getHours() === f2.getHours() &&
      f1.getMinutes() === f2.getMinutes()
    );
  }

  copiarEnlace(id: number): void {
    const enlace = `${location.origin}/estadoCompra/${id}`;
    navigator.clipboard.writeText(enlace).then(
      () =>
        Swal.fire({
          icon: 'success',
          title: 'Enlace copiado',
          text: 'El enlace fue copiado al portapapeles.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }),
      (err) => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo copiar el enlace.' });
        console.error(err);
      }
    );
  }
}
