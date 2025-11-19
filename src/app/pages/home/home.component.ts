import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll.directive';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, AnimateOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'P Diamond Designs',
      description: 'P Diamond Designs offers premium wholesale Native American and Southwestern jewelry. Authentic handcrafted turquoise, sterling silver, and gemstone jewelry for retailers.',
      keywords: 'wholesale jewelry, Native American jewelry, Southwestern jewelry, turquoise jewelry, sterling silver, handcrafted jewelry, wholesale gemstone jewelry',
      url: 'https://pdiamonddesigns.com/',
      type: 'website'
    });

    // Add organization structured data for homepage
    this.seoService.updateOrganizationSchema();
    this.seoService.updateLocalBusinessSchema();
  }
}
