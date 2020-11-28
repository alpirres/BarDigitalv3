import { Component, OnInit, ViewChild } from '@angular/core';
import { IonVirtualScroll, ModalController, AlertController, IonItemSliding } from '@ionic/angular';
import { Comida } from 'src/app/Model/Comida';
import { AuthService } from 'src/app/services/auth.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { UiService } from 'src/app/services/ui.service';
import { ShowqrPage } from '../showqr/showqr.page';

@Component({
  selector: 'app-list-reservas',
  templateUrl: './list-reservas.page.html',
  styleUrls: ['./list-reservas.page.scss'],
})
export class ListReservasPage implements OnInit {

  @ViewChild(IonVirtualScroll, {static:true}) virtualScroll: IonVirtualScroll;
  dataList:Comida[];
  textoBusqueda = '';
  datosfiltrados: Comida[];

  constructor(private ui:UiService, 
    private reserva:ReservaService,
    private modalController: ModalController,
    public alertController: AlertController
    ) {
      
    }

  ngOnInit() {
    this.refrescar();
  }

  public doRefresh(e:any){
    this.refrescar().then(()=>{
      e.target.complete()
    },
    error => {
      console.log('Refrescar fallido')
      e.target.complete()
    });
}

  private async refrescar() {
    
    await this.ui.showLoading();
    console.log(this.dataList);
    this.dataList = [];
    try{
      console.log(this.dataList);
      this.reserva.readTodo(AuthService.user.userId).subscribe((lista) => {
      this.dataList = lista;
      console.log(this.dataList);
      this.ui.hideLoad();
      this.cargarDatosAFiltro();
      },
      error=>{
        console.log('Cargar fallido')
      });
    }catch{
      console.log('Cargar fallido')
      this.ui.hideLoad();
    }
  }

  public searchBar(evt){
    console.log(evt.target.value);
    let texto=evt.target.value;
    this.textoBusqueda =texto;
    this.cargarDatosAFiltro();
    if (!this.textoBusqueda && this.textoBusqueda != "undefined") {
      console.log(this.textoBusqueda)
      console.log("return buscarnota");
      return;
    }

    this.datosfiltrados = this.datosfiltrados.filter(item => {
      console.log("filtrando");
      if (item.fecha && item) {
        console.log(item.fecha && item);
        if (item.fecha.toLowerCase().indexOf(this.textoBusqueda.toLowerCase()) > -1 || item.hora.toLowerCase().indexOf(this.textoBusqueda.toLowerCase()) > -1) {
          console.log("Return true");
          return true;
        }
        console.log("Return false");
        return false;
      }
    });
    console.log(this.datosfiltrados)

  }

  cargarDatosAFiltro(): void {
    this.datosfiltrados = this.dataList;
  }

  async editaComida(id:string ,fecha:string ,hora:string , slidingItem: IonItemSliding){
    
    const modal = await this.modalController.create({
      
      component: ShowqrPage,
      componentProps: {
        id:id, 
        fecha:fecha, 
        hora: hora
      }
     });
     modal.onWillDismiss().then(d=>{
        console.log("Se cierra la modal.");
        this.refrescar();
     });
     slidingItem.close();
     return await modal.present();
  }

   public async borraComida(id: string, slidingItem: IonItemSliding) {
    var choice= await this.ui.presentAlertMultipleButtons('Confirmar', 'Deasea eliminar la nota', 'Cancel', 'Okay');
    if(choice==false){
         this.reserva.deleteTodo(id).then((salida) => {
          this.refrescar();
          console.log("Borrando");
          this.ui.presentToast('Nota Eliminada',2000,'success');
        }).catch((err) => {
          console.log(err);
        })
        console.log('Confirm Okay');
        slidingItem.close();
      }
    
  }   


}
