import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MarcaService } from 'src/app/services/marca.service';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';

import { ActualizacionRequest } from 'src/app/dto/ActualizacionRequest';
import { CategoriaDTO } from 'src/app/dto/CategoriaDTO';
import { ProveedorDTO } from 'src/app/dto/ProveedorDTO';
import { MarcaDTO } from 'src/app/dto/MarcaDTO';
import { MaterialProductoDTO } from 'src/app/dto/MaterialProductoDTO';

@Component({
  selector: 'app-pagina-actualizar-productos',
  templateUrl: './pagina-actualizar-productos.component.html',
  styleUrls: ['./pagina-actualizar-productos.component.css']
})
export class PaginaActualizarProductosComponent implements OnInit {
  // controles
  tipoActualizacion: 'precio' | 'costo' = 'precio';
  tipoCambio: 'porcentaje' | 'fijo' = 'porcentaje';
  valor = 0;

  // filtros texto
  busquedaProveedor = '';
  busquedaMarca = '';

  // listas base
  categorias: CategoriaDTO[] = [];
  proveedores: ProveedorDTO[] = [];
  marcas: MarcaDTO[] = [];
  materiales: MaterialProductoDTO[] = [];

  // listas filtradas (auto-complete)
  proveedoresFiltrados: ProveedorDTO[] = [];
  marcasFiltradas: MarcaDTO[] = [];

  // filtro seleccionado (ids o null)
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

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private marcaService: MarcaService,
    private materialService: MaterialProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriaService.getCategories().subscribe(data => (this.categorias = data));
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
      this.proveedoresFiltrados = data;
    });
    this.marcaService.getMarcas().subscribe(data => {
      this.marcas = data;
      this.marcasFiltradas = data;
    });
    // ✅ usamos el mismo método que en las otras pantallas
    this.materialService.getMateriales().subscribe(data => (this.materiales = data));
  }

  actualizar(): void {
    if (this.tipoCambio === 'porcentaje' && (this.valor < 0 || this.valor > 100)) {
      Swal.fire('Valor inválido', 'El porcentaje debe estar entre 0 y 100.', 'warning');
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
      if (!result.isConfirmed) return;

      const payload: ActualizacionRequest = {
        tipo: this.tipoActualizacion,
        tipoCambio: this.tipoCambio,
        valor: this.valor,
        categoria: this.filtro.categoria,
        proveedor: this.filtro.proveedor,
        material: this.filtro.material,
        marca: this.filtro.marca
      };

      this.productoService.actualizarMasivo(payload).subscribe({
        next: () => {
          Swal.fire('Actualización exitosa', 'Los productos se actualizaron correctamente.', 'success')
              .then(() => this.router.navigate(['/inicio']));
        },
        error: () => {
          Swal.fire('Error al actualizar', 'Ocurrió un error al intentar actualizar los productos.', 'error');
        }
      });
    });
  }

  // ===== filtros de autocompletado =====
  filtrarProveedores(): void {
    const q = this.busquedaProveedor.toLowerCase().trim();
    this.proveedoresFiltrados = q
      ? this.proveedores.filter(p => p.nombre.toLowerCase().includes(q))
      : this.proveedores.slice();
  }

  filtrarMarcas(): void {
    const q = this.busquedaMarca.toLowerCase().trim();
    this.marcasFiltradas = q
      ? this.marcas.filter(m => m.nombre.toLowerCase().includes(q))
      : this.marcas.slice();
  }

  seleccionarProveedor(p: ProveedorDTO): void {
    this.filtro.proveedor = p.id!;
    this.busquedaProveedor = p.nombre;
    this.proveedoresFiltrados = [];
  }

  seleccionarMarca(m: MarcaDTO): void {
    this.filtro.marca = m.id!;
    this.busquedaMarca = m.nombre;
    this.marcasFiltradas = [];
  }
}
