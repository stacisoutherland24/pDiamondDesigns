import { Component, OnInit } from '@angular/core';
import { SanityService } from '../../services/sanity.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import * as CartActions from '../../store/cart/cart.actions';
import {
  selectCartItemById,
  selectCartTotalItems,
} from '../../store/cart/cart.selectors';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wholesale.component.html',
  styleUrl: './wholesale.component.css',
})
export class WholesaleComponent implements OnInit {
  product: any = null;
  selectedImageIndex: number = 0;
  // Authentication properties
  isAuthenticated = false;

  quantity: number = 1;
  passwordInput = '';
  showError = false;
  private readonly correctPassword = 'Pdiamond!';

  // NgRx observables
  isInCart$: Observable<boolean>;
  totalCartItems$: Observable<number>;
  cartItem$: Observable<any>;

  featuredProduct: any = {
    title: 'Sample Product',
    description: 'This is a sample product description.',
    price: 99.99,
    images: [{ asset: { url: 'assets/sample-product.jpg' } }],
  };
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = 'All';
  categories = [
    { label: 'Rings', value: 'ring' },
    { label: 'Earrings', value: 'earrings' },
    { label: 'Bracelets', value: 'bracelet' },
    { label: 'Navajo Pearls', value: 'navajoPearls' },
    { label: 'Pendants', value: 'pendant' },
    { label: 'Necklaces', value: 'necklace' },
  ];

  constructor(
    private sanityService: SanityService,
    private router: Router,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private store: Store<AppState>,
    private seoService: SeoService
  ) {
    // Initialize cart observables
    this.totalCartItems$ = this.store.select(selectCartTotalItems);
    this.isInCart$ = new Observable<boolean>((subscriber) =>
      subscriber.next(false)
    );
    this.cartItem$ = new Observable((subscriber) => subscriber.next(null));
  }

  ngOnInit(): void {
    // Update SEO meta tags
    this.seoService.updateSeo({
      title: 'Wholesale Products',
      description: 'Browse our wholesale collection of Native American and Southwestern jewelry. Rings, earrings, bracelets, Navajo pearls, pendants, and necklaces at wholesale prices.',
      keywords: 'wholesale jewelry collection, Native American rings, turquoise earrings, sterling silver bracelets, Navajo pearls, southwestern pendants, wholesale necklaces',
      url: 'https://pdiamonddesigns.com/wholesale',
      type: 'website',
      robots: 'noindex, nofollow' // Products require login
    });

    // Add breadcrumb schema
    this.seoService.updateBreadcrumbSchema([
      { name: 'Home', url: 'https://pdiamonddesigns.com/' },
      { name: 'Wholesale Products', url: 'https://pdiamonddesigns.com/wholesale' }
    ]);

    this.isAuthenticated = this.authService.isLoggedIn;
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      // If logged in and products not loaded yet, load them
      if (isLoggedIn && this.products.length === 0) {
        this.loadProducts();
      }
    });

    // Load products if already authenticated
    if (this.isAuthenticated) {
      this.loadProducts();
    }
  }

  toggleFavorite(product: any, event: MouseEvent): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(product._id);
  }

  isFavorite(id: string): boolean {
    return this.favoritesService.isFavorite(id);
  }

  private loadProducts(): void {
    this.sanityService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        // Initialize cart observables after product is loaded
        this.initializeCartObservables();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }
  private initializeCartObservables(): void {
    if (this.product?._id) {
      // Check if product is in cart
      this.isInCart$ = this.store
        .select(selectCartItemById(this.product._id))
        .pipe(map((item) => !!item));

      // Get cart item details
      this.cartItem$ = this.store.select(selectCartItemById(this.product._id));
    }
  }

  checkPassword(): void {
    if (this.passwordInput === this.correctPassword) {
      this.isAuthenticated = true;
      this.authService.login();
      this.showError = false;
      this.passwordInput = '';
      this.loadProducts();
    } else {
      this.showError = true;
      this.passwordInput = '';
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }

  onPasswordKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkPassword();
    }
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.type?.toLowerCase() === category.toLowerCase()
      );
    }
  }

  addToCart(product: any): void {
    if (!product) return;

    const productForCart = {
      id: product._id,
      name: product.title,
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.images?.[0]?.asset?.url || '', // Use first image
    };

    // Dispatch add to cart action for each quantity
    for (let i = 0; i < this.quantity; i++) {
      this.store.dispatch(CartActions.addToCart({ product: productForCart }));
    }
  }

  // Helper method to check if product has images
  hasImages(): boolean {
    return this.product?.images && this.product.images.length > 0;
  }

  // Helper method to get current image URL
  getCurrentImageUrl(): string {
    if (this.hasImages()) {
      return this.product.images[this.selectedImageIndex]?.asset?.url || '';
    }
    return '';
  }

  removeFromCart(): void {
    if (this.product?._id) {
      this.store.dispatch(
        CartActions.removeFromCart({ productId: this.product._id })
      );
    }
  }

  updateCartQuantity(newQuantity: number): void {
    if (this.product?._id && newQuantity > 0) {
      this.store.dispatch(
        CartActions.updateQuantity({
          productId: this.product._id,
          quantity: newQuantity,
        })
      );
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authService.logout();
    this.passwordInput = '';
    this.showError = false;
    this.router.navigate(['/']);
  }
}
