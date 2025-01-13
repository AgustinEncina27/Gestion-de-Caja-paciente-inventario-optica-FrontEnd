import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-categorias',
  templateUrl: './pagina-gestionar-categorias.component.html',
  styleUrls: ['./pagina-gestionar-categorias.component.css']
})
export class PaginaGestionarCategoriasComponent {
  titulo:string='Administrar Categorias';
  categoria: Categoria= new Categoria;
  categorias: Categoria[]= [];
  seleccionado = false;
 

  constructor(private categoriaService: CategoriaService,
    private router: Router){}

  ngOnInit(): void {
    this.cargarCategorias()
  }

  cargarCategorias(){
    this.categoriaService.getCategories().subscribe(
      categorias=>{this.categorias=categorias
      }
    )
  }

  toggleCategorySelection(categoria: Categoria) {
    this.categoria = categoria; // Marca el radio button seleccionado
  }
  
  limpiarSeleccion() {
    this.categoria = new Categoria();
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: Element) => {
      (radio as HTMLInputElement).checked = false; // Desmarca todos los radio buttons
    });
  }

  crearCategoria(){
    this.categoriaService.crearCategoria(this.categoria).subscribe( 
      response=>{
        Swal.fire('Categoria Creada/Editada', 'La categoria fue cargada con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  editarCategoria(){
    this.categoriaService.actualizarCategoria(this.categoria).subscribe( 
      response=>{
        Swal.fire('Categoria Editada', 'La categoria fue editada con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  eliminarCategoria(){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No puedes revertir este cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(this.categoria.id).subscribe( 
          response=>{
            Swal.fire('Categoria Eliminada', 'La categoria fue eliminada con éxito!','success')
            this.router.navigate(['/inicio']);
          })
      }
    })
  }
  
}
