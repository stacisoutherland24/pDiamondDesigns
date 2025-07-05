import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SanityService } from '../../services/sanity.service'; 
import { FavoritesService } from '../../services/favorites.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanityService: SanityService,
    private favoritesService: FavoritesService
  ) {}

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

    // Create cart item object
    const cartItem = {
      product: this.product,
      quantity: this.quantity,
      totalPrice: this.product.price * this.quantity,
    };

    // TODO: Implement your cart service logic here
    // Example:
    // this.cartService.addToCart(cartItem);

    // Show success message or redirect
    alert(`Added ${this.quantity} ${this.product.title} to cart!`);
  }

  goBack(): void {
    // Navigate back to products page
    this.router.navigate(['/products']);
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
