import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  titulo: String='Iniciar Sesión';
  user: User ;

  constructor(private authService: AuthService, private router:Router ){
    this.user= new User();
  }
  
  ngOnInit(){
    if(this.authService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.authService.user.username}, Ya estas autenticado`,'info');
      this.router.navigate(['/inicio']);
    }
  }

  login(){
    if(this.user.username==null||this.user.password==null){
      swal.fire('Error Login','El usuario y la contraseña estan vacios!','error');
      return;
    }

    this.authService.login(this.user).subscribe(
      response=>{
        this.authService.saveUser(response.access_token);
        this.authService.saveToken(response.access_token);

        let user= this.authService.user;
        this.router.navigate(['/inicio']);
        swal.fire('Login',`Hola ${user.username},has iniciado sesión correctamente`,'success');
      },error=>{
        if(error.status==400){
          swal.fire('Error Login','el usuario y contraseña son incorrectos','error');
        }
      }
    )
  }
}
