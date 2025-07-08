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

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: any[] = [];
  loading = false;

  // NgRx observables
  totalCartItems$: Observable<number>;

  constructor(
    private favoritesService: FavoritesService,
    private sanityService: SanityService,
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize cart observables
    this.totalCartItems$ = this.store.select(selectCartTotalItems);
  }

  ngOnInit(): void {
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
}
