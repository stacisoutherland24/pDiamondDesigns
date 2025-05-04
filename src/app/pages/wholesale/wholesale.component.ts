declare var Stripe: any;
import { Component } from '@angular/core';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [],
  templateUrl: './wholesale.component.html',
  styleUrl: './wholesale.component.css',
})
export class WholesaleComponent {
  redirectToStripe() {
    const stripe = Stripe(
      'pk_test_51MKUZrFIGbwCUIy0OnSwPPQaOJbyal7tDwipac7YcQupNwbu9Kd3u9RpSWx8Qb9fWWKWrp4vfG6NyptY7ayFbK3a00OghXy9gO'
    );

    stripe
      .redirectToCheckout({
        lineItems: [
          {
            price: 'price_1NXXXXXX', // replace with your actual Price ID from Stripe
            quantity: 1,
          },
        ],
        mode: 'payment',
        successUrl: 'https://your-site.com/success',
        cancelUrl: 'https://your-site.com/cancel',
      })
      .then((result: { error: { message: any; }; }) => {
        if (result.error) {
          console.error(result.error.message);
        }
      });
  }
}
