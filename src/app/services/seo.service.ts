import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  robots?: string;
  canonical?: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly siteName = 'P Diamond Designs';
  private readonly siteUrl = 'https://pdiamonddesigns.com';
  private readonly defaultImage = 'https://pdiamonddesigns.com/assets/logo.webp';
  private readonly twitterHandle = '@pdiamonddesigns';

  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSeo(config: SeoConfig): void {
    const fullTitle = config.title === this.siteName
      ? config.title
      : `${config.title} | ${this.siteName}`;

    // Set page title
    this.titleService.setTitle(fullTitle);

    // Basic meta tags
    this.updateMetaTag('description', config.description);

    if (config.keywords) {
      this.updateMetaTag('keywords', config.keywords);
    }

    if (config.author) {
      this.updateMetaTag('author', config.author);
    }

    // Robots
    this.updateMetaTag('robots', config.robots || 'index, follow');

    // Open Graph tags
    this.updateMetaTag('og:title', fullTitle, 'property');
    this.updateMetaTag('og:description', config.description, 'property');
    this.updateMetaTag('og:type', config.type || 'website', 'property');
    this.updateMetaTag('og:url', config.url || this.siteUrl, 'property');
    this.updateMetaTag('og:image', config.image || this.defaultImage, 'property');
    this.updateMetaTag('og:site_name', this.siteName, 'property');
    this.updateMetaTag('og:locale', 'en_US', 'property');

    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:site', this.twitterHandle);
    this.updateMetaTag('twitter:title', fullTitle);
    this.updateMetaTag('twitter:description', config.description);
    this.updateMetaTag('twitter:image', config.image || this.defaultImage);

    // Canonical URL
    this.updateCanonicalUrl(config.canonical || config.url || this.siteUrl);
  }

  updateProductSchema(product: ProductSchema): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand || this.siteName
      },
      offers: {
        '@type': 'Offer',
        price: product.price || 0,
        priceCurrency: product.currency || 'USD',
        availability: product.availability || 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: this.siteName
        }
      }
    };

    if (product.sku) {
      (schema as any).sku = product.sku;
    }

    this.addJsonLdSchema(schema);
  }

  updateLocalBusinessSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'JewelryStore',
      name: this.siteName,
      description: 'Premium wholesale Native American and Southwestern jewelry. Authentic handcrafted turquoise, sterling silver, and gemstone jewelry.',
      url: this.siteUrl,
      logo: this.defaultImage,
      image: this.defaultImage,
      telephone: '',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dallas',
        addressRegion: 'TX',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 32.7767,
        longitude: -96.7970
      },
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00'
      }
    };

    this.addJsonLdSchema(schema);
  }

  updateBreadcrumbSchema(items: { name: string; url: string }[]): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };

    this.addJsonLdSchema(schema);
  }

  updateOrganizationSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      url: this.siteUrl,
      logo: this.defaultImage,
      description: 'Premium wholesale Native American and Southwestern jewelry supplier.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'English'
      },
      sameAs: []
    };

    this.addJsonLdSchema(schema);
  }

  private updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    const selector = attribute === 'property'
      ? `property="${name}"`
      : `name="${name}"`;

    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }

  private updateCanonicalUrl(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private addJsonLdSchema(schema: object): void {
    // Remove existing schema scripts (to prevent duplicates on navigation)
    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  removeStructuredData(): void {
    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }
}
