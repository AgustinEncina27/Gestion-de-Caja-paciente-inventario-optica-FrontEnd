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
  selector: 'app-pagina-crear-producto',
  templateUrl: './pagina-crear-editar-producto.component.html',
  styleUrls: ['./pagina-crear-editar-producto.component.css']
})
export class PaginaCrearEditarProductoComponent implements OnInit {
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
    this.cargarProducto();
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

  cargarProducto() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.titulo = 'Crear Producto';
      this.producto = new Producto();
      let id: number = +params.get('id')!;
      if (id) {
        this.titulo = 'Editar Producto';
        this.productoService.getProducto(id).subscribe(producto => {
          this.producto = producto;
         
          //Carga la marca en la pagina
          this.marca = producto.marca;

          //Carga el material en la pagina
          this.materialProducto = producto.material;
          
          // Cargar los locales seleccionados y sus stocks
          this.localSeleccionados = new Set(
            producto.productoLocales.map(pl => pl.local.id)
          );
          producto.productoLocales.forEach(pl => {
            this.localStocks[pl.local.id] = pl.stock;
          });
          
          //Carga la categoria en la pagina
          this.selectedCategoriesCheckbox = producto.categorias;

          //Carga la categoria en la pagina
          this.selectedProveedoresCheckbox = producto.proveedores;

          //Carga el genero en la pagina
          this.genero = producto.genero;
        });
      }
    });
  }

  crearProducto() {
    this.agregarLocalesYStocksAlProducto(); // Agregar locales y stocks al producto
    this.producto.categorias = this.selectedCategoriesCheckbox;
    this.producto.proveedores = this.selectedProveedoresCheckbox;
    this.producto.genero = this.genero;
    this.producto.marca = this.marca;
    this.producto.material = this.materialProducto;
    this.producto.creadoEn = new Date();
    this.producto.ultimaActualizacion = new Date();
    
    this.isLoading = true; // Activar pantalla de carga

    this.productoService.createProducto(this.producto).subscribe({
      next: (response) => {
        
        this.isLoading = false; // Desactivar pantalla de carga
        Swal.fire('PRODUCTO CREADO', 'El producto ha sido guardado con éxito!', 'success');
        this.router.navigate(['/inicio']);
        
      },
      error: (e) => {
        this.isLoading = false; // Desactivar pantalla de carga en caso de error
        Swal.fire('ERROR', e.error.mensaje, 'error');
      }
    });
  }
  
  editarProducto() {
    this.agregarLocalesYStocksAlProducto(); // Agregar locales y stocks al producto
    this.producto.categorias = this.selectedCategoriesCheckbox;
    this.producto.proveedores = this.selectedProveedoresCheckbox;
    this.producto.genero = this.genero;
    this.producto.marca = this.marca;
    this.producto.material = this.materialProducto;
    this.producto.ultimaActualizacion = new Date();
    
    this.isLoading = true; // Activar pantalla de carga

    this.productoService.updateProducto(this.producto).subscribe({
        next: (response) => {

        this.isLoading = false; // Desactivar pantalla de carga
        Swal.fire('PRODUCTO EDITADO', 'Se ha editado con éxito!', 'success');
        this.router.navigate(['/inicio']);
      },
      error: (e) => {
        this.isLoading = false; // Desactivar pantalla de carga en caso de error
        Swal.fire('ERROR', e.error.mensaje, 'error');
      }
    });
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
    if (this.isCategorySelectedInCheckBox(categoria)) {
      this.selectedCategoriesCheckbox = this.selectedCategoriesCheckbox.filter(selectedCategory => selectedCategory.id !== categoria.id); 
    } else {
      this.selectedCategoriesCheckbox.push(categoria);
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

}
