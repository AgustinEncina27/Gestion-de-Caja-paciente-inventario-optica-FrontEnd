import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MetodoPago } from 'src/app/models/metodoPago';
import { MetodoPagoService } from 'src/app/services/metodoPago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-metodoPago',
  templateUrl: './pagina-gestionar-metodoPago.component.html',
  styleUrls: ['./pagina-gestionar-metodoPago.component.css']
})
export class PaginaGestionarMetodosPagosComponent {
  titulo:string='Administrar Métodos de Pagos';
  metodoPago: MetodoPago= new MetodoPago;
  metodosPagos: MetodoPago[]= [];
  seleccionado = false;
 

  constructor(private metodoPagoService: MetodoPagoService,
    private router: Router){}

  ngOnInit(): void {
    this.cargarMetodosPagos()
  }

  cargarMetodosPagos(){
    this.metodoPagoService.getmetodosPagos().subscribe(
      metodosPagos=>{this.metodosPagos=metodosPagos
      }
    )
  }

  toggleMetodoPagoSelection(metodoPago: MetodoPago) {
    this.metodoPago = metodoPago; // local el radio button seleccionado
  }
  
  limpiarSeleccion() {
    this.metodoPago = new MetodoPago();
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: Element) => {
      (radio as HTMLInputElement).checked = false; // Deslocal todos los radio buttons
    });
  }

  crearMetodoPago(){
    this.metodoPagoService.crearMetodoPago(this.metodoPago).subscribe( 
      response=>{
        Swal.fire('MÉTODO DE PAGO CREADO', 'El método de pago fue cargado con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  editarMetodoPago(){
    this.metodoPagoService.actualizarMetodoPago(this.metodoPago).subscribe( 
      response=>{
        Swal.fire('MÉTODO DE PAGO EDITADO', 'El método de pago fue editado con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  eliminarMetodoPago(){
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
        this.metodoPagoService.eliminarMetodoPago(this.metodoPago.id).subscribe( 
          response=>{
            Swal.fire('MÉTODO DE PAGO ELIMINADO', 'El método de pago fue eliminado con éxito!','success')
            this.router.navigate(['/inicio']);
          })
      }
    })
  }
}
