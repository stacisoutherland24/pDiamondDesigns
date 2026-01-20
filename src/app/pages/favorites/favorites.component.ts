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
    this.showEmailForm = true;
    this.emailSuccess = false;
    this.emailError = false;
  }

  closeEmailForm(): void {
    this.showEmailForm = false;
    this.customerName = '';
    this.customerEmail = '';
    this.customerMessage = '';
  }

  sendEmailOrder(): void {
    if (!this.customerName || !this.customerEmail) {
      return;
    }

    this.emailSending = true;
    this.emailSuccess = false;
    this.emailError = false;

    // Build the product list for the email
    let productList = '';
    let totalPrice = 0;

    this.favoriteProducts.forEach((product, index) => {
      productList += `${index + 1}. ${product.title} - $${product.price}\n`;
      totalPrice += product.price;
    });

    const templateParams = {
      from_name: this.customerName,
      from_email: this.customerEmail,
      to_email: 'stacisoutherland24@gmail.com',
      reply_to: this.customerEmail,
      subject: `Wholesale Order from ${this.customerName}`,
      product_list: productList,
      product_count: this.favoriteProducts.length,
      total_price: totalPrice.toFixed(2),
      message: this.customerMessage || 'No additional message provided.',
    };

    // EmailJS credentials - you'll need to create a new template for orders
    const serviceId = 'service_flyublo';
    const templateId = 'template_order'; // Create this template in EmailJS dashboard
    const publicKey = 'ZUPKV5diK_sUhR9bF';

    emailjs.send(serviceId, templateId, templateParams, publicKey).then(
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
