import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PacienteService } from 'src/app/services/paciente.service';

import { PacienteDTO } from 'src/app/dto/PacienteDTO';
import { PacienteUpsertDTO } from 'src/app/dto/PacienteUpsertDTO';

import {
  FichaGraduacionDTO,
  FichaGraduacionUpsertDTO,
  GraduacionUpsertDTO,
  CristalUpsertDTO,
} from 'src/app/dto/ficha-graduacion.dto';

import { from, of } from 'rxjs';
import { concatMap, last, map } from 'rxjs/operators';
import { FichaGraduacionService } from 'src/app/services/FichaGraduacionService';

// ===== Tipos de apoyo para el formulario (UI) =====
type Ojo = 'DERECHO' | 'IZQUIERDO';
type TipoGraduacion = 'LEJOS' | 'CERCA';

interface GradForm {
  id?: number;
  ojo: Ojo;
  tipo: TipoGraduacion;
  esferico?: number | null;
  cilindrico?: number | null;
  eje?: number | null;
}

interface CristalForm {
  id?: number;
  nombre: string;
  fecha: string; // yyyy-MM-dd
}

interface FichaForm {
  id?: number;
  fecha?: string | null;

  dnpDerecho?: number | null;
  dnpIzquierdo?: number | null;
  alturaPupilarDerecho?: number | null;
  alturaPupilarIzquierdo?: number | null;
  alturaPelicula?: number | null;

  puente?: number | null;
  diagonalMayor?: number | null;
  largo?: number | null;
  alturaArmazon?: number | null;

  adicionDerecho?: number | null;
  adicionIzquierdo?: number | null;

  graduaciones: GradForm[];
  cristales: CristalForm[];
}

interface PacienteForm {
  id?: number;
  ficha?: number;

  nombreCompleto: string;
  direccion?: string;
  obraSocial?: string;
  observaciones?: string;

  celular?: string;
  genero?: string;

  documento?: string;
  cuit?: string;
  condicionIva?: string;  // enum string
  tipoDocumento?: string; // enum string

  correo?: string;
  medico?: string;

  historialFichas: FichaForm[];
}

@Component({
  selector: 'app-pagina-crear-paciente',
  templateUrl: './pagina-crear-editar-paciente.component.html',
  styleUrls: ['./pagina-crear-editar-paciente.component.css']
})
export class PaginaCrearEditarPacienteComponent implements OnInit {

  titulo = 'Crear Paciente';

  // Estado del formulario
  paciente: PacienteForm = {
    nombreCompleto: '',
    historialFichas: []
  };

  genero: string = ''; // manejamos género aparte para radios
  isLoading = false;

  constructor(
    private pacienteService: PacienteService,
    private fichaService: FichaGraduacionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPaciente();
  }

  // ===== Carga =====
  private cargarPaciente(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        this.titulo = 'Crear Paciente';
        this.paciente = { nombreCompleto: '', historialFichas: [] };
        this.genero = '';
        return;
      }

      const id = +idParam;
      this.titulo = 'Editar Paciente';

