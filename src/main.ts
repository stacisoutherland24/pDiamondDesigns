import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideNgxStripe } from 'ngx-stripe';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideNgxStripe(
      'pk_test_51MKUZrFIGbwCUIy0OnSwPPQaOJbyal7tDwipac7YcQupNwbu9Kd3u9RpSWx8Qb9fWWKWrp4vfG6NyptY7ayFbK3a00OghXy9gO'
    ),
  ],
}).catch((err) => console.error(err));
