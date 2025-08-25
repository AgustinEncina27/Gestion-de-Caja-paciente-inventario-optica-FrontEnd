import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialProductoDTO } from 'src/app/dto/MaterialProductoDTO';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-material-producto',
  templateUrl: './pagina-gestionar-material-producto.component.html',
  styleUrls: ['./pagina-gestionar-material-producto.component.css']
})
export class PaginaGestionarMaterialProductoComponent {
  titulo = 'Administrar Materiales';

  materiales: MaterialProductoDTO[] = [];
  materialSeleccionado: MaterialProductoDTO | null = null;

  // form simple: solo lo que pide el backend
  form: MaterialProductoDTO = { nombre: '' };

  constructor(private materialSrv: MaterialProductoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.materialSrv.getMateriales().subscribe(list => this.materiales = list);
  }

  toggleMaterialProductoSelection(mat: MaterialProductoDTO): void {
    this.materialSeleccionado = { ...mat };
    this.form = { id: mat.id, nombre: mat.nombre };
  }

  limpiarSeleccion(): void {
    this.materialSeleccionado = null;
    this.form = { nombre: '' };
    document.querySelectorAll('input[type="radio"]').forEach(r => ((r as HTMLInputElement).checked = false));
  }

  crearMaterialProducto(): void {
    const nombre = this.form.nombre?.trim();
    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para el material', 'warning');
      return;
    }
    this.materialSrv.crear(nombre).subscribe({
      next: _ => {
        Swal.fire('MATERIAL CREADO', 'El material fue cargado con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarMateriales();
        this.router.navigate(['/inicio']);
      }
    });
  }

  editarMaterialProducto(): void {
    if (!this.materialSeleccionado?.id) {
      Swal.fire('Sin selección', 'Seleccioná un material para editar', 'info');
      return;
    }
    const nombre = this.form.nombre?.trim();
    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para el material', 'warning');
      return;
    }
    this.materialSrv.actualizar(this.materialSeleccionado.id!, nombre).subscribe({
      next: _ => {
        Swal.fire('MATERIAL EDITADO', 'El material fue editado con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarMateriales();
        this.router.navigate(['/inicio']);
      }
    });
  }

  eliminarMaterialProducto(): void {
    if (!this.materialSeleccionado?.id) {
      Swal.fire('Sin selección', 'Seleccioná un material para eliminar', 'info');
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
        this.materialSrv.eliminar(this.materialSeleccionado!.id!).subscribe({
          next: _ => {
            Swal.fire('MATERIAL ELIMINADO', 'El material fue eliminado con éxito!', 'success');
            this.limpiarSeleccion();
            this.cargarMateriales();
            this.router.navigate(['/inicio']);
          }
        });
      }
    });
  }
}