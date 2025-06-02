import { Injectable } from '@angular/core';
import { createClient } from '@sanity/client';
import { Observable, from } from 'rxjs';

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

  getProducts(): Observable<any[]> {
    const query =
      '*[_type == "product"]{_id, title, price, type, description, images[]{asset->{url}}}';
    return from(this.client.fetch(query));
  }


  getProduct(productId: string): Observable<any> {
    const query = `*[_type == "product" && _id == "${productId}"][0]{
      _id,
      title,
      price,
      type,
      description,
      images[]{
        asset->{
          _id,
          url
        }
      }
    }`;
    return from(this.client.fetch(query));
  }
}
