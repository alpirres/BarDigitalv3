import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowqrPageRoutingModule } from './showqr-routing.module';

import { ShowqrPage } from './showqr.page';
import { ReservaPageModule } from '../reserva/reserva.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaPageModule,
    NgxQRCodeModule,
    ShowqrPageRoutingModule
  ],
  declarations: [ShowqrPage],
  exports:[ ShowqrPage ]
})
export class ShowqrPageModule {}
