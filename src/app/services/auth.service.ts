import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { promise } from 'protractor';

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

  getUser() {
    if (AuthService.user == null) {
      return "";
    } else {
      return AuthService.user.displayName;
    }
  }

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

  public isAuthenticated():boolean{
    return AuthService.user?true:false;
  }

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
      this.saveSesion();
      })
   }

   logoutUser(){
    return new Promise((resolve, reject) => {
      if(firebase.default.auth().currentUser){
        firebase.default.auth().signOut()
        .then(() => {
          console.log("LOG Out");
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }

  

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
        this.saveSesion();
        console.log(AuthService.user.userId);
      })

  }

  onTryLoginGoogle(): Promise<any> {
    console.log("onTryLoginGoogle");
    return this.google.trySilentLogin({ offline: false });
  }

  public loginGoogle():Promise<any>{
    console.log("onLoginGoogle");
    return this.google.login({}).then((result)=>{
      const userGoogle= result;
      this.AFauth.signInWithCredential(firebase.default.auth.GoogleAuthProvider.credential());
    });
  }

  async logOut() {    
    this.isLogged = false;
    AuthService.user = null;
    this.router.navigateByUrl("login");
  }

  isloggedIn():boolean{
    if(AuthService.user==null){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  public async saveSesion(user?:User){
    if(user){
      await this.local.setItem('user',user);
    }else{
      await this.local.remove('user');
    }
  }

  
}
