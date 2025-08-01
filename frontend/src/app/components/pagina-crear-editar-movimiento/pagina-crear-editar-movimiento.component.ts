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
import { Marca } from 'src/app/models/marca';
import { CajaMovimiento } from 'src/app/models/cajaMovimiento';
import { DetalleAdicional } from 'src/app/models/detalleAdicional';
import { AuthService } from 'src/app/services/auth.service';

declare var bootstrap: any;

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
  fichaPaciente: number = 0; // Número de ficha para buscar al paciente
  codigoProducto: string = ''; // Código o criterio para buscar el producto
  marcasDisponibles: Marca[] = []; // Marcas disponibles para el modelo del producto
  stockLocal: number | null = null; 
  productoSeleccionado: Producto | null = null;
  marcaSeleccionada: Marca | null = null;
  metodoSalida: MetodoPago= new MetodoPago();
  isLoading = false; // Variable para la pantalla de carga
  deuda: number = 0; 
  productosEncontrados: Producto[] = [];

  constructor(
    private movimientoService: MovimientoService,
    public authService: AuthService,
    private pacienteService: PacienteService,
    private productoService: ProductoService,
    private localService: LocalService,
    private metodoPagoService: MetodoPagoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movimiento.fecha = this.obtenerFechaHoyConHora();
    this.cargarLocales();
    this.cargarMetodosPago();
    this.cargarMovimientoOPaciente();
  }

  validarUsuario(): void {
    if (!this.authService.hasRole('ROLE_ADMIN')) {
      const localId = this.authService.getLocalId(); // 👈 asegurate que sea un método
  
      // Buscar el local correspondiente
      const localEncontrado = this.locales.find(local => local.id === localId);

      if (localEncontrado) {
        this.movimiento.local = localEncontrado;
      } else {
        console.warn('No se encontró el local correspondiente al usuario');
      }
    }
  }

  obtenerFechaHoy(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  obtenerFechaHoyConHora(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(hoy.getDate()).padStart(2, '0');
    const hours = String(hoy.getHours()).padStart(2, '0');
    const minutes = String(hoy.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  cargarLocales(): void {
    this.localService.getLocales().subscribe((data) => {
      this.locales = data;
  
      // Validar usuario una vez que locales ya están cargados
      this.validarUsuario();
    });
  }

  cargarMetodosPago(): void {
    this.metodoPagoService.getmetodosPagos().subscribe((data) => (this.metodosPago = data));
  }

  cargarMovimientoOPaciente(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const movimientoid = +params.get('id')!;
      const pacienteId = +params.get('pacienteId')!;
      if (movimientoid) {
        this.cargarMovimiento(movimientoid);
      }
      if(pacienteId){
        this.cargarPaciente(pacienteId);
      }
    });
  }

  cargarPaciente(pacienteId:number){
    this.pacienteService.getPaciente(pacienteId).subscribe({
      next: (paciente) => {
        this.pacienteEncontrado = paciente;
        this.movimiento.paciente = paciente;
        this.movimiento.tipoMovimiento='ENTRADA';
        this.fichaPaciente=paciente.ficha;
        this.movimiento.estadoMovimiento = "PEDIDO_CRISTALES"; 
      },
      error: () => Swal.fire('ERROR', 'Paciente no encontrado', 'error')
    });
  }

  cargarMovimiento(id:number){
    this.titulo = 'Editar Movimiento';
    this.movimientoService.getMovimiento(id).subscribe((data) => {
      this.movimiento = data;
      this.detalles = data.detalles || [];
      if(this.movimiento.cajaMovimientos.length !== 0){
        this.metodoSalida=this.movimiento.cajaMovimientos[0].metodoPago;
      }

      // Esperar a que la lista de locales se cargue antes de asignar la referencia
      this.localService.getLocales().subscribe((locales) => {
        this.locales = locales;

        // Buscar y asignar la referencia exacta del local
        const localEncontrado = this.locales.find((local) => local.id === this.movimiento.local?.id);
        if (localEncontrado) {
          this.movimiento.local = localEncontrado;
        }
      });
      // Asegurar que `fichaPaciente` coincida con el paciente del movimiento
      if (this.movimiento.paciente) {
        this.fichaPaciente = this.movimiento.paciente.ficha || 0; // Si `ficha` es undefined, asigna 0
        this.pacienteEncontrado = this.movimiento.paciente; // Mostrar el paciente encontrado
      }
      this.calcularDeuda();

    });
  }

  compararMetodosPago(o1: MetodoPago, o2: MetodoPago): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  buscarPaciente(): void {
    if (this.fichaPaciente) {
      this.pacienteService.getPacientePorFicha(this.fichaPaciente).subscribe({
        next: (paciente) => {
          this.pacienteEncontrado = paciente;
          this.movimiento.paciente = paciente;
        },
        error: () => Swal.fire('ERROR', 'Paciente no encontrado', 'error')
      });
    }
  }

  buscarProducto(): void {
    if (this.codigoProducto.trim() && this.movimiento.local?.id) {
      this.productoService.getProductosPorModeloYLocal(this.codigoProducto, this.movimiento.local.id).subscribe({
        next: (productos) => {
          this.productosEncontrados = productos;
          const modal = new bootstrap.Modal(document.getElementById('modalProductos')!);
          modal.show();
        },
        error: () => Swal.fire('ERROR', 'Error al buscar productos', 'error')
      });
    }
  }

  seleccionarProducto(producto: Producto): void {
    const productoLocal = producto.productoLocales.find(pl => pl.local.id === this.movimiento.local.id);
    const stock = productoLocal?.stock ?? 0;
  
    if (stock <= 0) {
      Swal.fire('ADVERTENCIA', 'Este producto no tiene stock en esta sucursal', 'warning');
      return;
    }
  
    const detalle: DetalleMovimiento = new DetalleMovimiento();
    detalle.producto = producto;
    detalle.cantidad = 1;
    detalle.precioUnitario = producto.precio;
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
  
    this.detalles.push(detalle);
    this.productoSeleccionado = null;
    this.codigoProducto = '';
    this.stockLocal = null;
    this.marcasDisponibles = [];
    this.marcaSeleccionada = null;
  
    this.calcularTotalAdicional();
  
    const modalElement = document.getElementById('modalProductos');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  getStockEnLocal(producto: Producto): number {
    const localId = this.movimiento.local?.id;
    if (!producto.productoLocales || !localId) return 0;
  
    const productoLocal = producto.productoLocales.find(pl => pl.local?.id === localId);
    return productoLocal?.stock ?? 0;
  }

  cambiarProductoPorMarca(): void {
    if (this.marcaSeleccionada && this.movimiento.local) {
      const productoConMarcaSeleccionada = this.productoService.getProductosPorModelo(this.codigoProducto).subscribe({
        next: (productos: Producto[]) => {
          const productoFiltrado = productos.find((producto) =>
            producto.marca.id === this.marcaSeleccionada!.id &&
            producto.productoLocales.some((pl) => pl.local.id === this.movimiento.local.id)
          );
  
          if (productoFiltrado) {
            this.productoSeleccionado = productoFiltrado; // Actualizar todo el producto
            this.actualizarStockLocal();
          } else {
            Swal.fire('ADVERTENCIA', 'No se encontró stock para la marca seleccionada en este local.', 'warning');
          }
        },
        error: () => Swal.fire('ERROR', 'No se pudo cargar el producto con la marca seleccionada.', 'error'),
      });
    }
  }

  actualizarStockLocal(): void {
    if (this.productoSeleccionado && this.movimiento.local) {
      const productoLocal = this.productoSeleccionado.productoLocales.find(
        (pl) => pl.local.id === this.movimiento.local.id 
      );

      if (productoLocal && this.productoSeleccionado.marca) {
        this.stockLocal = productoLocal.stock; // Asignar el stock del local para la marca seleccionada
      } else {
        this.stockLocal = 0; // Si no hay coincidencia, el stock es 0
      }
    } else {
      this.stockLocal = null; // No hay local o producto seleccionado
    }
  }

  agregarDetalle(): void {
    if (this.productoSeleccionado && this.movimiento.local && this.stockLocal !== null) {
      const nuevoDetalle: DetalleMovimiento = new DetalleMovimiento();
      nuevoDetalle.producto = this.productoSeleccionado;
      nuevoDetalle.cantidad = 1; // Cantidad por defecto
      nuevoDetalle.precioUnitario = this.productoSeleccionado.precio;
      nuevoDetalle.subtotal = nuevoDetalle.cantidad * nuevoDetalle.precioUnitario;

      if (nuevoDetalle.cantidad > this.stockLocal) {
        Swal.fire('ERROR', 'Cantidad supera el stock disponible', 'error');
        return;
      }

      this.detalles.push(nuevoDetalle);
      this.productoSeleccionado = null; // Limpiar producto seleccionado
      this.codigoProducto = ''; // Resetear el campo de búsqueda
      this.marcasDisponibles = []; // Limpiar marcas disponibles
      this.stockLocal = null; // Resetear el stock
      this.calcularTotalAdicional();
      } else {
      Swal.fire('ERROR', 'Debe seleccionar un producto válido', 'error');
    }
  }


  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
    this.calcularTotalAdicional();
    this.advertenciaMonto();
  }

  guardarMovimiento(): void {
    if (this.advertenciaMonto() && this.movimiento.tipoMovimiento === 'ENTRADA') {
      return;
    }
  
    this.movimiento.detalles = this.detalles;
  
    if (this.movimiento.tipoMovimiento === 'SALIDA') {
      this.esMovimientoSalida(this.movimiento.id);
    }
  
    // Validar que haya al menos un pago
    if (!this.movimiento.cajaMovimientos || this.movimiento.cajaMovimientos.length === 0) {
      Swal.fire('VALIDACIÓN', 'Debe ingresar al menos un pago para guardar el movimiento.', 'warning');
      return;
    }
      
  
    this.isLoading = true;
  
    const afterSave = () => {
      if (this.movimiento.tipoMovimiento === 'ENTRADA' && this.movimiento.paciente?.id) {
        const cristalesPorDetalle = this.movimiento.detalles?.filter(detalle =>
          detalle.producto.categorias.some(c => c.nombre.toLowerCase() === 'cristal')
        ) || [];
    
        cristalesPorDetalle.forEach(detalle => {
          const modelo = detalle.producto.modelo;
          const marca = detalle.producto.marca.nombre;
          const nombreCristal = `${modelo} ${marca}`;
    
          this.pacienteService.guardarCristal(this.movimiento.paciente!.id, nombreCristal).subscribe({
            next: () => console.log(`Cristal guardado: ${nombreCristal}`),
            error: err => console.error('Error al guardar cristal:', err)
          });
        });
    
        // También podés mantener lo de los detallesAdicionales si lo querés seguir usando:
        if (this.movimiento.detallesAdicionales) {
          const cristalesTexto = this.movimiento.detallesAdicionales
            .filter(d => d.descripcion.toLowerCase().includes('cristal'))
            .map(d => {
              const texto = d.descripcion.toLowerCase();
              const index = texto.indexOf('cristal');
              return d.descripcion.substring(index + 7).trim();
            });
    
          cristalesTexto.forEach(nombreCristal => {
            this.pacienteService.guardarCristal(this.movimiento.paciente!.id, nombreCristal).subscribe({
              next: () => console.log(`Cristal guardado: ${nombreCristal}`),
              error: err => console.error('Error al guardar cristal desde texto:', err)
            });
          });
        }
      }
    
      this.isLoading = false;
      Swal.fire('MOVIMIENTO GUARDADO', 'El movimiento ha sido guardado con éxito', 'success');
      this.router.navigate(['/adminitrarCaja']);
    };
  
    if (this.movimiento.id) {
      this.movimientoService.updateMovimiento(this.movimiento).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('MOVIMIENTO GUARDADO', 'El movimiento ha sido guardado con éxito', 'success');
          this.router.navigate(['/adminitrarCaja']);
        },
        error: (e) => {
          this.isLoading = false;
        }
      });
    } else {
      this.movimientoService.createMovimiento(this.movimiento).subscribe({
        next: afterSave,
        error: (e) => {
          this.isLoading = false;
        }
      });
    }
  }

  //Rellena los demas campos si el movimiento es saldia
  esMovimientoSalida(idMovimiento : number){
    
    //si es editar
    if(idMovimiento){
      this.movimiento.estadoMovimiento=null;
      this.movimiento.cajaMovimientos[0].metodoPago=this.metodoSalida;
      this.movimiento.cajaMovimientos[0].monto=this.movimiento.total;
      this.movimiento.cajaMovimientos[0].montoImpuesto=this.movimiento.total;
      this.movimiento.cajaMovimientos[0].fecha=this.movimiento.fecha;
    }else{
      //si es crear
      this.movimiento.estadoMovimiento=null;
      const nuevoPago: CajaMovimiento = new CajaMovimiento();
      nuevoPago.monto=this.movimiento.total;
      nuevoPago.montoImpuesto=this.movimiento.total;
      nuevoPago.metodoPago=this.metodoSalida;
      nuevoPago.fecha=this.obtenerFechaHoyConHora();

      this.movimiento.cajaMovimientos = this.movimiento.cajaMovimientos || [];
      this.movimiento.cajaMovimientos.push(nuevoPago);
    }  
  }

  verificarCantidad(detalle: DetalleMovimiento): void {
    if (detalle.cantidad < 0) {
      detalle.cantidad = 0; // Restablece a 0 si el valor es negativo
      Swal.fire('ADVERTENCIA', 'La cantidad no puede ser negativa.', 'warning');
    }
    this.calcularSubtotal(detalle); // Calcula nuevamente el subtotal
  }

  calcularSubtotal(detalle: DetalleMovimiento): void {
    detalle.subtotal=detalle.cantidad * detalle.subtotal;
    this.calcularTotalAdicional(); // Llama al cálculo del total
  }

  
  limpiarAlCambiarTipoDeMovimiento(tipoDemovimiento : string){
    let paciente =this.pacienteEncontrado

    if(tipoDemovimiento ==='ENTRADA'){
      this.movimiento.estadoMovimiento = "PEDIDO_CRISTALES"; // Estado inicial
      this.movimiento.paciente = paciente;
      this.pacienteEncontrado= paciente;
    }else{
      this.movimiento.paciente = null;
      this.pacienteEncontrado= null;
      this.fichaPaciente=0;
    }    

    this.movimiento.total=0;
    this.movimiento.totalImpuesto=0;
    this.movimiento.descripcion='';
    this.movimiento.vendedor='';
    this.movimiento.detallesAdicionales=[];

    this.detalles = [];
    this.movimiento.detalles=[];
    this.marcasDisponibles  = [];
    this.productoSeleccionado = null;
    this.marcaSeleccionada = null;
    
    this.movimiento.tipoMovimiento = tipoDemovimiento;    
    
    this.movimiento.cajaMovimientos=[];

  }

  limpiarAlCambiarLocal(local: Local){
    let tipoMovmiento=this.movimiento.tipoMovimiento
    let paciente =this.pacienteEncontrado

    this.movimiento.tipoMovimiento=tipoMovmiento ;
    this.movimiento.fecha = this.obtenerFechaHoyConHora();
    this.movimiento.total=0;
    this.movimiento.totalImpuesto=0;
    this.movimiento.descripcion='';
    this.movimiento.vendedor='';
    this.movimiento.paciente = paciente;
    this.pacienteEncontrado= paciente;

    this.movimiento.detallesAdicionales=[];
   
    this.detalles = [];
    this.movimiento.detalles=[];
    this.marcasDisponibles  = [];
    this.productoSeleccionado = null;
    this.marcaSeleccionada = null;

    this.movimiento.cajaMovimientos=[];

    this.movimiento.local=local;

    if(tipoMovmiento==='ENTRADA'){
      this.movimiento.estadoMovimiento = "PEDIDO_CRISTALES"; // Estado inicial
    }

    this.actualizarStockLocal(); // Actualizar el stock inicial
  }

  duplicarTotalImpuesto(total: number){
    if(this.movimiento.tipoMovimiento==='SALIDA'){
      this.movimiento.totalImpuesto=total;
    }
  }

  //Duplica los montos totales a los montosImpuesto al momento de poner el detalle de los productos
  calcularTotalYAdviertenciaTotal(total:number,index:number){
    
    

    this.movimiento.cajaMovimientos[index].montoImpuesto=total;
    this.calcularMontoImpuestoYAdviertenciaTotal();

    if(this.advertenciaMonto()){
      return;
    }
  }

  //Calcula el monto con impuestos
  calcularMontoImpuestoYAdviertenciaTotal(){
    
    // Verificar si el monto no sobrepasa el total del movimiento
    const sumaMontosImpuesto = this.movimiento.cajaMovimientos.reduce((sum, movimiento) => {
      return sum + (movimiento.montoImpuesto || 0); // Asegurarse de sumar solo los montos válidos
    }, 0);

    this.movimiento.totalImpuesto=sumaMontosImpuesto;
    this.calcularDeuda();

    if(this.advertenciaMonto()){
      return;
    }
  }

  agregarPago(): void {
    
    const nuevoPago: CajaMovimiento = new CajaMovimiento();
    nuevoPago.monto=0;
    nuevoPago.montoImpuesto=0;
    nuevoPago.metodoPago=this.metodosPago[0];
    nuevoPago.fecha=this.obtenerFechaHoyConHora();

    this.movimiento.cajaMovimientos = this.movimiento.cajaMovimientos || [];
    this.movimiento.cajaMovimientos.push(nuevoPago);
  }

  calcularDeuda(): void {
    if (!this.movimiento || !this.movimiento.cajaMovimientos) {
      this.deuda = this.movimiento.total;
      return;
    }
    
    const totalPagado = this.movimiento.cajaMovimientos.reduce((acc, mov) => acc + mov.monto, 0);
    if((this.movimiento.total - totalPagado)<0){
      this.deuda=0;
    }else{
      this.deuda = this.movimiento.total - totalPagado;
    }
  }

  eliminarPago(index: number): void {
    if (this.movimiento.cajaMovimientos) {
      this.movimiento.cajaMovimientos.splice(index, 1);
    }
    this.calcularMontoImpuestoYAdviertenciaTotal();
    this.calcularDeuda();
  }

  //seccion para manejar los detalles adicionales
  // Método para agregar un nuevo detalle adicional
  agregarDetalleAdicional(): void {
    const nuevoDetalleAdicional: DetalleAdicional = new DetalleAdicional();
    nuevoDetalleAdicional.descripcion='';
    nuevoDetalleAdicional.subtotal=0

    this.movimiento.detallesAdicionales = this.movimiento.detallesAdicionales || [];
    this.movimiento.detallesAdicionales.push(nuevoDetalleAdicional);
  }

  // Método para eliminar un detalle adicional por índice
  eliminarDetalleAdicional(index: number): void {
    if (this.movimiento.detallesAdicionales) {
      this.movimiento.detallesAdicionales.splice(index, 1);
      this.calcularTotalAdicional();
      this.calcularMontoImpuestoYAdviertenciaTotal();
    }

    this.advertenciaMonto();
    this.calcularDeuda();
  }

  advertenciaMonto(){
    let advertencia: boolean=false;

    if(this.movimiento.cajaMovimientos != undefined){
      // Verificar si el monto no sobrepasa el total del movimiento
      const sumaMontosImpuesto = this.movimiento.cajaMovimientos.reduce((sum, movimiento) => {
        return sum + (movimiento.montoImpuesto || 0); // Asegurarse de sumar solo los montos válidos
      }, 0);

      // Verificar si el monto no sobrepasa el total del movimiento
      const sumaMontos = this.movimiento.cajaMovimientos.reduce((sum, movimiento) => {
        return sum + (movimiento.monto || 0); // Asegurarse de sumar solo los montos válidos
      }, 0);


      if (sumaMontosImpuesto > this.movimiento.total || sumaMontos > this.movimiento.total) {
        Swal.fire('ADVERTENCIA', 'La suma de los pagos no puede exceder el total del movimiento.', 'warning');
        advertencia=true;
      }
    }
    
    return advertencia
  }

  calcularTotalAdicional(): void {
    const detallesAdicionales = this.movimiento.detallesAdicionales || [];
    const detalles = this.detalles || [];

    const totalAdicional = detallesAdicionales.reduce(
      (sum, detalle) => sum + detalle.subtotal,
      0
    );

    const totalDetalles = detalles.reduce(
      (sum, detalle) => sum + detalle.subtotal,
      0
    );

    this.movimiento.total = totalDetalles + totalAdicional;
    this.calcularDeuda();
  }

  aplicarDescuento(descuento: number) {
    // Validar que el descuento esté entre 0 y 100
    if (descuento < 0 || descuento > 100) {
      Swal.fire({
        icon: 'warning',
        title: 'Descuento inválido',
        text: 'El descuento debe estar entre 0% y 100%',
      });

      this.movimiento.descuento= 0;
      return;
    }
  
    // Validar que el total sea válido
    if (this.movimiento.total === null || this.movimiento.total === undefined || this.movimiento.total === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Total inválido',
        text: 'No se puede aplicar el descuento porque el total es nulo, cero o indefinido.',
      });
      return;
    }
  
    this.calcularTotalAdicional();
    this.movimiento.total = this.movimiento.total - (this.movimiento.total * (descuento / 100));
  }

  volverAInicio() {
    this.router.navigate(['/adminitrarCaja']); // Cambia '/inicio' por la ruta deseada
  }
}
