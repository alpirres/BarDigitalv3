import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { UiService } from 'src/app/services/ui.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-showqr',
  templateUrl: './showqr.page.html',
  styleUrls: ['./showqr.page.scss'],
})
export class ShowqrPage implements OnInit {

  private id: string;
  private fecha: string;
  private hora: string;
  text: string='Codigo QR para BarDigital';

  constructor(public barcodeScanner: BarcodeScanner, 
    private navCtrl:NavController,
    private ui:UiService,
    private navParams: NavParams, 
    private socialSharing: SocialSharing,
    private base64:Base64ToGallery,
    private modalController: ModalController) { 
      this.id=this.navParams.get("id");
      this.fecha=this.navParams.get("fecha");
      this.hora=this.navParams.get("hora");
      
  }
  ngOnInit() {
  }

  goBack(){
    this.navCtrl.navigateForward('/list-reservas');
    this.modalController.dismiss();
  }


  /**
   * Función que descarga el codigo qr en la galeria de un dispositivo movil
   * mediante una conversion a base 64
   */
  downloadQR(){
   
    const imageData= document.getElementsByTagName('img')[0].src;
    let data = imageData.split(',')[1];
    console.log(data);
    this.base64.base64ToGallery(data, {prefix: 'img', mediaScanner:true })
    .then(
      res=> this.ui.presentToast('Qr guardado en la Galeria', 2000, 'success'),
      err=> console.log('Error saving image to gallery ', err));
    
  }

  ShareWhatsapp(){
    this.socialSharing.shareViaWhatsApp(this.text, document.getElementsByTagName('img')[0].src)
  }

}
