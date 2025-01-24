import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-marcas',
  templateUrl: './pagina-gestionar-marcas.component.html',
  styleUrls: ['./pagina-gestionar-marcas.component.css']
})
export class PaginaGestionarMarcasComponent {
  titulo:string='Administrar Marcas';
  marca: Marca= new Marca;
  marcas: Marca[]= [];
  seleccionado = false;
 

  constructor(private marcaService: MarcaService,
    private router: Router){}

  ngOnInit(): void {
    this.cargarMarcas()
  }

  cargarMarcas(){
    this.marcaService.getMarcas().subscribe(
      marcas=>{this.marcas=marcas
      }
    )
  }

  toggleMarcaSelection(marca: Marca) {
    this.marca = marca; // Marca el radio button seleccionado
  }
  
  limpiarSeleccion() {
    this.marca = new Marca();
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: Element) => {
      (radio as HTMLInputElement).checked = false; // Desmarca todos los radio buttons
    });
  }

  crearMarca(){
    this.marcaService.crearMarca(this.marca).subscribe( 
      response=>{
        Swal.fire('MARCA CREADA', 'La marca fue cargada con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  editarMarca(){
    this.marcaService.actualizarMarca(this.marca).subscribe( 
      response=>{
        Swal.fire('MARCA EDITADA', 'La Marca fue editada con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  eliminarMarca(){
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
        this.marcaService.eliminarMarca(this.marca.id).subscribe( 
          response=>{
            Swal.fire('MARCA ELIMINADA', 'La marca fue eliminada con éxito!','success')
            this.router.navigate(['/inicio']);
          })
      }
    })
  }
}
