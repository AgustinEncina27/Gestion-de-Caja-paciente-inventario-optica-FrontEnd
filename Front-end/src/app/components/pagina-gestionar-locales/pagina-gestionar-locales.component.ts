import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Local } from 'src/app/models/local';
import { LocalService } from 'src/app/services/local.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-locales',
  templateUrl: './pagina-gestionar-locales.component.html',
  styleUrls: ['./pagina-gestionar-locales.component.css']
})
export class PaginaGestionarLocalesComponent {
  titulo:string='Administrar Categorias';
  local: Local= new Local;
  locales: Local[]= [];
  seleccionado = false;
 

  constructor(private localService: LocalService,
    private router: Router){}

  ngOnInit(): void {
    this.cargarLocales()
  }

  cargarLocales(){
    this.localService.getLocales().subscribe(
      locales=>{this.locales=locales
      }
    )
  }

  toggleLocalSelection(local: Local) {
    this.local = local; // local el radio button seleccionado
  }
  
  limpiarSeleccion() {
    this.local = new Local();
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: Element) => {
      (radio as HTMLInputElement).checked = false; // Deslocal todos los radio buttons
    });
  }

  crearLocal(){
    this.localService.crearLocal(this.local).subscribe( 
      response=>{
        Swal.fire('local Creada', 'La local fue cargada con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  editarLocal(){
    this.localService.actualizarLocal(this.local).subscribe( 
      response=>{
        Swal.fire('local Editada', 'El local fue editada con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  eliminarLocal(){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No puedes revertir este cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.localService.eliminarLocal(this.local.id).subscribe( 
          response=>{
            Swal.fire('local Eliminada', 'El local fue eliminada con éxito!','success')
            this.router.navigate(['/inicio']);
          })
      }
    })
  }
}
