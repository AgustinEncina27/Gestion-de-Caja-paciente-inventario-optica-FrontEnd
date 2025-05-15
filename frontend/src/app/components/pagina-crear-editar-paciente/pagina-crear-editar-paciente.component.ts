import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { URL_BACKEND } from 'src/app/config/config';
import { Local } from 'src/app/models/local';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import { LocalService } from 'src/app/services/local.service';
import { Graduacion } from 'src/app/models/graduacion';

@Component({
  selector: 'app-pagina-crear-paciente',
  templateUrl: './pagina-crear-editar-paciente.component.html',
  styleUrls: ['./pagina-crear-editar-paciente.component.css']
})
export class PaginaCrearEditarPacienteComponent implements OnInit {
  paciente: Paciente= new Paciente();
  titulo:String ='Crear Paciente';
  locales:Local[]=[];
  local:Local=new Local();
  genero:string='';
  URL_BACKEND: string=URL_BACKEND;
  isLoading = false; // Variable para la pantalla de carga
  nuevaGraduacion: Graduacion = {
    ojo: 'DERECHO',
    esferico: 0,
    cilindrico: 0,
    eje: 0,
    adicion: 0,
    cerca: 0,
    fechaGraduacion: new Date().toISOString().slice(0, 10) // Formato YYYY-MM-DD
  };
  

  constructor(private pacienteService: PacienteService,
     private activatedRoute: ActivatedRoute,
      private localService:LocalService,
     private router:Router){}
     progreso: number=0;


  ngOnInit(): void {
    this.cargarPaciente()
    this.cargarLocales()  
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

  
  

  cargarLocales(){
    this.localService.getLocales().subscribe(
      locales=>{this.locales=locales
      }
    )
  }

  crearPaciente(){
    this.paciente.local=this.local
    this.paciente.genero=this.genero;
    this.paciente.creadoEn= new Date()
    this.paciente.ultimaActualizacion= new Date()

    this.isLoading = true; // Activar pantalla de carga

    this.pacienteService.createPaciente(this.paciente).subscribe({
      next: (response) => {

        this.isLoading = false; // Desactivar pantalla de carga

        this.paciente=response
        this.paciente.local=this.local
        this.paciente.genero=this.genero;
        Swal.fire("PACIENTE CREADO","El paciente ha sido guardado con éxito!","success");
        this.router.navigate(['/crearMovimiento/'+this.paciente.id]);
      },
        error: (e) => {
          this.isLoading = false; // Desactivar pantalla de carga en caso de error
          Swal.fire('ERROR', e.error.mensaje, 'error');
      }}
    )
  }

  editarPaciente(){
    this.paciente.local=this.local
    this.paciente.genero=this.genero;
    this.paciente.ultimaActualizacion= new Date();

    this.isLoading = true; // Activar pantalla de carga

    this.pacienteService.updatePaciente(this.paciente).subscribe({
      next: (response) => {

        this.isLoading = false; // Desactivar pantalla de carga

        this.paciente=response
        this.paciente.local=this.local
        this.paciente.genero=this.genero;
        Swal.fire("PACIENTE EDITADO","Se ha editado con éxito!","success");
        this.router.navigate(['/adminitrarPaciente']);
      },
      error: (e) => {
        this.isLoading = false; // Desactivar pantalla de carga en caso de error
        Swal.fire('ERROR', e.error.mensaje, 'error');
    }}
    )
  }

  selecionLocal(local:Local){
    this.local=local;
  }

  selecionGenero(genero:string){
    this.genero=genero;
  }


  localSeleccionado(local:Local): boolean {
    
    if(local.id==this.local.id && this.local!==undefined){
      return true
    }
    return false
  }

  generoSeleccionado(genero:string):boolean{
    if(this.genero==null ){
      return false
    }
    if(this.paciente.genero!==undefined){
      if(this.paciente.genero.includes(genero) && this.paciente.genero!==undefined){
        return true
      }
    }
    return false
  }

  calcularGraduacionCerca(esferico:number,adicion:number){
    if(adicion !=0 ){
      this.nuevaGraduacion.cerca= esferico+adicion;
    }else{
      this.nuevaGraduacion.cerca=0;
    }
  }

  //funciones MODAL
  agregarGraduacion() {
    this.paciente.graduaciones.push({ ...this.nuevaGraduacion });
    this.nuevaGraduacion = new Graduacion(); // Reinicia el formulario
    this.nuevaGraduacion.ojo= 'IZQUIERDO';
    this.nuevaGraduacion.fechaGraduacion= new Date().toISOString().slice(0, 10);
  }

  eliminarGraduacion(index: number) {
    this.paciente.graduaciones.splice(index, 1);
  }

  guardarGraduaciones() {
    Swal.fire("GRADUACIÓN AGREGADA","Se ha Agregado con éxito!","success");
  }

}
