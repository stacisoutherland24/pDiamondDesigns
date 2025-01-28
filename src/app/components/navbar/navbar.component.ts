import { Component } from '@angular/core';
import { HomeComponent } from '../../pages/home/home.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  loggedIn = false;

  toggleLogin(): void {
    this.loggedIn = true;
    console.log('Login state:', this.loggedIn);
  }

  toggleLogout(): void {
    this.loggedIn = false ;
    console.log('Login state:', this.loggedIn);
  }
}
