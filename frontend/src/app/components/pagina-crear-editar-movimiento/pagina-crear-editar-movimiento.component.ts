import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { LocalService } from 'src/app/services/local.service';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import { MovimientoService } from 'src/app/services/movimiento.service';

import {
  TipoMovimiento,
  EstadoMovimiento,
  MovimientoDTO,
  MovimientoUpsertDTO,
  DetalleMovimientoUpsertDTO,
  DetalleAdicionalUpsertDTO,
  CajaMovimientoUpsertDTO,
} from 'src/app/dto/movimiento.dto';

import { PacienteDTO } from 'src/app/dto/PacienteDTO';
import { ProductoDTO } from 'src/app/dto/ProductoDTO';
import { IdNameDTO } from 'src/app/dto/IdNameDTO';

// DTOs mínimos para Local y Método de Pago usados en la UI
interface LocalDTO { id: number; nombre: string; }
interface MetodoPagoDTO { id: number; nombre: string; }

declare const bootstrap: any;

/** ====== Estructuras UI ====== */
type DetalleUI = {
  productoId: number;
  productoModelo: string;
  marcaNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  categorias?: IdNameDTO[];
};

type PagoUI = {
  metodoPagoId: number;
  metodoPagoNombre?: string;
  monto: number;
  montoImpuesto: number;
  fecha: string;            // ISO (datetime-local)
  descripcionOtras?: string | null;
  // tarjeta?: { cuotas?: number | null; ultimos4?: string | null; autorizacion?: string | null; } | null;
};

@Component({
  selector: 'app-pagina-crear-editar-movimiento',
  templateUrl: './pagina-crear-editar-movimiento.component.html',
  styleUrls: ['./pagina-crear-editar-movimiento.component.css'],
})
export class PaginaCrearEditarMovimientoComponent implements OnInit {

  /** ====== Estado principal (solo UI) ====== */
  titulo = 'Crear Movimiento';
  movimientoId: number | null = null;

  // Campos del movimiento (UI)
  tipoMovimiento: TipoMovimiento = 'ENTRADA';
  fecha: string = this.obtenerFechaHoyConHora();
  total = 0;
  descuento: number | null = null;
  totalImpuesto = 0;
  descripcion: string | null = '';
  vendedor: string | null = '';
  estadoMovimiento: EstadoMovimiento | null = 'PEDIDO_CRISTALES';

  // Paciente
  pacienteEncontrado: PacienteDTO | null = null;
  fichaPaciente = 0;

  // Local (solo UI)
  locales: LocalDTO[] = [];
  localSeleccionado: LocalDTO | null = null;

  // Métodos de pago
  metodosPago: MetodoPagoDTO[] = [];
  metodoSalidaSeleccionado: MetodoPagoDTO | null = null;

  // Productos / Detalles
  codigoProducto = '';
  productosEncontrados: ProductoDTO[] = [];
  detalles: DetalleUI[] = [];

  // Detalles adicionales (UI simple)
  detallesAdicionales: { descripcion: string; subtotal: number }[] = [];

  // Pagos (UI)
  pagos: PagoUI[] = [];

  // Aux UI
  isLoading = false;
  deuda = 0;

