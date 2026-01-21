import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll.directive';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, AnimateOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Showroom carousel
  // Original photos array
  originalPhotos = [
    { src: 'assets/showroom1.jpeg', alt: 'P Diamond Designs Showroom - Display 1' },
    { src: 'assets/showroom2.jpeg', alt: 'P Diamond Designs Showroom - Display 2' },
    { src: 'assets/showroom3.jpeg', alt: 'P Diamond Designs Showroom - Display 3' },
    { src: 'assets/showroom4.jpeg', alt: 'P Diamond Designs Showroom - Display 4' },
    { src: 'assets/showroom5.jpeg', alt: 'P Diamond Designs Showroom - Display 5' },
    { src: 'assets/showroom6.jpeg', alt: 'P Diamond Designs Showroom - Display 6' },
    { src: 'assets/showroom7.jpeg', alt: 'P Diamond Designs Showroom - Display 7' },
    { src: 'assets/showroom8.jpeg', alt: 'P Diamond Designs Showroom - Display 8' },
    { src: 'assets/showroom9.jpeg', alt: 'P Diamond Designs Showroom - Display 9' },
  ];

  // Clone first image at end for seamless looping
  showroomPhotos = [...this.originalPhotos, this.originalPhotos[0]];
  currentSlide = 0;
  isTransitioning = true;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;

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

    // Start carousel auto-play
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // Carousel methods
  nextSlide(): void {
    if (!this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentSlide++;

    // When we reach the cloned slide, instantly jump back to first
    if (this.currentSlide === this.originalPhotos.length) {
      setTimeout(() => {
        this.isTransitioning = false;
        this.currentSlide = 0;
        // Re-enable transitions after the instant jump
        setTimeout(() => {
          this.isTransitioning = true;
        }, 50);
      }, 500); // Match transition duration
    }
    this.resetAutoPlay();
  }

  prevSlide(): void {
    if (!this.isTransitioning) return;
    this.isTransitioning = true;

    if (this.currentSlide === 0) {
      // Instantly jump to the cloned last slide, then animate back
      this.isTransitioning = false;
      this.currentSlide = this.originalPhotos.length;
      setTimeout(() => {
        this.isTransitioning = true;
        this.currentSlide--;
      }, 50);
    } else {
      this.currentSlide--;
    }
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    this.isTransitioning = true;
    this.currentSlide = index;
    this.resetAutoPlay();
  }

  // Get the actual index for indicators (handle cloned slide)
  getIndicatorIndex(): number {
    if (this.currentSlide >= this.originalPhotos.length) {
      return 0;
    }
    return this.currentSlide;
  }

  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
