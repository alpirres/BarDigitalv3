import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public base64Image= 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth:AuthService,
    private router:Router,
    private camera: Camera
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.default.initializeApp(environment.firebaseConfig);
  }

  getimegeUrl(){
    return AuthService.user != null && AuthService.user != undefined && AuthService.user.imageUrl != null && AuthService.user.imageUrl != undefined && AuthService.user.imageUrl.length > 0 ? AuthService.user.imageUrl: this.base64Image;
  }

  public appPages = [
    {
      title: 'Reservar',
      url: '/home',
      icon: 'restaurant'
    },
    {
      title: 'Mis Reservas',
      url: '/list-reservas',
      icon: 'list'
    },
    {
      title: 'Ayuda',
      url: '/ayuda',
      icon: 'information-circle-outline'
    }
  ];
  


  updatePic() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,  /*FILE_URI */
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0,
      correctOrientation: true,
      /* allowEdit:true,*/
      saveToPhotoAlbum: true,
      /*sourceType:0 es library, 1 camera, 2 saved */
      /* targetHeight:200,*/
      targetWidth: 200
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Image = 'data:image/jpeg;base64, ' + imageData;
      AuthService.user.imageUrl=this.base64Image;
    }, (err) => {
      // Handle error
    });
  }

  cerrarSesion(){
    this.auth.logoutUser();
  }
}
