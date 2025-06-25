import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Local } from 'src/app/models/local';
import { Marca } from 'src/app/models/marca';
import { Producto } from 'src/app/models/producto';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { LocalService } from 'src/app/services/local.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-producto',
  templateUrl: './listar-producto.component.html',
  styleUrls: ['./listar-producto.component.css']
})
export class ListarProductoComponent {
 productos: Producto[] = [];
 producto:Producto= new Producto();
 categorias:Categoria[]=[];
 categoria: Categoria= new Categoria();
 marcas:Marca[]=[];
 marca: Marca= new Marca();
 categoriaId:number=-1;
 marcaId:number=-1;
 genero:string='-1';
 paginador: any;
 modeloSeleccionado: string = ''; // Código del modelo ingresado
 marcaSeleccionado: string = ''; // Código del modelo ingresado
 locales: Local[] = [];
 localSeleccionado: number | null = null;
 pages: number[] = [];

 constructor(private productoService: ProductoService,
  private activateRoute: ActivatedRoute,
  public authService: AuthService,
  private localService: LocalService,
  private excelService: ExcelService,
  private router: Router){
  }

  ngOnInit(): void{
    this.cargarProductos();
    this.cargarProductoModal();
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.localService.getLocales().subscribe({
      next: (locales) => {
        this.locales = locales;
      },
      error: (err) => {
        console.error('Error al cargar locales:', err);
      },
    });
  }

  eliminarProducto(productoAEliminar:Producto){
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
        this.productoService.deleteProducto(productoAEliminar.id).subscribe(
          response=>{
            Swal.fire(
              'PRODUCTO ELIMINADO','El producto ha sido eliminadO con éxito!','success'
            )
            this.cargarProductos()
          }
        )
        
      }
    })
  }


  cargarProductoModal():void{
    const productoModal = document.getElementById('productoModal')
    if (productoModal) {
      productoModal.addEventListener('show.bs.modal', event => {
        this.producto= new Producto();
        const button = (event as any).relatedTarget;
        const productoID = button.getAttribute('data-bs-whatever')
        if (productoID) {
          this.productoService.getProducto(productoID).subscribe(
            producto=>{
              this.producto=producto
            }
          )
        }  
      })
    }
  }

  cargarProductos() {
    this.activateRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page')!;
      if (!page) page = 0;
  
      this.productoService.getProductos(page).subscribe(response => {
        this.productos = (response.content as Producto[]);
        this.paginador = response;
        this.generarPaginador(response.totalPages);
      });
    });
  }

  buscarProductoPorModelo(): void {
    if (this.modeloSeleccionado.trim() === '') {
      Swal.fire('ERROR', 'Debes ingresar un código de modelo válido', 'warning');
      return;
    }
    this.marcaSeleccionado='';
  
    this.productoService.getProductosPorModeloNoEstricto(this.modeloSeleccionado).subscribe({
      next: (productos) => {
        if (productos.length > 0) {
          this.productos = productos; // Actualiza los productos mostrados
        } else {
          Swal.fire('SIN RESULTADOS', 'No se encontraron productos con ese modelo', 'info');
        }
      },
      error: (err) => {
        console.error('Error al buscar producto por modelo', err);
      },
      complete: () => {
        console.log('Búsqueda de productos por modelo completada');
      },
    });
  }

  buscarProductoPorMarca(): void {
    if (this.marcaSeleccionado.trim() === '') {
      Swal.fire('ERROR', 'Debes ingresar una marca válida', 'warning');
      return;
    }
    
    this.modeloSeleccionado='';

    this.productoService.getProductosPorMarcaNoEstricto(this.marcaSeleccionado).subscribe({
      next: (productos) => {
        if (productos.length > 0) {
          this.productos = productos; // Actualiza los productos mostrados
        } else {
          Swal.fire('SIN RESULTADOS', 'No se encontraron productos con esa marca', 'info');
        }
      },
      error: (err) => {
        console.error('Error al buscar producto por marca', err);
      },
      complete: () => {
        console.log('Búsqueda de productos por marca completada');
      },
    });
  }

  limpiarFiltros() {
    this.modeloSeleccionado='';
    this.marcaSeleccionado='';
    this.cargarProductos()
  }

  generarStockLocal(): void {
    if (this.localSeleccionado === null) {
      Swal.fire('ERROR', 'Por favor selecciona un local', 'warning');
      return;
    }

    const local = this.locales.find(l => l.id == this.localSeleccionado);
    const nombreSucursal = local ? local.nombre.toLowerCase().replace(/\s+/g, '_') : 'sucursal';
    const fechaActual = new Date().toISOString().slice(0, 10); 

    this.excelService.generarExcelStock(this.localSeleccionado).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stock_${nombreSucursal}_${fechaActual}.xlsx`;
        link.click();
        Swal.fire('ÉXITO', 'Excel generado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al generar el Excel:', err);
        Swal.fire('ERROR', 'No se pudo generar el Excel', 'error');
      },
    });
  }

  
  //paginador
  paginaAnterior() {
    if (this.paginador.number > 0) {
      this.cambiarPagina(this.paginador.number - 1);
    }
  }
  
  paginaSiguiente() {
    if (this.paginador.number < this.paginador.totalPages - 1) {
      this.cambiarPagina(this.paginador.number + 1);
    }
  }
  
  cambiarPagina(pagina: number): void {
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
