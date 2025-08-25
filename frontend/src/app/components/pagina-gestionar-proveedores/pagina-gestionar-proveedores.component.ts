import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProveedorDTO } from 'src/app/dto/ProveedorDTO';

@Component({
  selector: 'app-pagina-gestionar-proveedores',
  templateUrl: './pagina-gestionar-proveedores.component.html',
  styleUrls: ['./pagina-gestionar-proveedores.component.css']
})
export class PaginaGestionarProveedoresComponent {
  titulo = 'Administrar Proveedores';

  proveedores: ProveedorDTO[] = [];
  proveedorSeleccionado: ProveedorDTO | null = null;

  // Form simple con lo que necesita el backend
  form: ProveedorDTO = { nombre: '', celular: '' };

  constructor(private proveedorSrv: ProveedorService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorSrv.getProveedores().subscribe(list => (this.proveedores = list));
  }

  toggleProveedorSelection(p: ProveedorDTO): void {
    this.proveedorSeleccionado = { ...p };
    this.form = { id: p.id, nombre: p.nombre, celular: p.celular ?? '' };
  }

  limpiarSeleccion(): void {
    this.proveedorSeleccionado = null;
    this.form = { nombre: '', celular: '' };
    document.querySelectorAll('input[type="radio"]').forEach(r => ((r as HTMLInputElement).checked = false));
  }

  crearProveedor(): void {
    const nombre = this.form.nombre?.trim();
    const celular = this.form.celular?.trim() || null;

    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para el proveedor', 'warning');
      return;
    }
    if (celular && celular.length > 20) {
      Swal.fire('Celular inválido', 'El celular no puede superar 20 caracteres', 'warning');
      return;
    }

    this.proveedorSrv.crearProveedor(nombre, celular).subscribe({
      next: _ => {
        Swal.fire('PROVEEDOR CREADO', 'El proveedor fue cargado con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarProveedores();
        this.router.navigate(['/inicio']);
      }
    });
  }

  editarProveedor(): void {
    if (!this.proveedorSeleccionado?.id) {
      Swal.fire('Sin selección', 'Seleccioná un proveedor para editar', 'info');
      return;
    }
    const nombre = this.form.nombre?.trim();
    const celular = this.form.celular?.trim() || null;

    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para el proveedor', 'warning');
      return;
    }
    if (celular && celular.length > 20) {
      Swal.fire('Celular inválido', 'El celular no puede superar 20 caracteres', 'warning');
      return;
    }

    this.proveedorSrv.actualizarProveedor(this.proveedorSeleccionado.id!, nombre, celular).subscribe({
      next: _ => {
        Swal.fire('PROVEEDOR EDITADO', 'El proveedor fue editado con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarProveedores();
        this.router.navigate(['/inicio']);
      }
    });
  }

  eliminarProveedor(): void {
    if (!this.proveedorSeleccionado?.id) {
      Swal.fire('Sin selección', 'Seleccioná un proveedor para eliminar', 'info');
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
        this.proveedorSrv.eliminarProveedor(this.proveedorSeleccionado!.id!).subscribe({
          next: _ => {
            Swal.fire('PROVEEDOR ELIMINADO', 'El proveedor fue eliminado con éxito!', 'success');
            this.limpiarSeleccion();
            this.cargarProveedores();
            this.router.navigate(['/inicio']);
          }
        });
      }
    });
  }
}
