import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { URL_BACKEND } from 'src/app/config/config';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-listar-paciente',
  templateUrl: './listar-paciente.component.html',
  styleUrls: ['./listar-paciente.component.css']
})
export class ListarPacienteComponent {
 pacientes: Paciente[] = [];
 paciente:Paciente= new Paciente();
 nombre:string='';
 documento:string='';
 paginador: any;
 pages: number[] = []; // Array para el paginador
 busquedaPorNombre: boolean = false; // Indica si se está buscando por nombre
 busquedaPorDocumento: boolean = false; // Indica si se está buscando por documento
 URL_BACKEND: string=URL_BACKEND;

 constructor(private pacienteService: PacienteService,
  private activateRoute: ActivatedRoute,
  public authService: AuthService,
  private router: Router){
  }

  ngOnInit(): void{
    this.cargarPacientes();
  }

  eliminarPaciente(pacienteAEliminar:Paciente){
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
        this.pacienteService.deletePaciente(pacienteAEliminar.id).subscribe(
          response=>{
            Swal.fire(
              'PACIENTE ELIMINADO','El paciente ha sido eliminado con éxito!','success'
            )
            this.cargarPacientes();
          }
        )
        
      }
    })
  }

  cargarPacientes(page: number = 0) {
    this.pacienteService.getPacientes(page).subscribe({
      next: response => {
        this.pacientes = response.content as Paciente[];
        this.paginador = response;
        this.generarPaginador(response.totalPages); // Actualiza el paginador
      },
      error: error => {
        Swal.fire('ERROR', 'Hubo un problema al cargar los pacientes.', 'error');
        console.error(error);
      },
      complete: () => {
        console.log('Carga de pacientes completada.');
      }
    });
  }
  
  

  buscarPorNombre() {
    this.busquedaPorNombre = true;
    this.busquedaPorDocumento = false;
  
    this.pacienteService.getPacientesPorNombre(this.nombre, 0).subscribe({
      next: response => {
        if (response && response.content) {
          this.pacientes = response.content as Paciente[];
          this.paginador = response;
          this.generarPaginador(response.totalPages); // Actualiza el paginador
        } else {
          Swal.fire('SIN RESULTADOS', 'No se encontraron pacientes con ese nombre.', 'info');
        }
      },
      error: error => {
        Swal.fire('ERROR', 'Hubo un problema al realizar la búsqueda.', 'error');
        console.error(error);
      }
    });
  }
  
  buscarPorDocumento() {
    this.busquedaPorNombre = false;
    this.busquedaPorDocumento = true;
  
    this.pacienteService.getPacientesPorDocumento(this.documento, 0).subscribe({
      next: response => {
        if (response && response.content) {
          this.pacientes = response.content as Paciente[];
          this.paginador = response;
          this.generarPaginador(response.totalPages); // Actualiza el paginador
        } else {
          Swal.fire('SIN RESULTADOS', 'No se encontraron pacientes con ese documento.', 'info');
        }
      },
      error: error => {
        Swal.fire('ERROR', 'Hubo un problema al realizar la búsqueda.', 'error');
        console.error(error);
      }
    });
  }
  
  paginaAnterior() {
    const paginaActual = this.paginador.number;
    if (paginaActual > 0) {
      this.buscarPorNombre(); // O buscarPorDocumento()
    }
  }
  
  paginaSiguiente() {
    const paginaActual = this.paginador.number;
    if (paginaActual < this.paginador.totalPages - 1) {
      this.buscarPorNombre(); // O buscarPorDocumento()
    }
  }
  
  cambiarPagina(page: number) {
    if (this.busquedaPorNombre) {
      // Filtrado por nombre
      this.pacienteService.getPacientesPorNombre(this.nombre, page).subscribe(response => {
        this.pacientes = response.content as Paciente[];
        this.paginador = response;
        this.generarPaginador(response.totalPages); // Actualiza el paginador
      });
    } else if (this.busquedaPorDocumento) {
      // Filtrado por documento
      this.pacienteService.getPacientesPorDocumento(this.documento, page).subscribe(response => {
        this.pacientes = response.content as Paciente[];
        this.paginador = response;
        this.generarPaginador(response.totalPages); // Actualiza el paginador
      });
    } else {
      // Sin filtros, cargar todos los pacientes
      this.cargarPacientes(page);
    }
  }
  
  
  generarPaginador(totalPages: number) {
    this.pages = Array.from({ length: totalPages }, (_, i) => i); // Crea el array de páginas
  }

  limpiarFiltros() {
    this.nombre = '';
    this.documento = '';
    this.cargarPacientes(); // Vuelve a cargar todos los pacientes sin filtros
  }
  
}
