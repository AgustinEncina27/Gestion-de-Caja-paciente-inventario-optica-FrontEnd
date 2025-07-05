import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActualizacionRequest } from 'src/app/dto/ActualizacionRequest';
import { Categoria } from 'src/app/models/categoria';
import { Marca } from 'src/app/models/marca';
import { MaterialProducto } from 'src/app/models/materialProducto';
import { Proveedor } from 'src/app/models/proveedor';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MarcaService } from 'src/app/services/marca.service';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pagina-actualizar-productos',
  templateUrl: './pagina-actualizar-productos.component.html',
  styleUrls: ['./pagina-actualizar-productos.component.css']
})
export class PaginaActualizarProductosComponent implements OnInit {
  tipoActualizacion = 'precio'; // o 'costo'
  tipoCambio = 'porcentaje';    // o 'fijo'
  valor: number = 0;
  busquedaProveedor: string = '';
  busquedaMarca: string = '';

  proveedoresFiltrados: Proveedor[] = [];
  marcasFiltradas: Marca[] = [];

  filtro: {
    categoria: number | null;
    proveedor: number | null;
    material: number | null;
    marca: number | null;
  } = {
    categoria: null,
    proveedor: null,
    material: null,
    marca: null
  };

  categorias: Categoria[]= [];
  proveedores: Proveedor[]= [];
  marcas: Marca[]= [];
  materiales: MaterialProducto[]= [];

  constructor(private productoService: ProductoService,
              private categoriaService: CategoriaService,
              private proveedorService: ProveedorService,
              private marcaService: MarcaService,
              private router: Router,
              private materialService: MaterialProductoService) {}

  ngOnInit(): void {
    this.categoriaService.getCategories().subscribe(data => this.categorias = data);
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
      this.proveedoresFiltrados = data;
    });
    this.marcaService.getMarcas().subscribe(data => {
      this.marcas = data;
      this.marcasFiltradas = data;
    });
    this.materialService.getMaterialesProducto().subscribe(data => this.materiales = data);
  }

  actualizar() {
    if (this.tipoCambio === 'porcentaje' && (this.valor < 0 || this.valor > 100)) {
      Swal.fire({
        icon: 'warning',
        title: 'Valor inválido',
        text: 'El porcentaje debe estar entre 0 y 100.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: `Se actualizarán los ${this.tipoActualizacion === 'precio' ? 'precios' : 'costos'} según los filtros aplicados.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, aplicar cambios',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const payload: ActualizacionRequest = {
          tipo: this.tipoActualizacion as 'precio' | 'costo',
          tipoCambio: this.tipoCambio as 'porcentaje' | 'fijo',
          valor: this.valor,
          categoria: this.filtro.categoria,
          proveedor: this.filtro.proveedor,
          material: this.filtro.material,
          marca: this.filtro.marca
        };
  
        this.productoService.actualizarMasivo(payload).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Actualización exitosa',
              text: 'Los productos se actualizaron correctamente.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/inicio']);
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              text: 'Ocurrió un error al intentar actualizar los productos.',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

  filtrarProveedores() {
    this.proveedoresFiltrados = this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(this.busquedaProveedor.toLowerCase())
    );
  }
  
  filtrarMarcas() {
    this.marcasFiltradas = this.marcas.filter(m =>
      m.nombre.toLowerCase().includes(this.busquedaMarca.toLowerCase())
    );
  }
  
  seleccionarProveedor(p: Proveedor) {
    this.filtro.proveedor = p.id;
    this.busquedaProveedor = p.nombre;
    this.proveedoresFiltrados = [];
  }
  
  seleccionarMarca(m: Marca) {
    this.filtro.marca = m.id;
    this.busquedaMarca = m.nombre;
    this.marcasFiltradas = [];
  }

}
