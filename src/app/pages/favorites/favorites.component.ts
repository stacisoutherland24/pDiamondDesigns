import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { SanityService } from '../../services/sanity.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as CartActions from '../../store/cart/cart.actions';
import { selectCartTotalItems } from '../../store/cart/cart.selectors';
import { SeoService } from '../../services/seo.service';
import emailjs from '@emailjs/browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: any[] = [];
  loading = false;

  // NgRx observables
  totalCartItems$: Observable<number>;

  // Email order properties
  showEmailForm = false;
  customerName = '';
  customerEmail = '';
  customerMessage = '';
  emailSending = false;
  emailSuccess = false;
  emailError = false;

  // Product quantities for order
  productQuantities: { [productId: string]: number } = {};
  removedFromOrder: Set<string> = new Set();

  constructor(
    private favoritesService: FavoritesService,
    private sanityService: SanityService,
    private router: Router,
    private store: Store<AppState>,
    private seoService: SeoService
  ) {
    // Initialize cart observables
    this.totalCartItems$ = this.store.select(selectCartTotalItems);
  }

  ngOnInit(): void {
    // Update SEO meta tags
    this.seoService.updateSeo({
      title: 'My Favorites',
      description:
        'View and manage your favorite wholesale jewelry items from P Diamond Designs.',
      url: 'https://pdiamonddesigns.com/favorites',
      type: 'website',
      robots: 'noindex, nofollow', // User-specific page
    });

    this.loadFavoriteProducts();

    // Subscribe to favorites changes
    this.favoritesService.favorites$.subscribe(() => {
      this.loadFavoriteProducts();
    });
  }

  private loadFavoriteProducts(): void {
    const favoriteIds = this.favoritesService.getFavorites();

    if (favoriteIds.length === 0) {
      this.favoriteProducts = [];
      return;
    }

    this.loading = true;

    // Get all products and filter by favorites
    this.sanityService.getProducts().subscribe({
      next: (products) => {
        this.favoriteProducts = products.filter((product) =>
          favoriteIds.includes(product._id)
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading favorite products:', error);
        this.loading = false;
      },
    });
  }

  removeFavorite(productId: string): void {
    this.favoritesService.toggleFavorite(productId);
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: any): void {
    if (!product) return;

    const productForCart = {
      id: product._id,
      name: product.title,
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.images?.[0]?.asset?.url || '',
    };

    // Dispatch add to cart action
    this.store.dispatch(CartActions.addToCart({ product: productForCart }));

    // Optional: Show a success message
    console.log(`Added ${product.title} to cart!`);
  }

  clearAllFavorites(): void {
    this.favoritesService.clearAllFavorites();
  }

  // Optional: Navigate to cart
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  openEmailForm(): void {
    if (this.favoriteProducts.length === 0) {
      return;
    }
    // Initialize quantities to 1 for each product
    this.favoriteProducts.forEach((product) => {
      if (!this.productQuantities[product._id]) {
        this.productQuantities[product._id] = 1;
      }
    });
    this.showEmailForm = true;
    this.emailSuccess = false;
    this.emailError = false;
  }

  closeEmailForm(): void {
    this.showEmailForm = false;
    this.customerName = '';
    this.customerEmail = '';
    this.customerMessage = '';
    this.productQuantities = {};
    this.removedFromOrder.clear();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity >= 1) {
      this.productQuantities[productId] = quantity;
    }
  }

  getQuantity(productId: string): number {
    return this.productQuantities[productId] || 1;
  }

  getOrderTotal(): number {
    return this.favoriteProducts.reduce((total, product) => {
      if (this.removedFromOrder.has(product._id)) return total;
      const quantity = this.productQuantities[product._id] || 1;
      return total + product.price * quantity;
    }, 0);
  }

  getTotalItems(): number {
    return this.favoriteProducts.reduce((total, product) => {
      if (this.removedFromOrder.has(product._id)) return total;
      return total + (this.productQuantities[product._id] || 1);
    }, 0);
  }

  removeFromOrder(productId: string): void {
    this.removedFromOrder.add(productId);
  }

  isRemovedFromOrder(productId: string): boolean {
    return this.removedFromOrder.has(productId);
  }

  sendEmailOrder(): void {
    if (!this.customerName || !this.customerEmail) {
      return;
    }

    this.emailSending = true;
    this.emailSuccess = false;
    this.emailError = false;

    // Build the product list for the email with quantities (excluding removed items)
    let productList = '';
    let totalPrice = 0;
    let totalItems = 0;
    let itemNumber = 0;

    this.favoriteProducts.forEach((product) => {
      if (this.removedFromOrder.has(product._id)) return;
      itemNumber++;
      const quantity = this.productQuantities[product._id] || 1;
      const lineTotal = product.price * quantity;
      productList += `${itemNumber}. ${product.title} - $${product.price} x ${quantity} = $${lineTotal.toFixed(2)}\n`;
      totalPrice += lineTotal;
      totalItems += quantity;
    });

    // Email to P Diamond (Kerry and Staci)
    const businessEmailParams = {
      from_name: this.customerName,
      from_email: this.customerEmail,
      to_email: 'stacisoutherland24@gmail.com, kerry@pdiamonddesigns.com',
      reply_to: this.customerEmail,
      subject: `Wholesale Order from ${this.customerName}`,
      product_list: productList,
      product_count: totalItems,
      total_price: totalPrice.toFixed(2),
      message: this.customerMessage || 'No additional message provided.',
    };

    // Confirmation email to customer
    const customerEmailParams = {
      from_name: 'P Diamond Designs',
      from_email: 'kerry@pdiamonddesigns.com',
      to_email: this.customerEmail,
      reply_to: 'kerry@pdiamonddesigns.com',
      subject: `Order Confirmation - P Diamond Designs`,
      product_list: productList,
      product_count: totalItems,
      total_price: totalPrice.toFixed(2),
      message: `Thank you for your order, ${this.customerName}! Your wholesale order has been sent to Kerry at P Diamond Designs. We will review your order and get back to you soon.\n\nYour additional message: ${this.customerMessage || 'None'}`,
    };

    // EmailJS credentials
    const serviceId = 'service_flyublo';
    const templateId = 'template_order';
    const publicKey = 'ZUPKV5diK_sUhR9bF';

    // Send both emails
    Promise.all([
      emailjs.send(serviceId, templateId, businessEmailParams, publicKey),
      emailjs.send(serviceId, templateId, customerEmailParams, publicKey),
    ]).then(
      () => {
        this.emailSending = false;
        this.emailSuccess = true;
        this.customerName = '';
        this.customerEmail = '';
        this.customerMessage = '';

        // Auto-close after 3 seconds
        setTimeout(() => {
          this.showEmailForm = false;
          this.emailSuccess = false;
        }, 3000);
      },
      (error) => {
        console.error('EmailJS error:', error);
        this.emailSending = false;
        this.emailError = true;
      }
    );
  }
}
