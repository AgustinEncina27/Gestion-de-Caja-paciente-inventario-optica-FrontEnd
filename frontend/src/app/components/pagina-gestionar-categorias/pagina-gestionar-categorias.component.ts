import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaDTO } from 'src/app/dto/CategoriaDTO';

@Component({
  selector: 'app-pagina-gestionar-categorias',
  templateUrl: './pagina-gestionar-categorias.component.html',
  styleUrls: ['./pagina-gestionar-categorias.component.css']
})
export class PaginaGestionarCategoriasComponent {
  titulo = 'Administrar Categorías';

  categorias: CategoriaDTO[] = [];
  categoriaSeleccionada: CategoriaDTO | null = null;

  // Form sencillo con solo lo que usa el backend
  form: CategoriaDTO = { nombre: '' };

  constructor(private categoriaService: CategoriaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategories().subscribe(cats => (this.categorias = cats));
  }

  toggleCategorySelection(cat: CategoriaDTO): void {
    this.categoriaSeleccionada = { ...cat };
    this.form = { id: cat.id, nombre: cat.nombre };
  }

  limpiarSeleccion(): void {
    this.categoriaSeleccionada = null;
    this.form = { nombre: '' };
  }

  crearCategoria(): void {
    const nombre = this.form.nombre?.trim();
    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para la categoría', 'warning');
      return;
    }
    this.categoriaService.crearCategoria(nombre).subscribe({
      next: _ => {
        Swal.fire('CATEGORÍA CREADA', 'La categoría fue cargada con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarCategorias();
        this.router.navigate(['/inicio']);
      }
    });
  }

  editarCategoria(): void {
    if (!this.categoriaSeleccionada?.id) {
      Swal.fire('Sin selección', 'Seleccioná una categoría para editar', 'info');
      return;
    }
    const nombre = this.form.nombre?.trim();
    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para la categoría', 'warning');
      return;
    }
    this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.id!, nombre).subscribe({
      next: _ => {
        Swal.fire('CATEGORÍA EDITADA', 'La categoría fue editada con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarCategorias();
        this.router.navigate(['/inicio']);
      }
    });
  }

  eliminarCategoria(): void {
    if (!this.categoriaSeleccionada?.id) {
      Swal.fire('Sin selección', 'Seleccioná una categoría para eliminar', 'info');
      return;
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No puedes revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(this.categoriaSeleccionada!.id!).subscribe({
          next: _ => {
            Swal.fire('CATEGORÍA ELIMINADA', 'La categoría fue eliminada con éxito!', 'success');
            this.limpiarSeleccion();
            this.cargarCategorias();
            this.router.navigate(['/inicio']);
          }
        });
      }
    });
  }
}