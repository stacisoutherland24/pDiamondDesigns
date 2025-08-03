// Updated navbar.component.ts - ADD THESE IMPORTS AND METHODS
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../store/app.state';
import { selectCartTotalItems } from '../../store/cart/cart.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  // ADD THIS LINE
  @ViewChild('navbarNav', { static: false }) navbarNav!: ElementRef;

  loggedIn = false;
  cartItemCount$: Observable<number>;
  // ADD THIS LINE
  private subscriptions: Subscription = new Subscription();

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

    // Subscribe to changes - UPDATED TO USE SUBSCRIPTION MANAGEMENT
    const authSub = this.authService.loggedIn$.subscribe(
      (isLoggedIn) => (this.loggedIn = isLoggedIn)
    );
    this.subscriptions.add(authSub);
  }

  // ADD THIS METHOD
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ADD THESE MOBILE MENU METHODS
  toggleNavbar() {
    const navbar = document.querySelector('.navbar-collapse');
    const body = document.body;

    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
      body.classList.remove('navbar-open');
    } else {
      navbar?.classList.add('show');
      body.classList.add('navbar-open');
    }
  }

  closeNavbar(): void {
    const navbarCollapse = this.navbarNav.nativeElement;
    navbarCollapse.classList.remove('show');

    const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
    if (toggler) {
      toggler.setAttribute('aria-expanded', 'false');
      toggler.classList.add('collapsed');
    }
  }

  openNavbar(): void {
    const navbarCollapse = this.navbarNav.nativeElement;
    navbarCollapse.classList.add('show');

    const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
    if (toggler) {
      toggler.setAttribute('aria-expanded', 'true');
      toggler.classList.remove('collapsed');
    }
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navbarCollapse = this.navbarNav?.nativeElement;
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (
      navbarCollapse &&
      navbarCollapse.classList.contains('show') &&
      !navbarCollapse.contains(target) &&
      !navbarToggler?.contains(target)
    ) {
      this.closeNavbar();
    }
  }

  // YOUR EXISTING METHODS - UPDATED TO CLOSE MOBILE MENU
  login(): void {
    console.log('Navbar login clicked - navigating to wholesale');
    // Don't call authService.login() here - just navigate to wholesale page
    // The password overlay will show because user isn't authenticated yet
    this.router.navigate(['/wholesale']);
    this.closeNavbar(); // ADD THIS LINE
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeNavbar(); // ADD THIS LINE
  }

  getFavoritesCount(): number {
    return this.favoritesService.getFavoritesCount();
  }
}
