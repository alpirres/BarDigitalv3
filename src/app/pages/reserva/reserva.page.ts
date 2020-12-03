import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Comida } from 'src/app/Model/Comida';
import { ReservaService } from 'src/app/services/reserva.service';
import { UiService } from 'src/app/services/ui.service';
import { ShowqrPage } from '../showqr/showqr.page';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  public mesa:string;
  public data:Comida=null;
  public comida:string[]=[];
  public total:number =0;
  public reservaForm:FormGroup;
  public form = [
    { val: 'Bravas', isChecked: false, price: 6 },
    { val: 'Berenjenas', isChecked: false, price: 7},
    { val: 'Croquetas', isChecked: false, price: 6.5 },
    { val: 'Alitas', isChecked: false, price: 8 },
    { val: 'Lagrimitas', isChecked: false, price: 6 },
    { val: 'Revuelto de Bacalao', isChecked: false, price: 8 },
    { val: 'Almejas', isChecked: false, price: 7 },
    { val: 'Ravioli', isChecked: false, price: 9 },
    { val: 'Churrasco', isChecked: false, price: 8.5 }
  ];
  barcodeScannerOptions: BarcodeScannerOptions;
  id: string;

  constructor(private route: ActivatedRoute,
    private todoS:ReservaService, 
    private formBuilder:FormBuilder,
    private auth:AuthService,
    private navCtrl: NavController,
    private barcodeScanner:BarcodeScanner,
    private modalController: ModalController,
    private base64:Base64ToGallery,
    private ui:UiService) {}

  ngOnInit() {
    this.mesa = this.route.snapshot.paramMap.get('m');
    this.reservaForm=this.formBuilder.group({
      fecha:['',Validators.required],
      hora:['',Validators.required],
      comida:['',Validators.minLength(1)],
      comentario:['']
    })
  }

  /**
   * Funcion que redirige a home cuando se pulsa el boton atras del dispositivo
   */
  back(){
    this.navCtrl.navigateForward('/home')
  }

  /**
   * Funcion que cambia el checkbox de la comida a seleccionado o no y actualiza el precio total de la comida
   * @param detail 
   * @param name 
   * @param price 
   */
  onChangeCheckBox(detail: boolean, name: string, price:number){
    if(!this.comida.includes(name)&&detail){
      this.comida.push(name);
      this.total=price+this.total;
    }else{
      this.comida.splice(this.comida.indexOf(name)); 
      if(this.total!=0){
        this.total=this.total-price;
      }
    }
  }
  
  /**
   * Funcion que agrega una nueva reserva a la base de datos y llama a la funcion openmodal pasandole el id, la fecha y la hora de esta
   */
  addComida(){
    let fecha= this.reservaForm.get('fecha').value.split('T')[0];
    let fechora= this.reservaForm.get('hora').value.split('T')[1];
    let horass=fechora.split(/(:\d.)/);
    let hora=horass[0]+horass[1];
    console.log(hora)
    this.data={
      fecha:fecha,
      hora:hora,
      comida:this.comida,
      userId:AuthService.user.userId,
      comentario:this.reservaForm.get('comentario').value
    };
    this.ui.showLoading();
    console.log(this.data);
    this.todoS.addTodo(this.data)
    .then(async(ok)=>{
      console.log("nopasa");
      this.ui.presentToast("Reserva Agregada",2000,'success');
      this.id=ok.id;
    })
    .catch((err)=>{
      this.ui.presentToast('Error Realizando Reserva',4000,'danger' )
    })
    .finally(async ()=>{
      this.ui.hideLoad();
      await this.openModal(this.id, fecha, hora);
      this.navCtrl.navigateForward('/home')
    })
  }

  /**
   * Funcion que abre el modal con los siguientes datos 
   * @param id string con el identificador de la reserva
   * @param fecha string con la fecha de la reserva
   * @param hora string con la hora de la reserva
   */
  async openModal(id:string, fecha:string, hora:string){
    const modal = await this.modalController.create({
      
      component: ShowqrPage,
      componentProps: {
        id:id,
        fecha:fecha,
        hora:hora
      }
     });
     
     modal.onWillDismiss().then(d=>{
        console.log("Se cierra la modal.");
     });
     return await modal.present();
  }

  /**
   * Funcion que cuando se abandona la pagina hace un rset para poner todos los datos como al principio
   */
  ionViewDidLeave(){
    this.reservaForm.reset();
  }


}
