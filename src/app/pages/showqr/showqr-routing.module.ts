import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowqrPage } from './showqr.page';

const routes: Routes = [
  {
    path: '',
    component: ShowqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowqrPageRoutingModule {}
