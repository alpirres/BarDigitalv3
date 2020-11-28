import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: '/home.page.html',
  styleUrls: ['/home.page.scss']
})
export class HomePage {

  constructor(
    private auth:AuthService,
    private ui:UiService,
    private navCtrl: NavController,
    private router:Router) {}

  public reservar(mesa:string){
    this.navCtrl.navigateForward('/reserva/'+mesa);
  }

}
