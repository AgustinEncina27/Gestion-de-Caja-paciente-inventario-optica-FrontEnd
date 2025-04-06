import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { URL_BACKEND } from '../config/config';
import { Local } from '../models/local';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private _user : User;
  private _token : string;

  constructor(private http: HttpClient) {
    this._user = new User();
    this._token ='';
   }

  public get user():User{
    if(this._user!=null){
      return this._user;
    }else if(this.user==null && sessionStorage.getItem('user') != null){
      const userJSON = sessionStorage.getItem('user');
      if (userJSON !== null) {
        this._user = JSON.parse(userJSON) as User;
        return this._user 
      }  
    }
    return new User();
  }

  public get token():any{
    if(this._token!=null){
      return this._token;
    }else if(this._token==null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token') ?? '';;
      return this._token 
    }
    return null;
  }

  login(user:User):Observable<any>{
    const urlEndpoint=URL_BACKEND+'/oauth/token';
    const credencials= btoa('angularapp.optica'+':'+'ryq05GTa9sq>');
    const httpHeaders= new HttpHeaders({
    'Content-type':'application/x-www-form-urlencoded',
    'Authorization':'Basic '+credencials});
    
    let params= new URLSearchParams();
    params.set('username', user.username ?? '');
    params.set('password', user.password ?? '');
    params.set('grant_type','password');
    const httpBody = params.toString();

    return this.http.post<any>(urlEndpoint,httpBody,{headers: httpHeaders});

  }

  saveUser(accessToken:string):void{
    let payload= this.getDataToken(accessToken)
    this._user= new User();
    this._user.username= payload.user_name;
    this._user.roles= payload.authorities;
    this._user.localId = payload.local_id;
    sessionStorage.setItem('user',JSON.stringify(this._user));
  }

  saveToken(accessToken:string):void{
    this._token=accessToken;
    sessionStorage.setItem('token',accessToken);
  }

  getDataToken(accessToken: string): any {
    if (accessToken != null && accessToken.trim() !== "") {
      const payloadBase64 = accessToken.split(".")[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    }
    return null;
  }
  

  isAuthenticated():boolean{
    let payload = this.getDataToken(this.token);
    if(payload!= null && payload.user_name && payload.user_name.length>0){
      return true;
    } 
    return false;
  }

  logOut():void{
    this._token= '';
    this._user= new User();
    sessionStorage.clear();
  }

  hasRole(role:string):boolean{
    if(this.user.roles.includes(role)){
      return true;
    }
    return false;
  }

  hasRoles():boolean{
    if(this.user.roles.length === 0){
      return false;
    }
    return true;
  }

  getLocalId():number | undefined{
    return this.user.localId;
  }

  isTokenExpirado():boolean {
    let token= this.token;
    let payload= this.getDataToken(token);
    let now = new Date().getTime()/1000;
    if(payload.exp < now){
      return true;
    }
    return false;
  }
  
}
