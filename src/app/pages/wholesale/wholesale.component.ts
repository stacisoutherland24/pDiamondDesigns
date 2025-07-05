import { Component, OnInit } from '@angular/core';
import { SanityService } from '../../services/sanity.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wholesale.component.html',
  styleUrl: './wholesale.component.css',
})
export class WholesaleComponent implements OnInit {
  // Authentication properties
  isAuthenticated = false;
  passwordInput = '';
  showError = false;
  private readonly correctPassword = 'Pdiamond!';

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
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
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
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
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

  addToCart(product: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    alert(`Added ${product.title} to cart!`);
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authService.logout(); 
    this.passwordInput = '';
    this.showError = false;
    this.router.navigate(['/']);
  }
}
