import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { WarehouseComponent } from './pages/warehouse/warehouse.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'about', component: AboutComponent }, 
  { path: 'registration', component: RegistrationComponent }, 
  { path: 'warehouse', component: WarehouseComponent }, 
];
