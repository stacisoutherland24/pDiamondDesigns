import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SanityService } from '../../services/sanity.service';
import { FavoritesService } from '../../services/favorites.service';
import { AppState } from '../../store/app.state';
import * as CartActions from '../../store/cart/cart.actions';
import {
  selectCartItemById,
  selectCartTotalItems,
} from '../../store/cart/cart.selectors';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  selectedImageIndex: number = 0;
  quantity: number = 1;
  loading: boolean = true;
  error: string | null = null;
  addedMessage: string | null = null;

  // NgRx observables
  isInCart$: Observable<boolean>;
  totalCartItems$: Observable<number>;
  cartItem$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanityService: SanityService,
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
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = 'No product ID provided';
        this.loading = false;
      }
    });
  }

  loadProduct(productId: string): void {
    this.loading = true;
    this.error = null;

    this.sanityService.getProduct(productId).subscribe({
      next: (product: any) => {
        if (product) {
          this.product = product;
          // Initialize cart observables after product is loaded
          this.initializeCartObservables();
          // Update SEO for this specific product
          this.updateProductSeo();
        } else {
          this.error = 'Product not found';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
      },
    });
  }

  private updateProductSeo(): void {
    if (!this.product) return;

    const productImage = this.product.images?.[0]?.asset?.url || 'https://pdiamonddesigns.com/assets/logo.png';
    const productUrl = `https://pdiamonddesigns.com/product/${this.product._id}`;

    // Update meta tags
    this.seoService.updateSeo({
      title: this.product.title,
      description: this.product.description || `Shop ${this.product.title} - authentic handcrafted Native American jewelry from P Diamond Designs. Premium wholesale turquoise and sterling silver jewelry.`,
      keywords: `${this.product.title}, ${this.product.type || 'jewelry'}, Native American jewelry, Southwestern jewelry, turquoise, sterling silver, wholesale jewelry`,
      url: productUrl,
      image: productImage,
      type: 'product'
    });

    // Add product structured data
    this.seoService.updateProductSchema({
      name: this.product.title,
      description: this.product.description || `Authentic handcrafted ${this.product.title} from P Diamond Designs`,
      image: productImage,
      price: this.product.price,
      currency: 'USD',
      availability: 'https://schema.org/InStock',
      brand: 'P Diamond Designs',
      sku: this.product._id
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

  selectImage(index: number): void {
    if (
      this.product?.images &&
      index >= 0 &&
      index < this.product.images.length
    ) {
      this.selectedImageIndex = index;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    // Create product object for NgRx store
    const productForCart = {
      id: this.product._id,
      name: this.product.title,
      title: this.product.title,
      price: this.product.price,
      description: this.product.description,
      image: this.getCurrentImageUrl(),
      // Add any other product properties you need
    };

    // Dispatch add to cart action for each quantity
    for (let i = 0; i < this.quantity; i++) {
      this.store.dispatch(CartActions.addToCart({ product: productForCart }));
    }

    // Show success message
    this.addedMessage = `Added ${this.quantity} ${this.product.title} to cart!`;

    // Clear message after 3 seconds
    setTimeout(() => {
      this.addedMessage = null;
    }, 3000);

    // Reset quantity to 1 after adding
    this.quantity = 1;
  }

  removeFromCart(): void {
    if (this.product?._id) {
      this.store.dispatch(
        CartActions.removeFromCart({ productId: this.product._id })
      );
      this.addedMessage = `Removed ${this.product.title} from cart!`;
      setTimeout(() => {
        this.addedMessage = null;
      }, 3000);
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

  goBack(): void {
    // Navigate back to products page
    this.router.navigate(['/products']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
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

  // Helper method to format price
  getFormattedPrice(): string {
    return this.product?.price
      ? `$${this.product.price.toFixed(2)}`
      : 'Price not available';
  }

  // Helper method to get total price for current quantity
  getTotalPrice(): string {
    if (this.product?.price) {
      return `$${(this.product.price * this.quantity).toFixed(2)}`;
    }
    return 'Price not available';
  }

  toggleFavorite(): void {
    if (this.product) {
      this.favoritesService.toggleFavorite(this.product._id);
    }
  }

  isFavorite(): boolean {
    return this.product
      ? this.favoritesService.isFavorite(this.product._id)
      : false;
  }
}
