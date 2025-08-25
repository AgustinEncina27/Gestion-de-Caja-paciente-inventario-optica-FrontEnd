import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { URL_BACKEND } from 'src/app/config/config';
import { PacienteService } from 'src/app/services/paciente.service';
import { PacienteDTO } from 'src/app/dto/PacienteDTO';

@Component({
  selector: 'app-listar-paciente',
  templateUrl: './listar-paciente.component.html',
  styleUrls: ['./listar-paciente.component.css']
})
export class ListarPacienteComponent {
  pacientes: PacienteDTO[] = [];
  nombre: string = '';
  documento: string = '';
  paginador: any;
  pages: number[] = []; // páginas visibles del paginador
  busquedaPorNombre: boolean = false;
  busquedaPorDocumento: boolean = false;
  URL_BACKEND: string = URL_BACKEND;

  constructor(
    private pacienteService: PacienteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  eliminarPaciente(pacienteAEliminar: PacienteDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No puedes revertir este cambio',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed && pacienteAEliminar.id != null) {
        this.pacienteService.deletePaciente(pacienteAEliminar.id).subscribe({
          next: () => {
            Swal.fire('PACIENTE ELIMINADO', 'El paciente ha sido eliminado con éxito!', 'success');
            // recargar la misma página actual
            this.cambiarPagina(this.paginador?.number ?? 0);
          }
        });
      }
    });
  }

  // ------- Carga general -------
  cargarPacientes(page: number = 0) {
    this.busquedaPorNombre = false;
    this.busquedaPorDocumento = false;

    this.pacienteService.getPacientes(page).subscribe({
      next: (response) => {
        this.pacientes = response.content as PacienteDTO[];
        this.paginador = response;
        this.generarPaginador(response['totalPages']);
      },
      error: (error) => {
        Swal.fire('ERROR', 'Hubo un problema al cargar los pacientes.', 'error');
        console.error(error);
      }
    });
  }

  // ------- Búsquedas -------
  buscarPorNombre() {
    if (!this.nombre) return;

    this.busquedaPorNombre = true;
    this.busquedaPorDocumento = false;

    this.pacienteService.getPacientesPorNombre(this.nombre, 0).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.pacientes = response.content as PacienteDTO[];
          this.paginador = response;
          this.generarPaginador(response['totalPages']);
        } else {
          this.pacientes = [];
          Swal.fire('SIN RESULTADOS', 'No se encontraron pacientes con ese nombre.', 'info');
        }
      },
      error: (error) => {
        Swal.fire('ERROR', 'Hubo un problema al realizar la búsqueda.', 'error');
        console.error(error);
      }
    });
  }

  buscarPorDocumento() {
    if (!this.documento) return;

    this.busquedaPorNombre = false;
    this.busquedaPorDocumento = true;

    this.pacienteService.getPacientesPorDocumento(this.documento, 0).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.pacientes = response.content as PacienteDTO[];
          this.paginador = response;
          this.generarPaginador(response['totalPages']);
        } else {
          this.pacientes = [];
          Swal.fire('SIN RESULTADOS', 'No se encontraron pacientes con ese documento.', 'info');
        }
      },
      error: (error) => {
        Swal.fire('ERROR', 'Hubo un problema al realizar la búsqueda.', 'error');
        console.error(error);
      }
    });
  }

  // ------- Paginación -------
  paginaAnterior() {
    const actual = this.paginador?.number ?? 0;
    if (actual > 0) this.cambiarPagina(actual - 1);
  }

  paginaSiguiente() {
    const actual = this.paginador?.number ?? 0;
    const total = this.paginador?.totalPages ?? 1;
    if (actual < total - 1) this.cambiarPagina(actual + 1);
  }

  cambiarPagina(page: number) {
    if (!this.paginador || page < 0 || page >= this.paginador.totalPages) return;

    if (this.busquedaPorNombre) {
      this.pacienteService.getPacientesPorNombre(this.nombre, page).subscribe((response) => {
        this.pacientes = response.content as PacienteDTO[];
        this.paginador = response;
        this.generarPaginador(response['totalPages']);
      });
      return;
    }

    if (this.busquedaPorDocumento) {
      this.pacienteService.getPacientesPorDocumento(this.documento, page).subscribe((response) => {
        this.pacientes = response.content as PacienteDTO[];
        this.paginador = response;
        this.generarPaginador(response['totalPages']);
      });
      return;
    }

    // sin filtros
    this.cargarPacientes(page);
  }

  generarPaginador(totalPages: number) {
    const maxVisible = 5;
    const currentPage = this.paginador.number;

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 0);
    let end = start + maxVisible;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible, 0);
    }

    this.pages = Array.from({ length: end - start }, (_, i) => start + i);
  }

  // ------- Util -------
  limpiarFiltros() {
    this.nombre = '';
    this.documento = '';
    this.busquedaPorNombre = false;
    this.busquedaPorDocumento = false;
    this.cargarPacientes(0);
  }

  trackById(index: number, item: PacienteDTO): number {
    return item.id ?? index; // fallback por si viniera sin id
  }
}
