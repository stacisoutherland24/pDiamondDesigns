import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoriteIds: Set<string> = new Set();
  private favoritesSubject = new BehaviorSubject<Set<string>>(new Set());

  // Observable for components to subscribe to
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favoriteIds = new Set(JSON.parse(stored));
      this.favoritesSubject.next(new Set(this.favoriteIds));
    }
  }

  private saveFavorites(): void {
    localStorage.setItem(
      'favorites',
      JSON.stringify(Array.from(this.favoriteIds))
    );
    this.favoritesSubject.next(new Set(this.favoriteIds));
  }

  getFavoritesCount(): number {
    return this.favoriteIds.size;
  }

  toggleFavorite(productId: string): void {
    if (this.favoriteIds.has(productId)) {
      this.favoriteIds.delete(productId);
    } else {
      this.favoriteIds.add(productId);
    }
    this.saveFavorites();
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIds.has(productId);
  }

  getFavorites(): string[] {
    return Array.from(this.favoriteIds);
  }

  addToFavorites(productId: string): void {
    this.favoriteIds.add(productId);
    this.saveFavorites();
  }

  removeFromFavorites(productId: string): void {
    this.favoriteIds.delete(productId);
    this.saveFavorites();
  }

  // NEW METHOD: Clear all favorites at once
  clearAllFavorites(): void {
    this.favoriteIds.clear(); // Clear the entire Set
    this.saveFavorites(); // This will save empty array to localStorage and emit the change
  }
}
