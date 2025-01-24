import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable,catchError,throwError} from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthToken implements HttpInterceptor {

  constructor(private authService: AuthService,private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(
      catchError(e =>{
        if(e.status==401){
          if(this.authService.isAuthenticated()){
            this.authService.logOut()
          }
          this.router.navigate(['/login'])
          Swal.fire('ERROR LOGIN','Necesitas logearte','error');
        }
        if(e.status==403){
          this.router.navigate(['/inicio'])
          Swal.fire('ACCESO DENEGADO',`Hola ${this.authService.user.username}, no tenes acceso`,'warning');
        }
        return throwError(() => e);
      })
    );
  }
}