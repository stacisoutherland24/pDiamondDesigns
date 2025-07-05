import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { SanityService } from '../../services/sanity.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(
    private favoritesService: FavoritesService,
    private sanityService: SanityService,
    private router: Router
  ) {}

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
    alert(`Added ${product.title} to cart!`);
  }

  clearAllFavorites(): void {
      this.favoritesService.clearAllFavorites();
  }
}
