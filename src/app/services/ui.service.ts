import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  miLoading: any;
  miToast: any;

  constructor(public loading: LoadingController,
    public modal: ModalController,
    public toast: ToastController,
    public alertController: AlertController) { }

    /**
     * Funcion que muetra un loading mietras se ejecuta algo internamente
     * @param msg string opcional que se puede añadir al loading
     */
  async showLoading(msg?: string) {
    if (this.miLoading) {
      console.log("Ya hay un loading activo");
      return;
    }
    this.miLoading = await this.loading.create({
      message: msg ? msg : ''
    });
    await this.miLoading.present();
  }

  /**
   * Funcion que cierra el loading
   */
  public hideLoad() {
    this.miLoading = null;
    this.loading.dismiss();
  }

  /**
   * Funcion que muestra el toast
   * @param msg string con el mensaje a mostrar
   * @param dur numero con la duracion para ocultarse
   * @param col string color
   */
  async presentToast(msg: string, dur: number = 2000, col: string = "danger"): Promise<void> {
    if (this.miToast) {
      this.toast.dismiss();
    }

    this.miToast = await this.toast.create({

      message: msg,
      duration: dur,
      color: col,
      translucent: true,
      position: "bottom",
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
          handler: () => {
            this.hideToast();
          }
        }
      ]
    });
    this.miToast.present();
  }

  /**
   * Funcion que quita el toast
   */
  public hideToast() {
    this.miToast = null;
    this.toast.dismiss();
  }


  /**
   * Funcion que muestra un alert con opciones
   * @param header string con el nombre del titulo
   * @param message string con el mensaje
   * @param opcionSi sting para la opcion si
   * @param opcionNo string para la opcion no
   */
  async presentAlertMultipleButtons(header: string, message: string, opcionSi: string = 'Si', opcionNo: string = 'No') {
    let choice: boolean;
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: opcionSi,
          handler: () => {
            alert.dismiss(true);
            return true;
          }
        }, {
          text: opcionNo,
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ],
    });

    await alert.present();
    await alert.onDidDismiss().then(data => {
      choice = data.data;
      console.log(choice);
    });
    return choice;
  }

  /**
   * Funcion que muestra un alert con una sola opcion
   * @param header string con el titulo 
   * @param message string con el mensage
   * @param opcionSi string para la opcion si que por defecto es aceptar
   */
  async presentAlert(header: string, message: string, opcionSi: string = 'Aceptar') {
    let sol: boolean = false;
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: opcionSi,
          handler: () => {
            alert.dismiss(true);
            return true;
          }
        }
      ],
    });
    await alert.present();
    return alert.onDidDismiss();
  }

}

