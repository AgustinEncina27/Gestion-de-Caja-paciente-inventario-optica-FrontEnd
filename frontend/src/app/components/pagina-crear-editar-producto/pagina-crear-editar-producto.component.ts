import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CategoriaService } from 'src/app/services/categoria.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MarcaService } from 'src/app/services/marca.service';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';
import { LocalService } from 'src/app/services/local.service';
import { ProductoService } from 'src/app/services/producto.service';

import { CategoriaDTO } from 'src/app/dto/CategoriaDTO';
import { ProveedorDTO } from 'src/app/dto/ProveedorDTO';
import { MaterialProductoDTO } from 'src/app/dto/MaterialProductoDTO';

// Modelo de Local que ya tenías (id, nombre)
import { Local } from 'src/app/models/local';
import { MarcaDTO } from 'src/app/dto/MarcaDTO';
import { ProductoUpsertDTO } from 'src/app/dto/ProductoUpsertDTO';
import { ProductoDTO } from 'src/app/dto/ProductoDTO';

@Component({
  selector: 'app-pagina-crear-producto',
  templateUrl: './pagina-crear-editar-producto.component.html',
  styleUrls: ['./pagina-crear-editar-producto.component.css']
})
export class PaginaCrearEditarProductoComponent implements OnInit {
  titulo = 'Crear Producto';

  // Listas para selects
  categorias: CategoriaDTO[] = [];
  proveedores: ProveedorDTO[] = [];
  marcas: MarcaDTO[] = [];
  materialesProducto: MaterialProductoDTO[] = [];
  locales: Local[] = [];

  // Selecciones/estado del formulario
  selectedCategoriesCheckbox: CategoriaDTO[] = [];
  selectedProveedoresCheckbox: ProveedorDTO[] = [];
  marca: MarcaDTO | null = null;
  materialProducto: MaterialProductoDTO | null = null;

  // Local único + stock único
  selectedLocalId: number | null = null;
  stock: number | null = null;

  // Campos del producto
  modelo = '';
  descripcion = '';
  costo: number | null = null;
  precio: number | null = null;
  genero = '';

  // UI
  isLoading = false;
  fromPage: number | null = null;
  filtroMarca = '';
  filtroProveedor = '';

  // id actual (si es edición)
  productoId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private marcaService: MarcaService,
    private materialProductoService: MaterialProductoService,
    private localService: LocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const page = this.activatedRoute.snapshot.queryParamMap.get('fromPage');
    this.fromPage = page ? +page : null;

    // Cargar combos
    this.categoriaService.getCategories().subscribe(c => (this.categorias = c));
    this.proveedorService.getProveedores().subscribe(p => (this.proveedores = p));
    this.marcaService.getMarcas().subscribe(m => (this.marcas = m));
    this.materialProductoService.getMateriales().subscribe(m => (this.materialesProducto = m));
    this.localService.getLocales().subscribe(l => (this.locales = l));