      this.pacienteService.getPaciente(id).subscribe({
        next: (p: PacienteDTO) => {
          this.paciente = this.mapPacienteDTOToForm(p);
          this.genero = p.genero || '';

          // Cargar fichas del paciente
          this.fichaService.listarPorPaciente(id).subscribe({
            next: (fichas: FichaGraduacionDTO[]) => {
              this.paciente.historialFichas = fichas.map(this.mapFichaDTOToForm);
              this.ordenarHistorialFichas();
              // ordenar graduaciones por ficha
              this.paciente.historialFichas.forEach(f => this.ordenarGraduaciones(f));
            },
            error: _e => {
              // El service ya muestra Swal
            }
          });
        },
        error: _e => {
          // El service ya muestra Swal
        }
      });
    });
  }

  // ===== Helpers de mapeo =====
  private mapPacienteDTOToForm(p: PacienteDTO): PacienteForm {
    return {
      id: p.id,
      ficha: p.ficha,

      nombreCompleto: p.nombreCompleto || '',
      direccion: p.direccion || undefined,
      obraSocial: p.obraSocial || undefined,
      observaciones: p.observaciones || undefined,

      celular: p.celular || undefined,
      genero: p.genero || undefined,

      documento: p.documento || undefined,
      cuit: p.cuit || undefined,
      condicionIva: p.condicionIva || undefined,
      tipoDocumento: p.tipoDocumento || undefined,

      correo: p.correo || undefined,
      medico: p.medico || undefined,

      historialFichas: []
    };
  }

  private mapFichaDTOToForm = (f: FichaGraduacionDTO): FichaForm => ({
    id: f.id,
    fecha: f.fecha,

    dnpDerecho: f.dnpDerecho ?? null,
    dnpIzquierdo: f.dnpIzquierdo ?? null,
    alturaPupilarDerecho: f.alturaPupilarDerecho ?? null,
    alturaPupilarIzquierdo: f.alturaPupilarIzquierdo ?? null,
    alturaPelicula: f.alturaPelicula ?? null,

    puente: f.puente ?? null,
    diagonalMayor: f.diagonalMayor ?? null,
    largo: f.largo ?? null,
    alturaArmazon: f.alturaArmazon ?? null,

    adicionDerecho: f.adicionDerecho ?? null,
    adicionIzquierdo: f.adicionIzquierdo ?? null,

    graduaciones: (f.graduaciones || []).map(g => ({
      id: g.id,
      ojo: g.ojo,
      tipo: g.tipo,
      esferico: g.esferico ?? null,
      cilindrico: g.cilindrico ?? null,
      eje: g.eje ?? null
    })),
    cristales: (f.cristales || []).map(c => ({
      id: c.id,
      nombre: c.nombre,
      fecha: c.fecha
    }))
  });

  private buildPacienteUpsertDTO(): PacienteUpsertDTO {
    return {
      ficha: this.paciente.ficha || undefined,

      nombreCompleto: (this.paciente.nombreCompleto || '').trim(),
      direccion: this.paciente.direccion || undefined,
      obraSocial: this.paciente.obraSocial || undefined,
      observaciones: this.paciente.observaciones || undefined,

      celular: this.paciente.celular || undefined,
      genero: this.genero || undefined,

      documento: this.paciente.documento || undefined,
      cuit: this.paciente.cuit || undefined,
      condicionIva: this.paciente.condicionIva || undefined,
      tipoDocumento: this.paciente.tipoDocumento || undefined,

      correo: this.paciente.correo || undefined,
      medico: this.paciente.medico || undefined
    };
  }

  private toNumberOrNull(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'number') return isNaN(v) ? null : v;
    const n = parseFloat(String(v).replace('+', '').replace(',', '.').trim());
    return isNaN(n) ? null : n;
  }

  private buildFichaUpsertDTO(f: FichaForm): FichaGraduacionUpsertDTO {
    const fecha = f.fecha ? new Date(f.fecha).toISOString().slice(0, 10) : null;

    const graduaciones: GraduacionUpsertDTO[] = (f.graduaciones || []).map(g => ({
      ojo: g.ojo,
      tipo: g.tipo,
      esferico: this.toNumberOrNull(g.esferico),
      cilindrico: this.toNumberOrNull(g.cilindrico),
      eje: this.toNumberOrNull(g.eje)
    }));

    const cristales: CristalUpsertDTO[] = (f.cristales || []).map(c => ({
      nombre: c.nombre || '',
      fecha: c.fecha ? new Date(c.fecha).toISOString().slice(0, 10) : null
    }));

    return {
      fecha,

      dnpDerecho: this.toNumberOrNull(f.dnpDerecho),
      dnpIzquierdo: this.toNumberOrNull(f.dnpIzquierdo),
      alturaPupilarDerecho: this.toNumberOrNull(f.alturaPupilarDerecho),
      alturaPupilarIzquierdo: this.toNumberOrNull(f.alturaPupilarIzquierdo),
      alturaPelicula: this.toNumberOrNull(f.alturaPelicula),

      puente: this.toNumberOrNull(f.puente),
      diagonalMayor: this.toNumberOrNull(f.diagonalMayor),
      largo: this.toNumberOrNull(f.largo),
      alturaArmazon: this.toNumberOrNull(f.alturaArmazon),

      adicionDerecho: this.toNumberOrNull(f.adicionDerecho),
      adicionIzquierdo: this.toNumberOrNull(f.adicionIzquierdo),

      graduaciones,
      cristales
    };
  }

  // ===== Selectores / helpers visuales =====
  selecionGenero(genero: string) { this.genero = genero; }
  generoSeleccionado(genero: string): boolean { return this.genero === genero; }

  getGraduacionesPorTipo(ficha: FichaForm, tipo: 'LEJOS' | 'CERCA') {
    return (ficha.graduaciones || []).filter(g => g.tipo === tipo);
  }

  // ===== CRUD Fichas (UI) =====
  agregarFicha() {
    const nueva: FichaForm = {
      fecha: new Date().toISOString().slice(0, 10),
      graduaciones: [
        { ojo: 'DERECHO',  tipo: 'LEJOS', esferico: 0, cilindrico: 0, eje: 0 },
        { ojo: 'IZQUIERDO',tipo: 'LEJOS', esferico: 0, cilindrico: 0, eje: 0 },
        { ojo: 'DERECHO',  tipo: 'CERCA', esferico: 0, cilindrico: 0, eje: 0 },
        { ojo: 'IZQUIERDO',tipo: 'CERCA', esferico: 0, cilindrico: 0, eje: 0 }
      ],
      cristales: []
    };
    this.ordenarGraduaciones(nueva);
    this.paciente.historialFichas.push(nueva);
    this.ordenarHistorialFichas();
  }

  confirmarEliminarUltimaFicha(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará la última ficha de graduación del historial (solo en pantalla).',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUltimaFicha();
        Swal.fire('Eliminado', 'La última ficha fue eliminada (recuerda guardar).', 'success');
      }
    });
  }

  private eliminarUltimaFicha(): void {
    if (this.paciente.historialFichas.length === 0) return;

    let indexMasReciente = 0;
    let fichaMasReciente = this.paciente.historialFichas[0];

    this.paciente.historialFichas.forEach((ficha, index) => {
      const fa = new Date(ficha.fecha ?? '').getTime();
      const fb = new Date(fichaMasReciente.fecha ?? '').getTime();
      if (fa > fb || (fa === fb && (ficha.id ?? 0) > (fichaMasReciente.id ?? 0))) {
        fichaMasReciente = ficha;
        indexMasReciente = index;
      }
    });

    this.paciente.historialFichas.splice(indexMasReciente, 1);
  }

  agregarCristal(ficha: FichaForm) {
    ficha.cristales?.push({
      nombre: '',
      fecha: new Date().toISOString().slice(0, 10)
    });
  }

  // ===== Normalizaciones numéricas / edición graduaciones =====
  normalizarNumero(obj: any, campo: string): void {
    const valor = obj[campo];
    if (typeof valor === 'string') {
      const n = parseFloat(valor.replace('+', '').replace(',', '.').trim());
      obj[campo] = isNaN(n) ? null : n;
    }
  }

  formatearConSigno(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor as any)) return '';
    return (valor as number) > 0 ? `+${valor}` : `${valor}`;
  }

  actualizarConSigno(event: Event, objeto: any, campo: string): void {
    const input = (event.target as HTMLInputElement).value;
    const limpio = input.replace(/\s+/g, '').replace(',', '.');
    const parseado = parseFloat(limpio.replace('+', ''));
    objeto[campo] = isNaN(parseado) ? null : parseado;
  }

  private parsearValorNumerico(valor: string): number | null {
    const limpio = valor.replace('+', '').replace(',', '.').trim();
    const num = parseFloat(limpio);
    return isNaN(num) ? null : num;
  }

  ordenarGraduaciones(f: FichaForm) {
    f.graduaciones.sort((a, b) => {
      if (a.tipo === b.tipo) {
        if (a.ojo === 'DERECHO') return -1;
        if (b.ojo === 'DERECHO') return 1;
        return 0;
      }
      return a.tipo === 'LEJOS' ? -1 : 1;
    });
  }

  ordenarHistorialFichas() {
    this.paciente.historialFichas.sort((a, b) => {
      const fa = new Date(a.fecha ?? '').getTime();
      const fb = new Date(b.fecha ?? '').getTime();
      if (fa !== fb) return fb - fa;
      return (b.id ?? 0) - (a.id ?? 0);
    });
  }

  actualizarAdicionYRecalcularCerca(event: Event, ficha: FichaForm, ojo: Ojo): void {
    const input = (event.target as HTMLInputElement).value;
    const valor = this.parsearValorNumerico(input);

    if (ojo === 'DERECHO') ficha.adicionDerecho = valor;
    else ficha.adicionIzquierdo = valor;

    const lejos = ficha.graduaciones.find(g => g.ojo === ojo && g.tipo === 'LEJOS');
    const cerca = ficha.graduaciones.find(g => g.ojo === ojo && g.tipo === 'CERCA');

    if (lejos && cerca) {
      if (typeof valor === 'number' && typeof lejos.esferico === 'number' && valor !== 0) {
        cerca.esferico = parseFloat(((lejos.esferico ?? 0) + valor).toFixed(2));
      } else {
        cerca.esferico = 0;
      }
    }
  }

  actualizarEsfericoLejosYRecalcularCerca(event: Event, ficha: FichaForm, grad: GradForm): void {
    const input = (event.target as HTMLInputElement).value;
    const esf = this.parsearValorNumerico(input);
    if (typeof esf === 'number') grad.esferico = esf;

    const ojo = grad.ojo;
    const adicion = ojo === 'DERECHO' ? ficha.adicionDerecho : ficha.adicionIzquierdo;
    let cerca = ficha.graduaciones.find(g => g.ojo === ojo && g.tipo === 'CERCA');

    if (typeof adicion === 'number') {
      if (adicion !== 0 && typeof esf === 'number') {
        if (!cerca) {
          cerca = { ojo, tipo: 'CERCA', esferico: 0, cilindrico: 0, eje: 0 };
          ficha.graduaciones.push(cerca);
        }
        cerca.esferico = parseFloat((esf + adicion).toFixed(2));
      } else if (adicion === 0) {
        if (!cerca) {
          cerca = { ojo, tipo: 'CERCA', esferico: 0, cilindrico: 0, eje: 0 };
          ficha.graduaciones.push(cerca);
        } else {
          cerca.esferico = 0;
        }
      }
    }
  }

  // ===== Guardar =====
  crearPaciente() {
    const payload = this.buildPacienteUpsertDTO();
    const fichasToCreate = (this.paciente.historialFichas || []).map(f => this.buildFichaUpsertDTO(f));

    this.isLoading = true;

    this.pacienteService.createPaciente(payload).pipe(
      concatMap((pac: PacienteDTO) => {
        if (!fichasToCreate.length) return of(pac);
        return from(fichasToCreate).pipe(
          concatMap(dto => this.fichaService.crear(pac.id!, dto)),
          last(),
          map(() => pac)
        );
      })
    ).subscribe({
      next: (pac: PacienteDTO) => {
        this.isLoading = false;
        Swal.fire('PACIENTE CREADO', 'El paciente ha sido guardado con éxito!', 'success');
        this.router.navigate(['/crearMovimiento', pac.id]);
      },
      error: (e) => {
        this.isLoading = false;
        Swal.fire('ERROR', e?.error?.mensaje || 'No se pudo crear el paciente', 'error');
      }
    });
  }

  editarPaciente() {
    if (!this.paciente.id) return;
    const payload = this.buildPacienteUpsertDTO();

    this.isLoading = true;

    this.pacienteService.updatePaciente(this.paciente.id, payload).pipe(
      concatMap((pac: PacienteDTO) => {
        const ops = (this.paciente.historialFichas || []).map(f =>
          f.id
            ? this.fichaService.actualizar(f.id, this.buildFichaUpsertDTO(f))
            : this.fichaService.crear(pac.id!, this.buildFichaUpsertDTO(f))
        );
        if (!ops.length) return of(pac);
        return from(ops).pipe(last(), map(() => pac));
      })
    ).subscribe({
      next: (pac: PacienteDTO) => {
        this.isLoading = false;
        Swal.fire('PACIENTE EDITADO', 'Se ha editado con éxito!', 'success');
        this.router.navigate(['/crearMovimiento', pac.id]);
      },
      error: (e) => {
        this.isLoading = false;
        Swal.fire('ERROR', e?.error?.mensaje || 'No se pudo editar el paciente', 'error');
      }
    });
  }
}
