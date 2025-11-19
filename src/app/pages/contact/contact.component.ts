// contact.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  submitError = false;

  // EmailJS configuration - Replace with your actual values
  private readonly EMAILJS_SERVICE_ID = 'service_flyublo'; // e.g., 'service_abc123'
  private readonly EMAILJS_TEMPLATE_ID = 'template_co5qyic'; // e.g., 'template_xyz789'
  private readonly EMAILJS_PUBLIC_KEY = 'ZUPKV5diK_sUhR9bF'; // e.g., 'user_abcdef123456'

  constructor(private fb: FormBuilder, private seoService: SeoService) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Initialize EmailJS with your public key
    emailjs.init(this.EMAILJS_PUBLIC_KEY);

    // Update SEO meta tags
    this.seoService.updateSeo({
      title: 'Contact Us',
      description: 'Contact P Diamond Designs for wholesale Native American and Southwestern jewelry inquiries. Get in touch with our team for product information, orders, and customer support.',
      keywords: 'contact P Diamond Designs, wholesale jewelry inquiry, Native American jewelry contact, jewelry supplier contact, wholesale order inquiry',
      url: 'https://pdiamonddesigns.com/contact',
      type: 'website'
    });

    // Add breadcrumb schema
    this.seoService.updateBreadcrumbSchema([
      { name: 'Home', url: 'https://pdiamonddesigns.com/' },
      { name: 'Contact', url: 'https://pdiamonddesigns.com/contact' }
    ]);
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;

      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: `${this.contactForm.value.firstName} ${
          this.contactForm.value.lastName || ''
        }`.trim(),
        from_email: this.contactForm.value.email,
        subject: 'P Diamond Designs Contact Form',
        message: this.contactForm.value.message,
        to_email: 'kerry@pdiamonddesigns.com',
        reply_to: this.contactForm.value.email,
      };

      // Send email using EmailJS
      emailjs
        .send(
          this.EMAILJS_SERVICE_ID,
          this.EMAILJS_TEMPLATE_ID,
          templateParams,
          this.EMAILJS_PUBLIC_KEY
        )
        .then(
          (response: EmailJSResponseStatus) => {
            console.log(
              'Email sent successfully!',
              response.status,
              response.text
            );
            this.isSubmitting = false;
            this.isSubmitted = true;

            // Reset form after 3 seconds
            setTimeout(() => {
              this.isSubmitted = false;
              this.contactForm.reset();
            }, 3000);
          },
          (error) => {
            console.error('Failed to send email:', error);
            this.isSubmitting = false;
            this.submitError = true;

            // Hide error message after 5 seconds
            setTimeout(() => {
              this.submitError = false;
            }, 5000);
          }
        );
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}