    // Si hay id => edición
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.titulo = 'Editar Producto';
        this.productoId = +id;
        this.cargarProducto(+id);
      } else {
        this.titulo = 'Crear Producto';
        this.productoId = null;
      }
    });
  }

  private cargarProducto(id: number) {
    this.productoService.getProducto(id).subscribe((p: ProductoDTO) => {
      // Campos simples
      this.modelo = p.modelo;
      this.descripcion = p.descripcion ?? '';
      this.costo = p.costo ?? null;
      this.precio = p.precio ?? null;
      this.genero = p.genero ?? '';

      // Marca
      this.marca = { id: p.marcaId, nombre: p.marcaNombre };

      // Material (puede ser null)
      this.materialProducto = p.materialId
        ? { id: p.materialId, nombre: p.materialNombre ?? '' }
        : null;

      // Categorías y proveedores (vienen como IdNameDTO)
      this.selectedCategoriesCheckbox = (p.categorias ?? []).map(c => ({ id: c.id, nombre: c.nombre }));
      this.selectedProveedoresCheckbox = (p.proveedores ?? []).map(pr => ({ id: pr.id, nombre: pr.nombre }));

      // Local y stock únicos
      this.selectedLocalId = p.localId;
      this.stock = p.stock ?? 0;
    });
  }

  // ===== filtros =====
  get marcasFiltradas(): MarcaDTO[] {
    if (!this.filtroMarca.trim()) return this.marcas;
    const f = this.filtroMarca.toLowerCase();
    return this.marcas.filter(m => m.nombre.toLowerCase().includes(f));
  }

  get proveedoresFiltrados(): ProveedorDTO[] {
    if (!this.filtroProveedor.trim()) return this.proveedores;
    const f = this.filtroProveedor.toLowerCase();
    return this.proveedores.filter(p => p.nombre.toLowerCase().includes(f));
  }

  // ===== selecciones =====
  selecionMarca(m: MarcaDTO) { this.marca = m; }
  selecionMaterial(mp: MaterialProductoDTO) { this.materialProducto = mp; }
  selecionGenero(g: string) { this.genero = g; }
  selecionLocal(local: Local) { this.selectedLocalId = local.id; }

  // Categorías
  isCategorySelectedInCheckBox(c: CategoriaDTO): boolean {
    return this.selectedCategoriesCheckbox.some(x => x.id === c.id);
  }
  toggleCategorySelection(c: CategoriaDTO) {
    const esCristal = c.nombre.toLowerCase() === 'cristal';

    if (esCristal) {
      const ya = this.selectedCategoriesCheckbox.some(x => x.id === c.id);
      this.selectedCategoriesCheckbox = ya ? [] : [c];
      return;
    }

    // si estaba "cristal" lo removemos
    this.selectedCategoriesCheckbox = this.selectedCategoriesCheckbox.filter(x => x.nombre.toLowerCase() !== 'cristal');

    const idx = this.selectedCategoriesCheckbox.findIndex(x => x.id === c.id);
    if (idx === -1) this.selectedCategoriesCheckbox.push(c);
    else this.selectedCategoriesCheckbox.splice(idx, 1);
  }

  // Proveedores
  isProveedorSelectedInCheckBox(p: ProveedorDTO): boolean {
    return this.selectedProveedoresCheckbox.some(x => x.id === p.id);
  }
  toggleProveedorSelection(p: ProveedorDTO) {
    if (this.isProveedorSelectedInCheckBox(p)) {
      this.selectedProveedoresCheckbox = this.selectedProveedoresCheckbox.filter(x => x.id !== p.id);
    } else {
      this.selectedProveedoresCheckbox.push(p);
    }
  }

  // Helpers UI
  marcaSeleccionado(m: MarcaDTO): boolean { return !!this.marca?.id && this.marca.id === m.id; }
  materialProductoSeleccionado(mp: MaterialProductoDTO): boolean { return !!this.materialProducto?.id && this.materialProducto.id === mp.id; }
  generoSeleccionado(g: string): boolean { return this.genero === g; }

  esSoloCristalSeleccionado(): boolean {
    return this.selectedCategoriesCheckbox.length === 1 &&
           this.selectedCategoriesCheckbox[0].nombre.toLowerCase() === 'cristal';
  }
  hayCategoriasSeleccionadas(): boolean { return this.selectedCategoriesCheckbox.length > 0; }

  calcularPrecio(costo: number | null) {
    if (costo == null) return;
    this.costo = costo;
    // misma lógica que en “crear varios”
    this.precio = ((costo * 0.20) + costo) * 3;
  }

  // ====== guardar ======
  editarProducto() {
    if (!this.productoId) return;

    // validaciones mínimas
    if (!this.modelo.trim()) {
      Swal.fire('Falta modelo', 'Ingresá el modelo', 'warning');
      return;
    }
    if (!this.marca?.id) {
      Swal.fire('Falta marca', 'Seleccioná una marca', 'warning');
      return;
    }
    if (!this.selectedLocalId) {
      Swal.fire('Falta local', 'Seleccioná el local del producto', 'warning');
      return;
    }
    if (this.precio == null) {
      Swal.fire('Falta precio', 'Ingresá el precio', 'warning');
      return;
    }
    if (this.stock == null) {
      Swal.fire('Falta stock', 'Ingresá el stock', 'warning');
      return;
    }

    const dto: ProductoUpsertDTO = {
      marcaId: this.marca.id!,
      localId: this.selectedLocalId!,
      modelo: this.modelo.trim(),
      descripcion: this.descripcion || undefined,
      precio: this.precio!,
      costo: this.costo ?? undefined,
      materialId: this.esSoloCristalSeleccionado() ? undefined : (this.materialProducto?.id ?? undefined),
      genero: this.esSoloCristalSeleccionado() ? undefined : (this.genero || undefined),
      categoriaIds: this.selectedCategoriesCheckbox.map(c => c.id!),
      proveedorIds: this.selectedProveedoresCheckbox.map(p => p.id!),
      stock: this.stock ?? 0
    };

    this.isLoading = true;
    this.productoService.updateProducto(this.productoId, dto).subscribe({
      next: _ => {
        this.isLoading = false;
        Swal.fire('PRODUCTO EDITADO', 'Se ha editado con éxito!', 'success');
        if (this.fromPage !== null) {
          this.router.navigate(['/productos/page', this.fromPage]);
        } else {
          this.router.navigate(['/productos']);
        }
      },
      error: e => {
        this.isLoading = false;
        Swal.fire('ERROR', e.error?.mensaje ?? 'Error al guardar', 'error');
      }
    });
  }

  volver() {
    if (this.fromPage !== null) this.router.navigate(['/productos/page', this.fromPage]);
    else this.router.navigate(['/productos']);
  }
}
