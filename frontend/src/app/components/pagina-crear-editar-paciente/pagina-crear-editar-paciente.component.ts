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
        console.log(paciente);
        this.paciente = paciente;
        this.ordenarHistorialFichas();
        this.local = this.paciente.local;
        this.genero = this.paciente.genero;

        // Validar arrays y ordenar graduaciones
        for (const ficha of this.paciente.historialFichas) {
          if (!ficha.graduaciones) ficha.graduaciones = [];
          if (!ficha.cristales) ficha.cristales = [];

          this.ordenarGraduaciones(ficha);
        }
      });
    }
  });
}

  cargarLocales() {
    this.localService.getLocales().subscribe(locales => {
      this.locales = locales;
    });
  }

  getGraduacionesPorTipo(ficha: FichaGraduacion, tipo: 'LEJOS' | 'CERCA') {
    return (ficha.graduaciones || []).filter(g => g.tipo === tipo);
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
      { ojo: 'DERECHO', tipo: 'LEJOS', esferico: 0, cilindrico: 0, eje: 0 },
      { ojo: 'IZQUIERDO', tipo: 'LEJOS', esferico: 0, cilindrico: 0, eje: 0 },
      { ojo: 'DERECHO', tipo: 'CERCA', esferico: 0, cilindrico: 0, eje: 0 },
      { ojo: 'IZQUIERDO', tipo: 'CERCA', esferico: 0, cilindrico: 0, eje: 0 }
    ];
    nuevaFicha.cristales = [];
    this.ordenarGraduaciones(nuevaFicha);
    this.paciente.historialFichas.push(nuevaFicha);
  
    this.ordenarHistorialFichas();
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
    if (this.paciente.historialFichas.length === 0) return;
  
    // Buscar la ficha con la fecha más reciente
    let indexMasReciente = 0;
    let fechaMasReciente = new Date(this.paciente.historialFichas[0].fecha ?? '').getTime();
  
    this.paciente.historialFichas.forEach((ficha, index) => {
      const fechaActual = new Date(ficha.fecha ?? '').getTime();
      if (fechaActual > fechaMasReciente) {
        fechaMasReciente = fechaActual;
        indexMasReciente = index;
      }
    });
  
    // Eliminar la ficha más reciente
    this.paciente.historialFichas.splice(indexMasReciente, 1);
  }

  agregarCristal(ficha: FichaGraduacion) {
    ficha.cristales?.push({
      nombre: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  }

  normalizarNumero(obj: any, campo: string): void {
    const valor = obj[campo];
    if (typeof valor === 'string') {
      const normalizado = parseFloat(valor.replace('+', '').trim());
      obj[campo] = isNaN(normalizado) ? null : normalizado;
    }
  }

  formatearConSigno(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor)) return '';
    return valor > 0 ? `+${valor}` : `${valor}`;
  }
  
  actualizarConSigno(event: Event, objeto: any, campo: string): void {
    const input = (event.target as HTMLInputElement).value;
    const limpio = input.replace(/\s+/g, '').replace(',', '.');
    const parseado = parseFloat(limpio.replace('+', ''));
  
    // Guardar el número sin el signo (pero lo mostramos con signo si es necesario)
    objeto[campo] = isNaN(parseado) ? null : parseado;
  }
  
  
  parsearValorNumerico(valor: string): number | null {
    const limpio = valor.replace('+', '').replace(',', '.').trim();
    const num = parseFloat(limpio);
    return isNaN(num) ? null : num;
  }

  ordenarGraduaciones(ficha: FichaGraduacion) {
    ficha.graduaciones.sort((a, b) => {
      if (a.tipo === b.tipo) {
        if (a.ojo === 'DERECHO') return -1;
        if (b.ojo === 'DERECHO') return 1;
        return 0;
      }
      return a.tipo === 'LEJOS' ? -1 : 1;
    });
  }

  actualizarAdicionYRecalcularCerca(event: Event, ficha: FichaGraduacion, ojo: 'DERECHO' | 'IZQUIERDO'): void {
    const input = (event.target as HTMLInputElement).value;
    const valor = this.parsearValorNumerico(input);
  
    // Guardar la adición
    if (ojo === 'DERECHO') {
      ficha.adicionDerecho = valor;
    } else {
      ficha.adicionIzquierdo = valor;
    }
  
    // Buscar las graduaciones
    const lejos = ficha.graduaciones.find(g => g.ojo === ojo && g.tipo === 'LEJOS');
    const cerca = ficha.graduaciones.find(g => g.ojo === ojo && g.tipo === 'CERCA');
  
    if (lejos && cerca) {
      if (typeof valor === 'number' && typeof lejos.esferico === 'number' && valor !== 0) {
        cerca.esferico = parseFloat((lejos.esferico + valor).toFixed(2));
      } else {
        // Si valor no es número o es 0, se asigna 0
        cerca.esferico = 0;
      }
    }
  }

  actualizarEsfericoLejosYRecalcularCerca(event: Event, ficha: FichaGraduacion, grad: Graduacion): void {
    const input = (event.target as HTMLInputElement).value;
    const esf = this.parsearValorNumerico(input);
    if (typeof esf === 'number') {
      grad.esferico = esf;
    }
  
    const ojo = grad.ojo;
    const adicion = ojo === 'DERECHO' ? ficha.adicionDerecho : ficha.adicionIzquierdo;
    let cerca = ficha.graduaciones.find(g => g.ojo === ojo && g.tipo === 'CERCA');
  
    if (typeof adicion === 'number') {
      if (adicion !== 0 && typeof esf === 'number') {
        if (!cerca) {
          // Si no existe, la creamos
          cerca = {
            ojo,
            tipo: 'CERCA',
            esferico: 0,
            cilindrico: 0,
            eje: 0
          };
          ficha.graduaciones.push(cerca);
        }
        cerca.esferico = parseFloat((esf + adicion).toFixed(2));
      } else if (adicion === 0) {
        // Si la adición es cero, aseguramos que exista una cerca con esférico en 0
        if (!cerca) {
          cerca = {
            ojo,
            tipo: 'CERCA',
            esferico: 0,
            cilindrico: 0,
            eje: 0
          };
          ficha.graduaciones.push(cerca);
        } else {
          cerca.esferico = 0;
        }
      }
    }
  }

  ordenarHistorialFichas() {
    this.paciente.historialFichas.sort((a, b) => {
      const fechaA = new Date(a.fecha ?? '').getTime();
      const fechaB = new Date(b.fecha ?? '').getTime();
  
      if (fechaA !== fechaB) {
        return fechaB - fechaA; // orden descendente por fecha
      }
  
      // Si las fechas son iguales, ordenar por ID (mayor primero)
      const idA = a.id ?? 0;
      const idB = b.id ?? 0;
      return idB - idA;
    });
  }

}
