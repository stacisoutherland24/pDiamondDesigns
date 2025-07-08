import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideNgxStripe } from 'ngx-stripe';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CartEffects } from './app/store/cart/cart.effects'; 
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { cartReducer } from './app/store/cart/cart.reducer';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideNgxStripe(
      'pk_test_51MKUZrFIGbwCUIy0OnSwPPQaOJbyal7tDwipac7YcQupNwbu9Kd3u9RpSWx8Qb9fWWKWrp4vfG6NyptY7ayFbK3a00OghXy9gO'
    ),
    provideStore({ cart: cartReducer }),
    provideEffects([CartEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
}).catch((err) => console.error(err));
