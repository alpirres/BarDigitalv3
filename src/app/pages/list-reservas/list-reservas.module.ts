import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListReservasPageRoutingModule } from './list-reservas-routing.module';

import { ListReservasPage } from './list-reservas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListReservasPageRoutingModule
  ],
  declarations: [ListReservasPage]
})
export class ListReservasPageModule {}
