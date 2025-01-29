import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Proveedor } from 'src/app/models/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-proveedores',
  templateUrl: './pagina-gestionar-proveedores.component.html',
  styleUrls: ['./pagina-gestionar-proveedores.component.css']
})
export class PaginaGestionarProveedoresComponent {
  titulo:string='Administrar Proveedores';
  proveedor: Proveedor= new Proveedor;
  proveedores: Proveedor[]= [];
  seleccionado = false;
 

  constructor(private proveedorService: ProveedorService,
    private router: Router){}

  ngOnInit(): void {
    this.cargarProveedores()
  }

  cargarProveedores(){
    this.proveedorService.getProveedores().subscribe(
      proveedores=>{this.proveedores=proveedores
      }
    )
  }

  toggleProveedorSelection(proveedor: Proveedor) {
    this.proveedor = proveedor; // Marca el radio button seleccionado
  }
  
  limpiarSeleccion() {
    this.proveedor = new Proveedor();
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: Element) => {
      (radio as HTMLInputElement).checked = false; // Desmarca todos los radio buttons
    });
  }

  crearProveedor(){
    this.proveedorService.crearProveedor(this.proveedor).subscribe( 
      response=>{
        Swal.fire('PROVEEDOR CREADO/EDITADO', 'El proveedor fue cargado con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  editarProveedor(){
    this.proveedorService.actualizarProveedor(this.proveedor).subscribe( 
      response=>{
        Swal.fire('PROVEEDOR EDITADO', 'El proveedor fue editado con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  eliminarProveedor(){
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
        this.proveedorService.eliminarProveedor(this.proveedor.id).subscribe( 
          response=>{
            Swal.fire('PROVEEDOR ELIMINADO', 'El proveedor fue eliminado con éxito!','success')
            this.router.navigate(['/inicio']);
          })
      }
    })
  }
  
}
