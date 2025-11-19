import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'About Us',
      description: 'Learn about P Diamond Designs - your trusted source for premium wholesale Native American and Southwestern jewelry. Discover our story and commitment to authentic handcrafted jewelry.',
      keywords: 'about P Diamond Designs, wholesale jewelry company, Native American jewelry supplier, Southwestern jewelry wholesaler, jewelry business history',
      url: 'https://pdiamonddesigns.com/about',
      type: 'website'
    });

    // Add breadcrumb schema
    this.seoService.updateBreadcrumbSchema([
      { name: 'Home', url: 'https://pdiamonddesigns.com/' },
      { name: 'About', url: 'https://pdiamonddesigns.com/about' }
    ]);
  }
}
