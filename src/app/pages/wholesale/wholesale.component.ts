import { Component, OnInit } from '@angular/core';
import { SanityService } from '../../services/sanity.service';
import { CommonModule } from '@angular/common';
import { ProductLandingComponent } from '../../components/product-landing/product-landing.component';

@Component({
  selector: 'app-wholesale',
  standalone: true,
  imports: [CommonModule, ProductLandingComponent],
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

  constructor(private sanityService: SanityService) {}

  ngOnInit(): void {
    this.sanityService.getProducts().then((data) => {
      this.products = data;
      this.filteredProducts = data; // Initially show all
      console.log(
        'Types:',
        this.products.map((p) => p.type)
      );
      console.log(
        'Loaded types:',
        this.products.map((p) => p.type)
      );
      console.log('Raw data:', data);
    });
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
