import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { LocalService } from 'src/app/services/local.service';
import { ProductoService } from 'src/app/services/producto.service';

import { ProductoDTO } from 'src/app/dto/ProductoDTO';
import { Local } from 'src/app/models/local';

@Component({
  selector: 'app-listar-producto',
  templateUrl: './listar-producto.component.html',
  styleUrls: ['./listar-producto.component.css']
})
export class ListarProductoComponent {
  productos: ProductoDTO[] = [];
  paginador: any;
  pages: number[] = [];

  // filtros
  modeloSeleccionado = '';
  marcaSeleccionado  = '';

  // locales (para generar excel)
  locales: Local[] = [];
  localSeleccionado: number | null = null;

  constructor(
    private productoService: ProductoService,
    private activateRoute: ActivatedRoute,
    public  authService: AuthService,
    private localService: LocalService,
    private excelService: ExcelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let page = +(params.get('page') ?? 0);
      this.productoService.getProductos(page).subscribe(response => {
        this.productos = response.content as ProductoDTO[];
        this.paginador = response;
        this.generarPaginador(response['totalPages']);
      });
    });
  }

  eliminarProducto(p: ProductoDTO): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No puedes revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(p.id).subscribe({
          next: () => {
            Swal.fire('PRODUCTO ELIMINADO', 'El producto ha sido eliminado con éxito', 'success');
            this.cargarProductos();
          }
        });
      }
    });
  }

  buscarProductoPorModelo(): void {
    if (this.modeloSeleccionado.trim() === '') {
      Swal.fire('ERROR', 'Ingresá un modelo válido', 'warning');
      return;
    }
    this.marcaSeleccionado = '';

    this.productoService.getProductosPorModeloNoEstricto(this.modeloSeleccionado).subscribe({
      next: (productos) => {
        this.productos = productos;
        if (!productos.length) Swal.fire('SIN RESULTADOS', 'No se encontraron productos con ese modelo', 'info');
        // al buscar, ocultamos paginador (opcional)
        this.paginador = null;
      },
      error: (err) => {
        console.error('Error al buscar por modelo', err);
        Swal.fire('SIN RESULTADOS', 'No se encontraron productos con ese modelo', 'info');
        this.productos = [];
        this.paginador = null;
      }
    });
  }

  buscarProductoPorMarca(): void {
    if (this.marcaSeleccionado.trim() === '') {
      Swal.fire('ERROR', 'Ingresá una marca válida', 'warning');
      return;
    }
    this.modeloSeleccionado = '';

    this.productoService.getProductosPorMarcaNoEstricto(this.marcaSeleccionado).subscribe({
      next: (productos) => {
        this.productos = productos;
        if (!productos.length) Swal.fire('SIN RESULTADOS', 'No se encontraron productos con esa marca', 'info');
        this.paginador = null;
      },
      error: (err) => {
        console.error('Error al buscar por marca', err);
        Swal.fire('SIN RESULTADOS', 'No se encontraron productos con esa marca', 'info');
        this.productos = [];
        this.paginador = null;
      }
    });
  }

  limpiarFiltros(): void {
    this.modeloSeleccionado = '';
    this.marcaSeleccionado  = '';
    this.router.navigate(['productos/page', 0]); // vuelve a la lista paginada
  }



  // ---- paginador ----
  paginaAnterior() {
    if (this.paginador?.number > 0) this.cambiarPagina(this.paginador.number - 1);
  }
  paginaSiguiente() {
    if (this.paginador && this.paginador.number < this.paginador.totalPages - 1) {
      this.cambiarPagina(this.paginador.number + 1);
    }
  }
  cambiarPagina(pagina: number): void {
    if (!this.paginador) return;
    if (pagina < 0 || pagina >= this.paginador.totalPages) return;
    this.router.navigate(['productos/page', pagina]);
  }
  generarPaginador(totalPages: number) {
    const maxVisible = 5;
    const currentPage = this.paginador.number;

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 0);
    let end = start + maxVisible;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible, 0);
    }
    this.pages = Array.from({ length: end - start }, (_, i) => start + i);
  }
}
