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
  isSearchBarOpened: boolean = false;

  constructor(private ui:UiService, 
    private reserva:ReservaService,
    private modalController: ModalController,
    public alertController: AlertController
    ) {}

    /**
     * Funcion que se ejecuta al entrar a la pagina
     */
  ngOnInit() {
    this.refrescar();
  }

  /**
   * Funcion que muestra y oculta la barra de buscar
   */
  alternarSearchbar() {
    this.isSearchBarOpened = !this.isSearchBarOpened;
  }

  /**
   * Funcion que llama a la funcion refrescar()
   * Then: terminar el elvento
   * Error: mostrar mensaje en consola y terminar el evento 
   * @param e evento de arrastrar hacia abajo 
   */
  public doRefresh(e:any){
    this.refrescar().then(()=>{
      e.target.complete()
    },
    error => {
      console.log('Refrescar fallido')
      e.target.complete()
    });
}


/**
 * Funcion muetra un loading, carga los datos de firebase y cierra el loading
 */
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

  /**
   * Funcion que aplica un filtro sobre los los datos y solo muestra los que coinciden con la busquedad
   * @param evt evento que cambia conforme se va escribiendo en la barrade busquedad
   */
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

  /**
   * Funcion que carga los datos en otro array para mostrar los filtrados
   */
  cargarDatosAFiltro(): void {
    this.datosfiltrados = this.dataList;
  }

  /**
   * Funcion abre y cierra un modal con los datos de una reserva, llama a la funcion refrescar() y cierra el slaiding abierto
   * @param id string con el identificador de la reserva
   * @param fecha string con la fecha de la reserva
   * @param hora string con la hora de la reserva
   * @param slidingItem IonItemSlinding que corresponde al deslizar hacia derecha o izquierda
   */
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

  /**
   * Funcion que borra una reserva de la base de datos con un alert de confirmacion, que si pulsamos en okey debuelve false
   * y se ejecuta la funcion deleteTodo
   * @param id string con el id de la reserva
   * @param slidingItem IonItemSlinding que corresponde al deslizar hacia derecha o izquierda
   */
   public async borraComida(id: string, slidingItem: IonItemSliding) {
    var choice= await this.ui.presentAlertMultipleButtons('Confirmar', 'Deasea eliminar la reserva', 'Cancel', 'Okay');
    if(choice==false){
         this.reserva.deleteTodo(id).then((salida) => {
          this.refrescar();
          console.log("Borrando");
          this.ui.presentToast('Eliminada Correctamente',2000,'success');
        }).catch((err) => {
          console.log(err);
        })
        console.log('Confirm Okay');
        slidingItem.close();
      }
    
  }   


}
