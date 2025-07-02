import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Marca } from 'src/app/models/marca';
import { Producto } from 'src/app/models/producto';
import { ProductoLocal } from 'src/app/models/productoLocal';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';
import { Local } from 'src/app/models/local';
import { LocalService } from 'src/app/services/local.service';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';
import { MaterialProducto } from 'src/app/models/materialProducto';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Proveedor } from 'src/app/models/proveedor';

@Component({
  selector: 'app-pagina-varios-productos',
  templateUrl: './pagina-crear-varios-productos.component.html',
  styleUrls: ['./pagina-crear-varios-productos.component.css']
})
export class PaginaCrearVariosProductosComponent implements OnInit {
  categorias:Categoria[]=[];
  selectedCategoriesCheckbox: Categoria[] = [];
  newNameCategoryInput: string = '';

  proveedores:Proveedor[]=[];
  selectedProveedoresCheckbox: Proveedor[] = [];
  newNameProveedorInput: string = '';

  marcas:Marca[]=[];
  marca:Marca=new Marca();
  materialesProducto:MaterialProducto[]=[];
  materialProducto:MaterialProducto=new MaterialProducto();
  locales:Local[]=[];
  localSeleccionado: Local | null = null;
  producto: Producto= new Producto();
  titulo:String ='Crear Producto';
  genero:string='';
  localStocks: { [localId: number]: number } = {}; // Mapa para guardar el stock por local
  localSeleccionados: Set<number> = new Set(); // Conjunto de IDs de locales seleccionados
  isLoading = false; // Variable para la pantalla de carga
  modelos: string[] = ['']; // empieza con un campo
  modelosInvalidos: Set<string> = new Set(); // modelos repetidos
  filtroMarca: string = '';
  filtroProveedor: string = '';



  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private marcaService: MarcaService,
    private materialProductoService: MaterialProductoService,
    private localService: LocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarMarcas();
    this.cargarMaterialProducto();
    this.cargarLocales();
  }

  cargarCategorias() {
    this.categoriaService.getCategories().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  cargarMarcas() {
    this.marcaService.getMarcas().subscribe(marcas => {
      this.marcas = marcas;
    });
  }

  cargarMaterialProducto() {
    this.materialProductoService.getMaterialesProducto().subscribe(materialesProducto => {
      this.materialesProducto = materialesProducto;
    });
  }

  cargarLocales() {
    this.localService.getLocales().subscribe(locales => {
      this.locales = locales;
    });
  }

  validarModelosAntesDeCrear(): void {
    if (!this.marca?.id) {
      Swal.fire('Advertencia', 'Seleccioná una marca antes de validar los modelos.', 'warning');
      return;
    }
  
    const modelosLimpios = this.modelos.map(m => m.trim()).filter(m => m !== '');
  
    // Verificar caracteres inválidos
    const modelosInvalidosCaracteres = modelosLimpios.filter(m =>
      m.includes('.') || m.includes(';') || m.includes('/') || m.includes('\\')
    );
    if (modelosInvalidosCaracteres.length > 0) {
      const lista = modelosInvalidosCaracteres.join(', ');
      Swal.fire('Error', `Los modelos no deben contener punto (.), punto y coma (;), barra (/), ni barra invertida (\\). Revisá: ${lista}`, 'error');
      this.modelosInvalidos = new Set(modelosInvalidosCaracteres.map(m => m.toLowerCase()));
      return;
    }
  
    // Verificar duplicados locales (en el formulario)
    const modelosRepetidos = modelosLimpios.filter((modelo, index, self) =>
      self.findIndex(m => m.toLowerCase() === modelo.toLowerCase()) !== index
    );
  
    if (modelosRepetidos.length > 0) {
      const lista = Array.from(new Set(modelosRepetidos.map(m => m.toLowerCase()))).join(', ');
      Swal.fire('Error', `Tenés modelos repetidos en el formulario: ${lista}`, 'error');
      this.modelosInvalidos = new Set(modelosRepetidos.map(m => m.toLowerCase()));
      return;
    }
  
    // Verificar duplicados contra backend
    const modelosUnicos = Array.from(new Set(modelosLimpios.map(m => m.toLowerCase())));
    this.productoService.validarModelos(modelosUnicos, this.marca.id).subscribe({
      next: (modelosExistentes: string[]) => {
        if (modelosExistentes.length > 0) {
          const lista = modelosExistentes.join(', ');
          Swal.fire('Error', `Ya existen los siguientes modelos para esta marca: ${lista}`, 'error');
          this.modelosInvalidos = new Set(modelosExistentes.map(m => m.toLowerCase()));
        } else {
          this.modelosInvalidos.clear();
          this.crearProducto();
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'Ocurrió un problema al validar los modelos.', 'error');
      }
    });
  }
  

  crearProducto() {
    this.agregarLocalesYStocksAlProducto();
    console.log(this.materialProducto +this.genero) 
    const productos: Producto[] = this.modelos
      .filter(m => m.trim() !== '')
      .map(modelo => {
        const nuevoProducto = new Producto();
        nuevoProducto.modelo = modelo;
        nuevoProducto.descripcion = this.producto.descripcion;
        nuevoProducto.costo = this.producto.costo;
        nuevoProducto.precio = this.producto.precio;
        nuevoProducto.categorias = [...this.selectedCategoriesCheckbox];
        nuevoProducto.proveedores = [...this.selectedProveedoresCheckbox];
        nuevoProducto.genero = this.genero;
        nuevoProducto.marca = this.marca;
        nuevoProducto.material = this.materialProducto?.id ? { id: this.materialProducto.id } as any : null;
        nuevoProducto.productoLocales = this.producto.productoLocales;
        nuevoProducto.creadoEn = new Date();
        nuevoProducto.ultimaActualizacion = new Date();
        return nuevoProducto;
      });
  
    this.isLoading = true;
  
    this.productoService.createVariosProductos(productos).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('PRODUCTOS CREADOS', 'Los productos han sido guardados con éxito!', 'success');
        this.router.navigate(['/inicio']);
      },
      error: (e) => {
        this.isLoading = false;
        Swal.fire('ERROR', e.error.mensaje, 'error');
      }
    });
  }
  

  get marcasFiltradas(): Marca[] {
    if (!this.filtroMarca.trim()) {
      return this.marcas;
    }
    const filtro = this.filtroMarca.toLowerCase();
    return this.marcas.filter(m => m.nombre.toLowerCase().includes(filtro));
  }

  get proveedoresFiltrados(): Proveedor[] {
    if (!this.filtroProveedor.trim()) {
      return this.proveedores;
    }
    const filtro = this.filtroProveedor.toLowerCase();
    return this.proveedores.filter(p => p.nombre.toLowerCase().includes(filtro));
  }
  
  
  selecionMarca(marca:Marca){
    this.marca=marca;
  }

  selecionMaterial(materialProducto:MaterialProducto){
    this.materialProducto=materialProducto;
  }

  selecionLocal(local:Local){
    this.localSeleccionado=local;
  }

  selecionGenero(genero:string){
    this.genero=genero;
  }

  //CATEGORIAS
  isCategorySelectedInCheckBox(categoria: Categoria): boolean {
    return this.selectedCategoriesCheckbox.findIndex(selectedCategoria => selectedCategoria.id === categoria.id) !== -1;
  }
  
  toggleCategorySelection(categoria: Categoria) {
    const esCristal = categoria.nombre.toLowerCase() === 'cristal';
  
    if (esCristal) {
      const yaSeleccionado = this.selectedCategoriesCheckbox.some(c => c.id === categoria.id);

      if (yaSeleccionado) {
        // Si ya estaba seleccionada, la quitamos y dejamos vacío
        this.selectedCategoriesCheckbox = [];
      } else {
        // Si no estaba seleccionada, se selecciona solo "Cristal"
        this.selectedCategoriesCheckbox = [categoria];
      }
    } else {
      // Si había "Cristal", lo eliminamos
      this.selectedCategoriesCheckbox = this.selectedCategoriesCheckbox.filter(c => c.nombre.toLowerCase() !== 'cristal');
    
      // Alternar la categoría actual
      const index = this.selectedCategoriesCheckbox.findIndex(c => c.id === categoria.id);
      if (index === -1) {
        this.selectedCategoriesCheckbox.push(categoria);
      } else {
        this.selectedCategoriesCheckbox.splice(index, 1);
      }
    }    
  }
  

  //Proveedores
  isProveedorSelectedInCheckBox(proveedor: Proveedor): boolean {
    return this.selectedProveedoresCheckbox.findIndex(selectedProveedor => selectedProveedor.id === proveedor.id) !== -1;
  }
  
  toggleProveedorSelection(proveedor: Proveedor) {
    if (this.isProveedorSelectedInCheckBox(proveedor)) {
      this.selectedProveedoresCheckbox = this.selectedProveedoresCheckbox.filter(selectedProveedor => selectedProveedor.id !== proveedor.id); 
    } else {
      this.selectedProveedoresCheckbox.push(proveedor);
    }
  }

  //--------- LOGICA PARA LOCAL Y STOCK--------------
  toggleLocal(local: Local): void {
    if (this.localSeleccionados.has(local.id)) {
      this.localSeleccionados.delete(local.id); // Deseleccionar local
      delete this.localStocks[local.id]; // Eliminar el stock asociado
    } else {
      this.localSeleccionados.add(local.id); // Seleccionar local
      this.localStocks[local.id] = 0; // Inicializar stock con 0
    }
  }

  isLocalSelected(local: Local): boolean {
    return this.localSeleccionados.has(local.id);
  }

  agregarLocalesYStocksAlProducto(): void {
    this.producto.productoLocales = Array.from(this.localSeleccionados).map(localId => {
      const productoLocal = new ProductoLocal();
      const local = this.locales.find(l => l.id === localId);
      productoLocal.local = local!;
      productoLocal.stock = this.localStocks[localId];
      return productoLocal;
    });
  }
  //---------------------------------------------------
  marcaSeleccionado(marca:Marca): boolean {
    if(marca.id==this.marca.id && this.marca!==undefined){
      return true
    }
    return false
  }

  materialProductoSeleccionado(materialProducto:MaterialProducto): boolean {
    if(materialProducto.id==this.materialProducto.id && this.materialProducto!==undefined){
      return true
    }
    return false
  }

  generoSeleccionado(genero:string):boolean{
    if(this.genero==null ){
      return false
    }
    if(this.producto.genero!==undefined){
      if(this.producto.genero.includes(genero) && this.producto.genero!==undefined){
        return true
      }
    }
    return false
  }

  calcularPrecio(costo:number){
    this.producto.precio= ((costo * 0.20)+costo)*3;
  }

  agregarModelo() {
    this.modelos.push('');
  }
  
  eliminarModelo(index: number) {
    this.modelos.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  esSoloCristalSeleccionado(): boolean {
    return this.selectedCategoriesCheckbox.length === 1 &&
           this.selectedCategoriesCheckbox[0].nombre.toLowerCase() === 'cristal';
  }

  hayCategoriasSeleccionadas(): boolean {
    return this.selectedCategoriesCheckbox.length > 0;
  }

}
