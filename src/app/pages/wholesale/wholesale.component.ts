import { Component, OnInit } from '@angular/core';
import { SanityService } from '../../services/sanity.service';
import { AuthService } from '../../services/auth.service'; // Add this import
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wholesale.component.html',
  styleUrl: './wholesale.component.css',
})
export class WholesaleComponent implements OnInit {
  favoriteIds: Set<string> = new Set();
  // Authentication properties - now synced with navbar
  isAuthenticated = false;
  passwordInput = '';
  showError = false;
  private readonly correctPassword = 'w';

  // Your existing properties
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
    { label: 'All', value: 'All' },
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
    private authService: AuthService // Add AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state from navbar
    this.isAuthenticated = false;
    this.loadFavorites();
    // this.authService.loggedIn$.subscribe((isLoggedIn) => {
    //   this.isAuthenticated = isLoggedIn;
    //   // If logged in via navbar, load products
    //   if (isLoggedIn && this.products.length === 0) {
    //     this.loadProducts();
    //   }
    // });

    // Load products if already authenticated
    if (this.isAuthenticated) {
      this.loadProducts();
    }
  }
  loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favoriteIds = new Set(JSON.parse(stored));
    }
  }

  saveFavorites(): void {
    localStorage.setItem(
      'favorites',
      JSON.stringify(Array.from(this.favoriteIds))
    );
  }

  toggleFavorite(product: any, event: MouseEvent): void {
    event.stopPropagation(); // prevent click from bubbling to product nav

    const id = product._id;
    if (this.favoriteIds.has(id)) {
      this.favoriteIds.delete(id);
    } else {
      this.favoriteIds.add(id);
    }
    this.saveFavorites();
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds.has(id);
  }

  private loadProducts(): void {
    this.sanityService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        console.log('Loaded products:', products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  // Password protection method - now syncs with navbar
  checkPassword(): void {
    if (this.passwordInput === this.correctPassword) {
      this.isAuthenticated = true;
      this.authService.login(); // Update navbar state
      this.showError = false;
      this.passwordInput = '';
      this.loadProducts(); // Load products after successful login
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
    console.log('Navigating to product:', productId);
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

    console.log('Adding to cart from grid:', product);
    alert(`Added ${product.title} to cart!`);
  }

  // Updated logout method - now syncs with navbar
  logout(): void {
    this.isAuthenticated = false;
    this.authService.logout(); // Update navbar state
    this.passwordInput = '';
    this.showError = false;
    this.router.navigate(['/']); // Navigate to home
  }
}
