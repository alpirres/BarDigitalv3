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
      this.saveSesion(user,false);
      })
   }

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

  public async loginGoogle():Promise<any>{
    console.log("onLoginGoogle");
    const res = await this.google.login({
      'webClientId': '965044951080-ei025ibroqp10k063lq60b5go2jvcqh5.apps.googleusercontent.com',
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

  async logOut() {    
    AuthService.user = null;
    this.saveSesion(null);
    this.router.navigate(['/login']);
  }

  isloggedIn():boolean{
    if(AuthService.user==null){
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

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
