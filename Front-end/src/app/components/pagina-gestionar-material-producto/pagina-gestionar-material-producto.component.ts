import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialProducto } from 'src/app/models/materialProducto';
import { MaterialProductoService } from 'src/app/services/materialProducto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagina-gestionar-material-producto',
  templateUrl: './pagina-gestionar-material-producto.component.html',
  styleUrls: ['./pagina-gestionar-material-producto.component.css']
})
export class PaginaGestionarMaterialProductoComponent {
  titulo:string='Administrar Materiales';
  materialProducto: MaterialProducto= new MaterialProducto;
  materialesProducto: MaterialProducto[]= [];
  seleccionado = false;
 

  constructor(private materialProductoService: MaterialProductoService,
    private router: Router){}

  ngOnInit(): void {
    this.cargarMaterialProducto()
  }

  cargarMaterialProducto(){
    this.materialProductoService.getMaterialesProducto().subscribe(
      materialesProducto=>{this.materialesProducto=materialesProducto
      }
    )
  }

  toggleMaterialProductoSelection(materialProducto: MaterialProducto) {
    this.materialProducto = materialProducto; // Marca el radio button seleccionado
  }
  
  limpiarSeleccion() {
    this.materialProducto = new MaterialProducto();
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio: Element) => {
      (radio as HTMLInputElement).checked = false; // Desmarca todos los radio buttons
    });
  }

  crearMaterialProducto(){
    this.materialProductoService.crearMaterialProducto(this.materialProducto).subscribe( 
      response=>{
        Swal.fire('MATERIAL CREADO', 'El material fue cargado con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  editarMaterialProducto(){
    this.materialProductoService.actualizarMaterialProducto(this.materialProducto).subscribe( 
      response=>{
        Swal.fire('MATERIAL EDITADO', 'El material fue editado con éxito!','success')
        this.router.navigate(['/inicio']);
      })
  }

  eliminarMaterialProducto(){
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
        this.materialProductoService.eliminarMaterialProducto(this.materialProducto.id).subscribe( 
          response=>{
            Swal.fire('MATERIAL ELIMINADO', 'El material fue eliminado con éxito!','success')
            this.router.navigate(['/inicio']);
          })
      }
    })
  }
}
