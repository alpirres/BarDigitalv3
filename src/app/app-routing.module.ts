import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuardService]
  },
  
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'reserva/:m',
    loadChildren: () => import('./pages/reserva/reserva.module').then( m => m.ReservaPageModule), canActivate: [AuthGuardService]
  },
  {
    path: 'showqr',
    loadChildren: () => import('./pages/showqr/showqr.module').then( m => m.ShowqrPageModule), canActivate: [AuthGuardService]
  },
  {
    path: 'list-reservas',
    loadChildren: () => import('./pages/list-reservas/list-reservas.module').then( m => m.ListReservasPageModule), canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
