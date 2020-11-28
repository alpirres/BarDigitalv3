import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListReservasPage } from './list-reservas.page';

const routes: Routes = [
  {
    path: '',
    component: ListReservasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListReservasPageRoutingModule {}
