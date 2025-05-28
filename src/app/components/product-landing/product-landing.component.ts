import { Component, Input } from '@angular/core';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-product-landing',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './product-landing.component.html',
  styleUrls: ['./product-landing.component.css'],
})
export class ProductLandingComponent {
  @Input() product: any; // pass in product data from parent

  addedMessage: string | null = null;

  addToCart() {
    // Here you'd call your cart service or emit an event
    // For now, just show a confirmation message:
    this.addedMessage = `${this.product.title} added to cart!`;

    // Optionally clear message after some time:
    setTimeout(() => (this.addedMessage = null), 3000);
  }
}
