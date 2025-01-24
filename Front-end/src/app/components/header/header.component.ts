import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title:String='App Notas'
  categorias:Categoria[]=[];
  categoriaIDGafasDeSol:number=0;
  categoriaIDRecetas:number=0;
  categoriaIDAccesorios:number=0;
  tiposCristales: string[] = [];

  constructor(public authService: AuthService,
    private router: Router,
    private categoriaService: CategoriaService){}

  ngOnInit(): void {
   this.cargarCategoria();
  }

  cargarCategoria(){
    this.categoriaService.getCategories().subscribe(
      categorias=>{this.categorias=categorias
        categorias.forEach(categoria => {
          if(categoria.nombre.includes("Sol")){
            this.categoriaIDGafasDeSol=categoria.id;
          }
          if(categoria.nombre.includes("Receta")){
            this.categoriaIDRecetas=categoria.id;
          }
          if(categoria.nombre.includes("Accesorios")){
            this.categoriaIDAccesorios=categoria.id;
          }
        })
      });
  }

  

  longOut():void{
    Swal.fire('SE HA CERRADO SESIÓN',`Hola ${this.authService.user.username},has cerrado sesión con éxito!`,'success')
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
