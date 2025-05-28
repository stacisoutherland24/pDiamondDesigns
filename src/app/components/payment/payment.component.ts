import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StripeCardComponent],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  stripeTest: FormGroup;

  constructor(private fb: FormBuilder, private stripeService: StripeService) {
    this.stripeTest = this.fb.group({
      name: [''],
    });
  }

  pay(card: StripeCardComponent): void {
    const name = this.stripeTest.get('name')?.value;

    this.stripeService.createToken(card.element, { name }).subscribe((result) => {
      if (result.token) {
        console.log('Token:', result.token);
      } else if (result.error) {
        console.error('Error:', result.error.message);
      }
    });
  }
}
