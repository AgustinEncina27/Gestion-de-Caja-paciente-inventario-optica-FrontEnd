import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { URL_BACKEND } from 'src/app/config/config';
import { Local } from 'src/app/models/local';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import { LocalService } from 'src/app/services/local.service';
import { Graduacion } from 'src/app/models/graduacion';
import { FichaGraduacion } from 'src/app/models/fichaGraducacion';



@Component({
  selector: 'app-pagina-crear-paciente',
  templateUrl: './pagina-crear-editar-paciente.component.html',
  styleUrls: ['./pagina-crear-editar-paciente.component.css']
})
export class PaginaCrearEditarPacienteComponent implements OnInit {

  paciente: Paciente = new Paciente();
  titulo: string = 'Crear Paciente';
  locales: Local[] = [];
  local: Local = new Local();
  genero: string = '';
  URL_BACKEND: string = URL_BACKEND;
  isLoading = false;
  mostrarFicha: boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private activatedRoute: ActivatedRoute,
    private localService: LocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPaciente();
    this.cargarLocales();
  }

  cargarPaciente() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.titulo = 'Crear Paciente';
      this.paciente = new Paciente();

      let id: number = +params.get('id')!;
      if (id) {
        this.titulo = 'Editar Paciente';
        this.pacienteService.getPaciente(id).subscribe(paciente => {
          this.paciente = paciente;
          this.local = this.paciente.local;
          this.genero = this.paciente.genero;
        });
      }
    });
  }

  cargarLocales() {
    this.localService.getLocales().subscribe(locales => {
      this.locales = locales;
    });
  }

  crearPaciente() {
    this.paciente.local = this.local;
    this.paciente.genero = this.genero;
    this.paciente.creadoEn = new Date();
    this.paciente.ultimaActualizacion = new Date();
    this.isLoading = true;

    this.pacienteService.createPaciente(this.paciente).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.paciente = response;
        this.paciente.local = this.local;
        this.paciente.genero = this.genero;
        Swal.fire("PACIENTE CREADO", "El paciente ha sido guardado con éxito!", "success");
        this.router.navigate(['/crearMovimiento/'+this.paciente.id]);
      },
      error: (e) => {
        this.isLoading = false;
        Swal.fire('ERROR', e.error.mensaje, 'error');
      }
    });
  }

  editarPaciente() {
    this.paciente.local = this.local;
    this.paciente.genero = this.genero;
    this.paciente.ultimaActualizacion = new Date();

    this.isLoading = true;

    this.pacienteService.updatePaciente(this.paciente).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.paciente = response;
        this.paciente.local = this.local;
        this.paciente.genero = this.genero;
        Swal.fire("PACIENTE EDITADO", "Se ha editado con éxito!", "success");
        this.router.navigate(['/crearMovimiento/'+this.paciente.id]);
      },
      error: (e) => {
        this.isLoading = false;
        Swal.fire('ERROR', e.error.mensaje, 'error');
      }
    });
  }

  selecionLocal(local: Local) {
    this.local = local;
  }

  selecionGenero(genero: string) {
    this.genero = genero;
  }

  localSeleccionado(local: Local): boolean {
    return this.local?.id === local.id;
  }

  generoSeleccionado(genero: string): boolean {
    return this.genero === genero;
  }

  // 🔽 FICHAS DE GRADUACIÓN 🔽
  agregarFicha() {
    const nuevaFicha = new FichaGraduacion();
    nuevaFicha.fecha = new Date().toISOString().slice(0, 10);
    nuevaFicha.graduaciones = [
      { ojo: 'DERECHO', esferico: 0, cilindrico: 0, eje: 0, adicion: 0, cerca: 0 },
      { ojo: 'IZQUIERDO', esferico: 0, cilindrico: 0, eje: 0, adicion: 0, cerca: 0 }
    ];

    nuevaFicha.cristales = [];
    this.paciente.historialFichas.push(nuevaFicha);
  }

  eliminarGraduacion(ficha: FichaGraduacion, index: number) {
    ficha.graduaciones.splice(index, 1);
  }

  calcularCerca(graduacion: Graduacion) {
    graduacion.cerca = (graduacion.esferico || 0) + (graduacion.adicion || 0);
  }

  confirmarEliminarUltimaFicha(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará la última ficha de graduación del historial.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUltimaFicha();
        Swal.fire('Eliminado', 'La última ficha fue eliminada.', 'success');
      }
    });
  }
  
  eliminarUltimaFicha(): void {
    this.paciente.historialFichas.pop();
  }

  agregarCristal(ficha: FichaGraduacion) {
    ficha.cristales?.push({
      nombre: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  }
}
