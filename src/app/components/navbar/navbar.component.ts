import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router) {}
  loggedIn = false;

  login(): void {
    this.loggedIn = true;
    this.router.navigate(['/wholesale']);
  }

  logout(): void {
    this.loggedIn = false;
    this.router.navigate(['']);
  }
}
