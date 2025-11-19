import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../store/cart/cart.state';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;

  constructor(
    private cartService: CartService,
    private seoService: SeoService
  ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.total$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    // Update SEO meta tags
    this.seoService.updateSeo({
      title: 'Shopping Cart',
      description: 'Review your wholesale jewelry order from P Diamond Designs. Complete your purchase of authentic Native American and Southwestern jewelry.',
      url: 'https://pdiamonddesigns.com/cart',
      type: 'website',
      robots: 'noindex, nofollow' // User-specific page
    });
  }

  incrementQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem): void {
    this.cartService.decrementItem(item);
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }
}
