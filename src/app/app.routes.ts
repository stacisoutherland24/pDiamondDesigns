import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { WholesaleComponent } from './pages/wholesale/wholesale.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'wholesale',
    component: WholesaleComponent,
    // Removed AuthGuard - component handles authentication internally
  },
  { path: 'products', component: WholesaleComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '/products' },
];
