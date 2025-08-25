import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MarcaService } from 'src/app/services/marca.service';
import { MarcaDTO } from 'src/app/dto/MarcaDTO';

@Component({
  selector: 'app-pagina-gestionar-marcas',
  templateUrl: './pagina-gestionar-marcas.component.html',
  styleUrls: ['./pagina-gestionar-marcas.component.css']
})
export class PaginaGestionarMarcasComponent {
  titulo = 'Administrar Marcas';

  marcas: MarcaDTO[] = [];
  marcaSeleccionada: MarcaDTO | null = null;

  // Form liviano: exactamente lo que pide el backend
  form: MarcaDTO = { nombre: '' };

  constructor(private marcaSrv: MarcaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.marcaSrv.getMarcas().subscribe(list => (this.marcas = list));
  }

  toggleMarcaSelection(m: MarcaDTO): void {
    this.marcaSeleccionada = { ...m };
    this.form = { id: m.id, nombre: m.nombre };
  }

  limpiarSeleccion(): void {
    this.marcaSeleccionada = null;
    this.form = { nombre: '' };
    document.querySelectorAll('input[type="radio"]').forEach(r => ((r as HTMLInputElement).checked = false));
  }

  crearMarca(): void {
    const nombre = this.form.nombre?.trim();
    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para la marca', 'warning');
      return;
    }
    this.marcaSrv.crearMarca(nombre).subscribe({
      next: _ => {
        Swal.fire('MARCA CREADA', 'La marca fue cargada con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarMarcas();
        this.router.navigate(['/inicio']);
      }
    });
  }

  editarMarca(): void {
    if (!this.marcaSeleccionada?.id) {
      Swal.fire('Sin selección', 'Seleccioná una marca para editar', 'info');
      return;
    }
    const nombre = this.form.nombre?.trim();
    if (!nombre) {
      Swal.fire('Falta nombre', 'Ingresá un nombre para la marca', 'warning');
      return;
    }
    this.marcaSrv.actualizarMarca(this.marcaSeleccionada.id!, nombre).subscribe({
      next: _ => {
        Swal.fire('MARCA EDITADA', 'La marca fue editada con éxito!', 'success');
        this.limpiarSeleccion();
        this.cargarMarcas();
        this.router.navigate(['/inicio']);
      }
    });
  }

  eliminarMarca(): void {
    if (!this.marcaSeleccionada?.id) {
      Swal.fire('Sin selección', 'Seleccioná una marca para eliminar', 'info');
      return;
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No puedes revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.marcaSrv.eliminarMarca(this.marcaSeleccionada!.id!).subscribe({
          next: _ => {
            Swal.fire('MARCA ELIMINADA', 'La marca fue eliminada con éxito!', 'success');
            this.limpiarSeleccion();
            this.cargarMarcas();
            this.router.navigate(['/inicio']);
          }
        });
      }
    });
  }
}
