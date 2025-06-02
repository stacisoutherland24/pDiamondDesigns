import { Component, OnInit } from '@angular/core';
import { SanityService } from '../../services/sanity.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wholesale.component.html',
  styleUrl: './wholesale.component.css',
})
export class WholesaleComponent implements OnInit {
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

  constructor(private sanityService: SanityService, private router: Router) {}

  ngOnInit(): void {
    this.sanityService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        console.log('Loaded products:', products); // For debugging
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }
  navigateToProduct(productId: string): void {
    console.log('Navigating to product:', productId); // For debugging
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
    // Prevent navigation when clicking add to cart button
    if (event) {
      event.stopPropagation();
    }

    console.log('Adding to cart from grid:', product);

    // TODO: Implement your cart logic here
    // For now, just show an alert
    alert(`Added ${product.title} to cart!`);
  }

  // redirectToStripe() {
  //   const stripe = Stripe('your-stripe-key');
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: 'price_1NXXXXXX', quantity: 1 }],
  //       mode: 'payment',
  //       successUrl: 'https://your-site.com/success',
  //       cancelUrl: 'https://your-site.com/cancel',
  //     })
  //     .then((result: { error: { message: any } }) => {
  //       if (result.error) {
  //         console.error(result.error.message);
  //       }
  //     });
  // }
}
