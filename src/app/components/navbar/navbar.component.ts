import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { selectCartTotalItems } from '../../store/cart/cart.selectors'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  loggedIn = false;
  cartItemCount$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {
    // Subscribe to cart total items from NgRx store
    this.cartItemCount$ = this.store.select(selectCartTotalItems);
  }

  ngOnInit(): void {
    // Set initial state
    this.loggedIn = this.authService.isLoggedIn;

    // Subscribe to changes
    this.authService.loggedIn$.subscribe(
      (isLoggedIn) => (this.loggedIn = isLoggedIn)
    );
  }

  login(): void {
    console.log('Navbar login clicked - navigating to wholesale');
    // Don't call authService.login() here - just navigate to wholesale page
    // The password overlay will show because user isn't authenticated yet
    this.router.navigate(['/wholesale']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getFavoritesCount(): number {
    return this.favoritesService.getFavoritesCount();
  }
}
