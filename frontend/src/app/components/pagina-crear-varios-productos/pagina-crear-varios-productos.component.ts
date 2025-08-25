import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { MarcaService } from 'src/app/services/marca.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';

import { CategoriaDTO } from 'src/app/dto/CategoriaDTO';
import { ProveedorDTO } from 'src/app/dto/ProveedorDTO';
import { MaterialProductoDTO } from 'src/app/dto/MaterialProductoDTO';
import { MarcaDTO } from 'src/app/dto/MarcaDTO';
import { ProductoUpsertDTO } from 'src/app/dto/ProductoUpsertDTO';

@Component({
  selector: 'app-pagina-varios-productos',
  templateUrl: './pagina-crear-varios-productos.component.html',
  styleUrls: ['./pagina-crear-varios-productos.component.css']
})
export class PaginaCrearVariosProductosComponent implements OnInit {
  titulo = 'Crear Producto';

  // cat/prov/marca/material
  categorias: CategoriaDTO[] = [];
  proveedores: ProveedorDTO[] = [];
  marcas: MarcaDTO[] = [];
  materialesProducto: MaterialProductoDTO[] = [];

  // selección
  selectedCategoriesCheckbox: CategoriaDTO[] = [];
  selectedProveedoresCheckbox: ProveedorDTO[] = [];
  marca: MarcaDTO | null = null;
  materialProducto: MaterialProductoDTO | null = null;

  // local único (no se muestra en UI) + stock
  selectedLocalId: number | null = null;  // se setea desde AuthService
  stock: number | null = null;

  // campos del producto (comunes a todos los modelos)
  descripcion = '';
  costo: number | null = null;
  precio: number | null = null;
  genero = '';

  // modelos múltiples
  modelos: string[] = [''];
  modelosInvalidos: Set<string> = new Set();

  // UI
  isLoading = false;
  filtroMarca = '';
  filtroProveedor = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private marcaService: MarcaService,
    private materialProductoService: MaterialProductoService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Cargas maestras
    this.categoriaService.getCategories().subscribe(c => (this.categorias = c));
    this.proveedorService.getProveedores().subscribe(p => (this.proveedores = p));
    this.marcaService.getMarcas().subscribe(m => (this.marcas = m));
    this.materialProductoService.getMateriales().subscribe(m => (this.materialesProducto = m));

