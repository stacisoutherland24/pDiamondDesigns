import { Injectable } from '@angular/core';
import { createClient } from '@sanity/client';

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  private client = createClient({
    projectId: '6qfjwyua',
    dataset: 'jewelry',
    useCdn: true,
    apiVersion: '2023-01-01',
  });

  getProducts() {
    return this.client.fetch(
         '*[_type == "product"]{title, price, type, description, images[]{asset->{url}}}'
    );
  }
}
