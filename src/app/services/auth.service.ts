import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { promise } from 'protractor';
import { access } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged: boolean = false;
  static user: User;
  static loggingIn: boolean = false;


  constructor(
    private AFauth:AngularFireAuth,
    private local: NativeStorage,
    private google:GooglePlus,
    private router: Router) { }

    /**
     * Funcion que comprueba el usuario, si entra en el if busca en el local storage del dispositivo la variable user,
     * si hay datos la guarda en user que es estatico y devuelve true, si falla algo usuario es null y devuelve false y 
     * si entra en el else devuelve true siempre
     */
  public async checkSession():Promise<boolean>{
    if(!AuthService.user){
      
        this.local.getItem('user').then(data=>{
          AuthService.user=data;
          return Promise.resolve(true);
        })
        .catch(()=>{
          AuthService.user=null;
          return Promise.reject(false);
        })
      
    }else{
      return Promise.resolve(true);
    }
  }

  /**
   * Funcion que rejistra un usuario nuevo en firebase para poder acceder a la aplicaión
   * @param value array con email y contraseña
   */
  registerUser(value){
    return firebase.default.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then((res) => {
        let user :User={
        email:value.email,
        displayName:res.user.displayName,
        imageUrl:res.user.photoURL,
        userId:res.user.uid
      }
      AuthService.user=user;
      this.saveSesion(user,false);
      })
   }

   /**
    * Funcion que comprueba si el usuario ha sido logeado mediante google con la variable del local storage googles
    * si no es asi significa que se a logeado con login por lo tanto tiene que cerrar sesion de firebase con el singOut()
    * y llama a la funcion logOut(), si la variable es true esw decir entra en el else y cierra sesion de google.
    */
   logoutUser(){
    this.local.getItem('googles').then((g:boolean)=>{
      if(!g){
        return new Promise((resolve, reject) => {
          this.AFauth.signOut()
          .then(() => {
            console.log("LOG Out");
            this.logOut();
            resolve();
          }).catch((error) => {
            reject();
          });
        });
      }else{
        this.google.disconnect();
        this.logOut();
      }
    })
  }

  
/**
 * Funcion que inicia sesion comprobando el email introducido y la contraseña con os que ya estan registrados
 * y llama a saveSesion() y guarda el usuario en la variable estatica.
 * @param value array con el email y la contraseña.
 */
  async OnLogin(value): Promise<any> {
    AuthService.loggingIn = true;
    
    return firebase.default.auth().signInWithEmailAndPassword(value.email, value.password)
      .then((res) => {
        let user :User={
          email:value.email,
          displayName:res.user.displayName,
          imageUrl:res.user.photoURL,
          userId:res.user.uid
          
        }
        AuthService.user=user;
        this.saveSesion(user,false);
        console.log(AuthService.user.userId);
      })

  }

  /**
   * Funcion que inicia sesion mediante una cuenta de google, la funcion login es de el plugin nativo de google plus al cual hay
   * que pasarle el webClientId de google cloud platform que tienen que coincidir con el del proyecto y para añadir este usuario
   * a firebase hay que hacer la funcion signInWithCredential() donde hay que pasarle los credenciales que devuelven la funcion anterior
   * una vez realizado todo esto guarda el usuario en la variale estatica y guarda la sesion.
   */
  public async loginGoogle():Promise<any>{
    console.log("onLoginGoogle");
    const res = await this.google.login({
      'webClientId': 'xxxx-xxxx-xxxx',
    });
    const resConfirmed =  await firebase.default.auth().signInWithCredential(firebase.default.auth.GoogleAuthProvider.credential(res.idToken));
    let user :User={
      email:resConfirmed.user.email,
      displayName:resConfirmed.user.displayName,
      imageUrl:res.imageUrl,
      userId:resConfirmed.user.uid
    }
    AuthService.user=user;
    this.saveSesion(user, true);
  }

  /**
   * Funcion que pone a null la variable estatica, cierra la sesion del local estorage y redirige a login
   */
  async logOut() {    
    AuthService.user = null;
    this.saveSesion(null);
    this.router.navigate(['/login']);
  }

  /**
   * Funcion para asegurar de que no hay usuario que ddevuelve un booleano 
   */
  isloggedIn():boolean{
    if(AuthService.user==null){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  /**
   * Funcion que crea 2 variables en el local estorage del dispositivo y si se le pasa null los borra
   * @param user Usuario completo 
   * @param g booleano que hace referencia a si ha sido logeado con google o no
   */
  public async saveSesion(user?:User, g?:boolean){
    if(user!=null){
      await this.local.setItem('user',user);
      await this.local.setItem('googles',g);
      this.isLogged=true;
    }else{
      await this.local.remove('user');
      await this.local.setItem('googles',false);
      this.isLogged=false;
    }
  }

  
}