  constructor(
    private movimientoService: MovimientoService,
    private pacienteService: PacienteService,
    private productoService: ProductoService,
    private localService: LocalService,
    private metodoPagoService: MetodoPagoService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  // ========= Ciclo de vida =========
  ngOnInit(): void {
    this.cargarLocales();
    this.cargarMetodosPago();
    this.leerParametrosRuta();
  }

  // ========= Cargas iniciales =========
  private cargarLocales(): void {
    this.localService.getLocales().subscribe((data: any[]) => {
      this.locales = (data || []).map(l => ({ id: l.id, nombre: l.nombre })) as LocalDTO[];

      if (!this.authService.hasRole('ROLE_ADMIN')) {
        const localId = this.authService.getLocalId?.();
        const found = this.locales.find(x => x.id === localId);
        if (found) this.localSeleccionado = found;
      }
    });
  }

  private cargarMetodosPago(): void {
    this.metodoPagoService.getmetodosPagos().subscribe((data: any[]) => {
      this.metodosPago = (data || []).map(m => ({ id: m.id, nombre: m.nombre })) as MetodoPagoDTO[];
      if (!this.metodoSalidaSeleccionado && this.metodosPago.length > 0) {
        this.metodoSalidaSeleccionado = this.metodosPago[0];
      }
    });
  }

  private leerParametrosRuta(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const movId = Number(params.get('id'));
      const pacId = Number(params.get('pacienteId'));

      if (movId) this.cargarMovimiento(movId);
      if (pacId) this.cargarPaciente(pacId);
    });
  }

  // ========= Utilidades de fecha =========
  private obtenerFechaHoyConHora(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${hh}:${mm}`;
  }

  // ========= Paciente =========
  private cargarPaciente(pacienteId: number): void {
    this.pacienteService.getPaciente(pacienteId).subscribe({
      next: (pac) => {
        this.pacienteEncontrado = pac;
        this.tipoMovimiento = 'ENTRADA';
        this.fichaPaciente = pac.ficha;
        this.estadoMovimiento = 'PEDIDO_CRISTALES';
      },
      error: () => Swal.fire('ERROR', 'Paciente no encontrado', 'error'),
    });
  }

  buscarPacientePorFicha(): void {
    if (!this.fichaPaciente) return;
    this.pacienteService.getPacientePorFicha(this.fichaPaciente).subscribe({
      next: (pac) => (this.pacienteEncontrado = pac),
      error: () => Swal.fire('ERROR', 'Paciente no encontrado', 'error'),
    });
  }

  // ========= Movimiento (edición) =========
  private cargarMovimiento(id: number): void {
    this.titulo = 'Editar Movimiento';
    this.movimientoId = id;

    this.movimientoService.obtener(id).subscribe((dto: MovimientoDTO) => {
      // Campos simples
      this.tipoMovimiento   = dto.tipoMovimiento;
      this.fecha            = dto.fecha;
      this.total            = dto.total;
      this.descuento        = dto.descuento ?? null;
      this.totalImpuesto    = dto.totalImpuesto;
      this.descripcion      = dto.descripcion ?? '';
      this.vendedor         = dto.vendedor ?? '';
      this.estadoMovimiento = dto.estadoMovimiento ?? null;

      // Paciente (si viene informativo)
      this.pacienteEncontrado = dto.pacienteId
        ? { id: dto.pacienteId, ficha: 0, nombreCompleto: dto.pacienteNombre || '', direccion: '', obraSocial: '', observaciones: '', celular: '', genero: '', documento: '', cuit: '', condicionIva: undefined as any, tipoDocumento: undefined as any, correo: '', medico: '', creadoEn: '', ultimaActualizacion: '', localId: 0, localNombre: '' }
        : null;

      // Detalles -> DetalleUI
      this.detalles = (dto.detalles || []).map(d => ({
        productoId: d.productoId,
        productoModelo: d.productoModelo || `#${d.productoId}`,
        marcaNombre: d.marcaNombre,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal,
      }));

      // Detalles adicionales (simples)
      this.detallesAdicionales = (dto.detallesAdicionales || []).map(d => ({
        descripcion: d.descripcion,
        subtotal: d.subtotal,
      }));

      // Pagos -> PagoUI
      this.pagos = (dto.pagos || []).map(p => ({
        metodoPagoId: p.metodoPagoId,
        metodoPagoNombre: p.metodoPago,
        monto: p.monto,
        montoImpuesto: p.montoImpuesto,
        fecha: p.fecha,
        descripcionOtras: p.descripcionOtras ?? null,
      }));

      // Local (solo UI)
      if (dto.localId && this.locales?.length) {
        const found = this.locales.find(l => l.id === dto.localId);
        if (found) this.localSeleccionado = found;
      }

      this.calcularDeuda();
    });
  }

  // ========= Productos / Detalles =========
  abrirBuscadorProductos(): void {
    if (!this.codigoProducto.trim()) return;

    this.productoService.getProductosPorModeloEnMiLocal(this.codigoProducto).subscribe({
      next: (productos: ProductoDTO[]) => {
        this.productosEncontrados = productos || [];
        const modal = new bootstrap.Modal(document.getElementById('modalProductos')!);
        modal.show();
      },
      error: () => Swal.fire('ERROR', 'Error al buscar productos', 'error'),
    });
  }

  getStockEnLocal(p: ProductoDTO): number {
    // el back ya devuelve stock del tenant/local
    return p.stock;
  }

  seleccionarProducto(p: ProductoDTO): void {
    if (p.stock <= 0) {
      Swal.fire('ADVERTENCIA', 'Este producto no tiene stock en esta sucursal', 'warning');
      return;
    }

    const fila: DetalleUI = {
      productoId: p.id,
      productoModelo: p.modelo,
      marcaNombre: p.marcaNombre,
      cantidad: 1,
      precioUnitario: p.precio,
      subtotal: p.precio,
      categorias: p.categorias,
    };
    this.detalles.push(fila);

    this.codigoProducto = '';
    this.calcularTotalAdicional();

    const modalEl = document.getElementById('modalProductos');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  verificarCantidad(det: DetalleUI): void {
    if (det.cantidad < 0) {
      det.cantidad = 0;
      Swal.fire('ADVERTENCIA', 'La cantidad no puede ser negativa.', 'warning');
    }
    this.calcularSubtotal(det);
  }

  calcularSubtotal(det: DetalleUI): void {
    det.subtotal = det.cantidad * det.precioUnitario;
    this.calcularTotalAdicional();
  }

  eliminarDetalle(i: number): void {
    this.detalles.splice(i, 1);
    this.calcularTotalAdicional();
    this.advertenciaMonto();
  }

  // ========= Detalles adicionales =========
  agregarDetalleAdicional(): void {
    this.detallesAdicionales.push({ descripcion: '', subtotal: 0 });
  }

  eliminarDetalleAdicional(i: number): void {
    this.detallesAdicionales.splice(i, 1);
    this.calcularTotalAdicional();
    this.calcularMontoImpuestoYAdviertenciaTotal();
    this.advertenciaMonto();
    this.calcularDeuda();
  }

  // ========= Pagos =========
  agregarPago(): void {
    const metodo = this.metodosPago[0];
    this.pagos.push({
      metodoPagoId: metodo?.id,
      metodoPagoNombre: metodo?.nombre,
      monto: 0,
      montoImpuesto: 0,
      fecha: this.obtenerFechaHoyConHora(),
      descripcionOtras: null,
    });
  }

  eliminarPago(i: number): void {
    this.pagos.splice(i, 1);
    this.calcularMontoImpuestoYAdviertenciaTotal();
    this.calcularDeuda();
  }

  calcularTotalYAdviertenciaTotal(totalInput: number, idx: number): void {
    this.pagos[idx].montoImpuesto = totalInput;
    this.calcularMontoImpuestoYAdviertenciaTotal();
    if (this.advertenciaMonto()) return;
  }

  calcularMontoImpuestoYAdviertenciaTotal(): void {
    const sumaImp = this.pagos.reduce((s, p) => s + (p.montoImpuesto || 0), 0);
    this.totalImpuesto = sumaImp;
    this.calcularDeuda();
    if (this.advertenciaMonto()) return;
  }

  advertenciaMonto(): boolean {
    let adv = false;
    const sumaImp = this.pagos.reduce((s, p) => s + (p.montoImpuesto || 0), 0);
    const sumaMonto = this.pagos.reduce((s, p) => s + (p.monto || 0), 0);

    if (sumaImp > this.total || sumaMonto > this.total) {
      Swal.fire('ADVERTENCIA', 'La suma de los pagos no puede exceder el total del movimiento.', 'warning');
      adv = true;
    }
    return adv;
  }

  duplicarTotalImpuesto(total: number): void {
    if (this.tipoMovimiento === 'SALIDA') {
      this.totalImpuesto = total || 0;
      if (this.pagos.length) {
        this.pagos[0].montoImpuesto = this.totalImpuesto;
      }
    }
  }

  calcularDeuda(): void {
    const pagado = this.pagos.reduce((s, p) => s + (p.monto || 0), 0);
    this.deuda = Math.max(0, (this.total || 0) - pagado);
  }

  // ========= Totales / Descuento =========
  calcularTotalAdicional(): void {
    const tDetalles = this.detalles.reduce((s, d) => s + (d.subtotal || 0), 0);
    const tAdic    = this.detallesAdicionales.reduce((s, d) => s + (d.subtotal || 0), 0);
    this.total = tDetalles + tAdic;
    this.calcularDeuda();
  }

  aplicarDescuento(desc?: number | null): void {
    const d = desc ?? 0;
  
    if (d < 0 || d > 100) {
      Swal.fire('ADVERTENCIA', 'El descuento debe estar entre 0% y 100%', 'warning');
      this.descuento = 0;
      return;
    }
    if (!this.total) {
      Swal.fire('ADVERTENCIA', 'No se puede aplicar descuento con total en 0', 'warning');
      return;
    }
  
    // recalculá el total antes si corresponde
    this.calcularTotalAdicional();
  
    this.total = this.total - (this.total * (d / 100));
    this.descuento = d;
    this.calcularDeuda();
  }

  // ========= Cambios de tipo/local (UI) =========
  onCambiarTipoMovimiento(nuevo: TipoMovimiento): void {
    this.tipoMovimiento = nuevo;

    if (nuevo === 'ENTRADA') {
      this.estadoMovimiento = 'PEDIDO_CRISTALES';
    } else {
      this.estadoMovimiento = null;
      this.pacienteEncontrado = null;
      this.fichaPaciente = 0;
    }

    // reset UI
    this.total = 0;
    this.totalImpuesto = 0;
    this.descripcion = '';
    this.vendedor = '';
    this.detalles = [];
    this.detallesAdicionales = [];
    this.pagos = [];
    this.deuda = 0;
  }

  onCambiarLocal(local: LocalDTO): void {
    this.localSeleccionado = local;

    // reset (solo UI)
    const tipo = this.tipoMovimiento;
    const pac = this.pacienteEncontrado;

    this.fecha = this.obtenerFechaHoyConHora();
    this.total = 0;
    this.totalImpuesto = 0;
    this.descripcion = '';
    this.vendedor = '';
    this.detalles = [];
    this.detallesAdicionales = [];
    this.pagos = [];
    this.deuda = 0;

    this.tipoMovimiento = tipo;
    this.pacienteEncontrado = pac;

    if (tipo === 'ENTRADA') this.estadoMovimiento = 'PEDIDO_CRISTALES';
  }

  // ========= Guardar =========
  private buildUpsertDTO(): MovimientoUpsertDTO {
    const detallesDTO: DetalleMovimientoUpsertDTO[] = this.detalles.map(d => ({
      productoId: d.productoId,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.subtotal,
    }));

    const adicDTO: DetalleAdicionalUpsertDTO[] = this.detallesAdicionales.map(d => ({
      descripcion: d.descripcion,
      subtotal: d.subtotal,
    }));

    const pagosDTO: CajaMovimientoUpsertDTO[] = this.pagos.map(p => ({
      metodoPagoId: p.metodoPagoId,
      monto: p.monto,
      montoImpuesto: p.montoImpuesto,
      fecha: p.fecha,
      descripcionOtras: p.descripcionOtras ?? null,
      // tarjeta: p.tarjeta ?? null,
    }));

    const dto: MovimientoUpsertDTO = {
      tipoMovimiento: this.tipoMovimiento,
      fecha: this.fecha,
      total: this.total ?? null,
      descuento: this.descuento ?? null,
      totalImpuesto: this.totalImpuesto ?? null,
      descripcion: this.descripcion ?? null,
      vendedor: this.vendedor ?? null,
      estadoMovimiento: this.tipoMovimiento === 'ENTRADA' ? (this.estadoMovimiento ?? 'PEDIDO_CRISTALES') : null,
      pacienteId: this.pacienteEncontrado?.id ?? null,
      detalles: detallesDTO,
      detallesAdicionales: adicDTO,
      pagos: pagosDTO,
    };

    return dto;
  }

  private completarParaSalidaSiHaceFalta(): void {
    if (this.tipoMovimiento !== 'SALIDA') return;
    if (!this.metodoSalidaSeleccionado) {
      Swal.fire('VALIDACIÓN', 'Debe seleccionar un método de salida', 'warning');
      throw new Error('Sin método de salida');
    }

    if (!this.pagos.length) {
      this.pagos.push({
        metodoPagoId: this.metodoSalidaSeleccionado.id,
        metodoPagoNombre: this.metodoSalidaSeleccionado.nombre,
        monto: this.total,
        montoImpuesto: this.total,
        fecha: this.obtenerFechaHoyConHora(),
        descripcionOtras: null,
      });
    } else {
      this.pagos[0].metodoPagoId = this.metodoSalidaSeleccionado.id;
      this.pagos[0].metodoPagoNombre = this.metodoSalidaSeleccionado.nombre;
      this.pagos[0].monto = this.total;
      this.pagos[0].montoImpuesto = this.total;
      this.pagos[0].fecha = this.fecha;
    }
  }

  guardar(): void {
    // validaciones básicas
    if (this.tipoMovimiento === 'ENTRADA') {
      const tieneAlgo = (this.detalles?.length || 0) > 0 || (this.detallesAdicionales?.length || 0) > 0;
      if (!tieneAlgo) {
        Swal.fire('VALIDACIÓN', 'Debe cargar al menos un detalle o un adicional.', 'warning');
        return;
      }
    }
    if ((this.pagos?.length || 0) === 0) {
      Swal.fire('VALIDACIÓN', 'Debe ingresar al menos un pago.', 'warning');
      return;
    }
    if (this.advertenciaMonto()) return;

    try {
      this.completarParaSalidaSiHaceFalta();
    } catch {
      return;
    }

    const payload = this.buildUpsertDTO();
    this.isLoading = true;

    const onOk = () => {
      this.isLoading = false;
      Swal.fire('MOVIMIENTO GUARDADO', 'El movimiento ha sido guardado con éxito', 'success');
      this.router.navigate(['/adminitrarCaja']);
    };

    if (this.movimientoId) {
      this.movimientoService.actualizar(this.movimientoId, payload).subscribe({
        next: onOk,
        error: () => (this.isLoading = false),
      });
    } else {
      this.movimientoService.crear(payload).subscribe({
        next: onOk,
        error: () => (this.isLoading = false),
      });
    }
  }

  // ========= Utilidades de vista =========
  trackByIndex(index: number): number {
    return index;
  }

  volverAInicio(): void {
    this.router.navigate(['/adminitrarCaja']);
  }
}