    // Local único (no se muestra): lo tomamos del token si existe
    this.selectedLocalId = this.authService.getLocalId?.() ?? null;
  }

  // ===== Filtros =====
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

  // ===== Selecciones =====
  selecionMarca(m: MarcaDTO) { this.marca = m; }
  selecionMaterial(m: MaterialProductoDTO) { this.materialProducto = m; }
  selecionGenero(g: string) { this.genero = g; }

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

    this.selectedCategoriesCheckbox = this.selectedCategoriesCheckbox.filter(x => x.nombre.toLowerCase() !== 'cristal');
    const idx = this.selectedCategoriesCheckbox.findIndex(x => x.id === c.id);
    if (idx === -1) this.selectedCategoriesCheckbox.push(c);
    else this.selectedCategoriesCheckbox.splice(idx, 1);
  }

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

  hayCategoriasSeleccionadas(): boolean {
    return this.selectedCategoriesCheckbox.length > 0;
  }
  esSoloCristalSeleccionado(): boolean {
    return this.selectedCategoriesCheckbox.length === 1 &&
           this.selectedCategoriesCheckbox[0].nombre.toLowerCase() === 'cristal';
  }

  // ===== Lógica =====
  calcularPrecio(costo: number | null) {
    if (costo == null) return;
    this.costo = costo;
    this.precio = ((costo * 0.20) + costo) * 3;
  }

  agregarModelo() { this.modelos.push(''); }
  eliminarModelo(i: number) { this.modelos.splice(i, 1); }
  trackByIndex(i: number) { return i; }

  // Validación y creación
  validarModelosAntesDeCrear(): void {
    if (!this.marca?.id) {
      Swal.fire('Advertencia', 'Seleccioná una marca antes de validar los modelos.', 'warning');
      return;
    }
    const modelosLimpios = this.modelos.map(m => m.trim()).filter(m => m !== '');

    // caracteres inválidos
    const invalidos = modelosLimpios.filter(m => /[.;/\\]/.test(m));
    if (invalidos.length) {
      Swal.fire('Error', `Modelos con caracteres inválidos: ${invalidos.join(', ')}`, 'error');
      this.modelosInvalidos = new Set(invalidos.map(m => m.toLowerCase()));
      return;
    }

    // duplicados locales
    const repetidos = modelosLimpios.filter((m, i, arr) => arr.findIndex(x => x.toLowerCase() === m.toLowerCase()) !== i);
    if (repetidos.length) {
      const lista = Array.from(new Set(repetidos.map(m => m.toLowerCase()))).join(', ');
      Swal.fire('Error', `Tenés modelos repetidos en el formulario: ${lista}`, 'error');
      this.modelosInvalidos = new Set(repetidos.map(m => m.toLowerCase()));
      return;
    }

    // contra backend
    const unicos = Array.from(new Set(modelosLimpios.map(m => m.toLowerCase())));
    this.productoService.validarModelos(unicos, this.marca.id!).subscribe({
      next: existentes => {
        if (existentes.length) {
          Swal.fire('Error', `Ya existen para esta marca: ${existentes.join(', ')}`, 'error');
          this.modelosInvalidos = new Set(existentes.map(m => m.toLowerCase()));
        } else {
          this.modelosInvalidos.clear();
          this.crearProducto();
        }
      },
      error: () => Swal.fire('Error', 'Problema al validar los modelos.', 'error')
    });
  }

  private buildDtos(): ProductoUpsertDTO[] {
    return this.modelos
      .map(m => m.trim())
      .filter(m => m !== '')
      .map(modelo => ({
        marcaId: this.marca!.id!,
        localId: this.selectedLocalId!,         // ✅ único local (tomado del token)
        modelo,
        descripcion: this.descripcion || undefined,
        precio: this.precio!,                   // requerido
        costo: this.costo ?? undefined,
        materialId: this.materialProducto?.id ?? undefined,
        genero: this.genero || undefined,
        categoriaIds: this.selectedCategoriesCheckbox.map(c => c.id!),
        proveedorIds: this.selectedProveedoresCheckbox.map(p => p.id!),
        stock: this.stock ?? 0                  // ✅ stock inicial
      }));
  }

  crearProducto() {
    // Asegurar local desde token si hiciera falta
    if (this.selectedLocalId == null) {
      this.selectedLocalId = this.authService.getLocalId?.() ?? null;
    }
    if (this.selectedLocalId == null) {
      Swal.fire('Falta local', 'No se pudo determinar el local del usuario.', 'warning');
      return;
    }
    if (this.precio == null) {
      Swal.fire('Falta precio', 'Ingresá el precio.', 'warning');
      return;
    }
    if (this.stock == null) {
      Swal.fire('Falta stock', 'Ingresá el stock inicial.', 'warning');
      return;
    }

    const dtos = this.buildDtos();
    this.isLoading = true;
    
    this.productoService.createVariosProductos(dtos).subscribe({
      next: _ => {
        this.isLoading = false;
        Swal.fire('PRODUCTOS CREADOS', 'Guardados con éxito!', 'success');
        this.router.navigate(['/inicio']);
      },
      error: e => {
        this.isLoading = false;
        Swal.fire('ERROR', e.error?.mensaje ?? 'Error al guardar', 'error');
      }
    });
  }

  // helpers UI
  marcaSeleccionado(m: MarcaDTO): boolean {
    return !!this.marca?.id && this.marca.id === m.id;
  }
  materialProductoSeleccionado(mp: MaterialProductoDTO): boolean {
    return !!this.materialProducto?.id && this.materialProducto.id === mp.id;
  }
  generoSeleccionado(g: string): boolean {
    return this.genero === g;
  }

  isModeloInvalido(i: number): boolean {
    const val = (this.modelos[i] ?? '').toLowerCase();
    return this.modelosInvalidos.has(val);
  }

  modelosVacios(): boolean {
    return this.modelos.length === 0 || this.modelos.every(m => !m || !m.trim());
  }
}
