import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { Local } from 'src/app/models/local';
import { Marca } from 'src/app/models/marca';
import { Producto } from 'src/app/models/producto';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ExcelService } from 'src/app/services/excel.service';
import { LocalService } from 'src/app/services/local.service';
import { MarcaService } from 'src/app/services/marca.service';
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
 url:string='';
 modeloSeleccionado: string = ''; // Código del modelo ingresado
 locales: Local[] = [];
 localSeleccionado: number | null = null;

 constructor(private productoService: ProductoService,
  private activateRoute: ActivatedRoute,
  public authService: AuthService,
  private localService: LocalService,
  private excelService: ExcelService,
  private categoriaService:CategoriaService,
  private marcaService:MarcaService,
  private router: Router){
  }

  ngOnInit(): void{
    this.cargarUrlActual();
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
    this.cargarProductoModal();
    this.cargarLocales();
  }

  cargarUrlActual(){
    this.activateRoute.url.subscribe((segments) => {
      this.url = '/' + segments.map((segment) => segment.path).join('/');
    });
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

  cargarCategorias(){

    this.categoriaService.getCategories().subscribe(
      categorias=>{
        this.categoria.id=0
        this.categoria.nombre="Todas"
        this.categorias=categorias
        this.categorias.unshift(this.categoria);
      }
    )
  }

  cargarMarcas(){
    this.marcaService.getMarcas().subscribe(
      marcas=>{
        this.marca.id=0
        this.marca.nombre="Todas"
        this.marcas=marcas
        this.marcas.unshift(this.categoria);
      }
    )
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

  cargarProductoPorGenero(genero: string){
    this.genero=genero;
    if(this.url.includes("inicio")){
      this.router.navigate(['inicio/page/'+this.genero+'/'+this.marcaId+'/'+this.categoriaId+'/'+0]);
    }else{
      this.router.navigate(['producto/page/'+this.genero+'/'+this.marcaId+'/'+this.categoriaId+'/'+0]);
    }
  }

  cargarProductoPorMarca(marcaId: number){
    if(marcaId==0){
      this.marcaId=-1
    }else{
      this.marcaId=marcaId;
    }
    if(this.url.includes("inicio")){
      this.router.navigate(['inicio/page/'+this.genero+'/'+this.marcaId+'/'+this.categoriaId+'/'+0]);
    }else{
      this.router.navigate(['producto/page/'+this.genero+'/'+this.marcaId+'/'+this.categoriaId+'/'+0]);
    } 
  }
  
  cargarProductoPorCategoria(categoriaId: number){
    if(categoriaId==0){
      this.categoriaId=-1
    }else{
      this.categoriaId=categoriaId;
    }  
    if(this.url.includes("inicio")){
      this.router.navigate(['inicio/page/'+this.genero+'/'+this.marcaId+'/'+this.categoriaId+'/'+0]);
    }else{
      this.router.navigate(['producto/page/'+this.genero+'/'+this.marcaId+'/'+this.categoriaId+'/'+0]);
    }
  }

  cargarProductos(){
    this.activateRoute.paramMap.subscribe(params=>{
      let page: number = +params.get('page')!;
      if (params?.get('marca') !== null && params?.get('marca') !== undefined && !params?.get('marca')?.includes('0') && !params?.get('genero')?.includes('0') && !params?.get('categoria')?.includes('0')) {
        this.genero= params.get('genero')!;
        this.marcaId= +params.get('marca')!;
        this.categoriaId= +params.get('categoria')!;
      }
      if(!page){
        page=0;
      }
      if(this.categoriaId==-1 && this.marcaId==-1 && this.genero.includes('-1')){
        this.productoService.getProductos(page).subscribe(
          response=> {
            this.productos= (response.content as Producto[])
            this.paginador= response;
          }
        )
      }else{
        this.productoService.getProductosByGeneroAndMarcaAndCategoria(this.genero,this.marcaId,this.categoriaId,page).subscribe(
          response=> {
            this.productos= (response.content as Producto[])
            this.paginador= response;
          }
        )
      }
      })
  }

  generoEstaTildado(genero:string):boolean{
    if(this.genero.includes(genero)){
      return true
    }
    
    return false
  }

  categoriaEstaTildado(categoria:number):boolean{
    if(this.categoriaId==categoria){
      return true
    }
    return false
  }

  marcaEstaTildado(marca:number):boolean{
    if(this.marcaId == marca){
      return true
    }
    return false
  }

  buscarProductoPorModelo(): void {
    if (this.modeloSeleccionado.trim() === '') {
      Swal.fire('ERROR', 'Debes ingresar un código de modelo válido', 'warning');
      return;
    }
  
    this.productoService.getProductosPorModelo(this.modeloSeleccionado).subscribe({
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

  limpiarFiltros() {
    this.modeloSeleccionado='';
    this.cargarProductos()
  }

  generarStockLocal(): void {
    if (this.localSeleccionado === null) {
      Swal.fire('ERROR', 'Por favor selecciona un local', 'warning');
      return;
    }

    this.excelService.generarExcelStock(this.localSeleccionado).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Stock_Local_${this.localSeleccionado}.xlsx`;
        link.click();
        Swal.fire('ÉXITO', 'Excel generado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al generar el Excel:', err);
        Swal.fire('ERROR', 'No se pudo generar el Excel', 'error');
      },
    });
  }

}
