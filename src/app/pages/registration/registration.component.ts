// registration.component.ts
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
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  submitError = false;

  // EmailJS configuration - Replace with your actual values
  private readonly EMAILJS_SERVICE_ID = 'service_8zenc9n';
  private readonly EMAILJS_TEMPLATE_ID = 'template_obmn5t8';
  private readonly EMAILJS_PUBLIC_KEY = 'ZUPKV5diK_sUhR9bF';

  // US States for dropdown
  states = [
    { value: 'AL', name: 'Alabama' },
    { value: 'AK', name: 'Alaska' },
    { value: 'AZ', name: 'Arizona' },
    { value: 'AR', name: 'Arkansas' },
    { value: 'CA', name: 'California' },
    { value: 'CO', name: 'Colorado' },
    { value: 'CT', name: 'Connecticut' },
    { value: 'DE', name: 'Delaware' },
    { value: 'FL', name: 'Florida' },
    { value: 'GA', name: 'Georgia' },
    { value: 'HI', name: 'Hawaii' },
    { value: 'ID', name: 'Idaho' },
    { value: 'IL', name: 'Illinois' },
    { value: 'IN', name: 'Indiana' },
    { value: 'IA', name: 'Iowa' },
    { value: 'KS', name: 'Kansas' },
    { value: 'KY', name: 'Kentucky' },
    { value: 'LA', name: 'Louisiana' },
    { value: 'ME', name: 'Maine' },
    { value: 'MD', name: 'Maryland' },
    { value: 'MA', name: 'Massachusetts' },
    { value: 'MI', name: 'Michigan' },
    { value: 'MN', name: 'Minnesota' },
    { value: 'MS', name: 'Mississippi' },
    { value: 'MO', name: 'Missouri' },
    { value: 'MT', name: 'Montana' },
    { value: 'NE', name: 'Nebraska' },
    { value: 'NV', name: 'Nevada' },
    { value: 'NH', name: 'New Hampshire' },
    { value: 'NJ', name: 'New Jersey' },
    { value: 'NM', name: 'New Mexico' },
    { value: 'NY', name: 'New York' },
    { value: 'NC', name: 'North Carolina' },
    { value: 'ND', name: 'North Dakota' },
    { value: 'OH', name: 'Ohio' },
    { value: 'OK', name: 'Oklahoma' },
    { value: 'OR', name: 'Oregon' },
    { value: 'PA', name: 'Pennsylvania' },
    { value: 'RI', name: 'Rhode Island' },
    { value: 'SC', name: 'South Carolina' },
    { value: 'SD', name: 'South Dakota' },
    { value: 'TN', name: 'Tennessee' },
    { value: 'TX', name: 'Texas' },
    { value: 'UT', name: 'Utah' },
    { value: 'VT', name: 'Vermont' },
    { value: 'VA', name: 'Virginia' },
    { value: 'WA', name: 'Washington' },
    { value: 'WV', name: 'West Virginia' },
    { value: 'WI', name: 'Wisconsin' },
    { value: 'WY', name: 'Wyoming' },
  ];

  countries = [
    { value: 'US', name: 'United States' },
    { value: 'CA', name: 'Canada' },
    { value: 'MX', name: 'Mexico' },
    { value: 'GB', name: 'United Kingdom' },
    { value: 'FR', name: 'France' },
    { value: 'DE', name: 'Germany' },
    { value: 'IN', name: 'India' },
    { value: 'CN', name: 'China' },
    { value: 'JP', name: 'Japan' },
    { value: 'AU', name: 'Australia' },
    { value: 'BR', name: 'Brazil' },
    { value: 'ZA', name: 'South Africa' },
  ];

  hearAboutOptions = [
    { value: 'facebook', name: 'Facebook' },
    { value: 'instagram', name: 'Instagram' },
    { value: 'twitter', name: 'Twitter' },
    { value: 'web-search', name: 'Web Search' },
    { value: 'friend', name: 'Friend' },
    { value: 'other', name: 'Other' },
  ];

  constructor(private fb: FormBuilder, private seoService: SeoService) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)],
      ],
      storeName: ['', [Validators.required, Validators.minLength(2)]],
      storeAddress: ['', [Validators.required]],
      country: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)],
      ],
      storeWebsite: [''],
      salesTaxId: ['', [Validators.required]],
      facebookAccount: [''],
      instagramAccount: [''],
      heardAboutUs: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Initialize EmailJS
    emailjs.init(this.EMAILJS_PUBLIC_KEY);

    // Update SEO meta tags
    this.seoService.updateSeo({
      title: 'Wholesale Registration',
      description: 'Register for a wholesale account with P Diamond Designs. Access exclusive wholesale pricing on Native American and Southwestern jewelry for your retail business.',
      keywords: 'wholesale registration, jewelry wholesale account, become a retailer, wholesale jewelry pricing, jewelry reseller registration',
      url: 'https://pdiamonddesigns.com/registration',
      type: 'website'
    });

    // Add breadcrumb schema
    this.seoService.updateBreadcrumbSchema([
      { name: 'Home', url: 'https://pdiamonddesigns.com/' },
      { name: 'Registration', url: 'https://pdiamonddesigns.com/registration' }
    ]);
  }

  get f() {
    return this.registrationForm.controls;
  }

  // Phone number formatting
  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
        6,
        10
      )}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    this.registrationForm.patchValue({ phone: value });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;

      // Get current date and time
      const now = new Date();
      const submissionDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const submissionTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      // Get selected country and state names
      const selectedCountry =
        this.countries.find(
          (c) => c.value === this.registrationForm.value.country
        )?.name || this.registrationForm.value.country;
      const selectedState =
        this.states.find((s) => s.value === this.registrationForm.value.state)
          ?.name || this.registrationForm.value.state;
      const selectedHeardAbout =
        this.hearAboutOptions.find(
          (h) => h.value === this.registrationForm.value.heardAboutUs
        )?.name || this.registrationForm.value.heardAboutUs;

      // Prepare template parameters for EmailJS
      const templateParams = {
        // Personal Information
        first_name: this.registrationForm.value.firstName,
        last_name: this.registrationForm.value.lastName,
        full_name: `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`,
        email: this.registrationForm.value.email,
        phone: this.registrationForm.value.phone,

        // Store Information
        store_name: this.registrationForm.value.storeName,
        store_address: this.registrationForm.value.storeAddress,
        store_website:
          this.registrationForm.value.storeWebsite || 'Not provided',

        // Address Information
        country: selectedCountry,
        address_line_1: this.registrationForm.value.addressLine1,
        address_line_2:
          this.registrationForm.value.addressLine2 || 'Not provided',
        city: this.registrationForm.value.city,
        state: selectedState,
        zip_code: this.registrationForm.value.zipCode,
        full_address: `${this.registrationForm.value.addressLine1}${
          this.registrationForm.value.addressLine2
            ? ', ' + this.registrationForm.value.addressLine2
            : ''
        }, ${this.registrationForm.value.city}, ${selectedState} ${
          this.registrationForm.value.zipCode
        }, ${selectedCountry}`,

        // Business Information
        sales_tax_id: this.registrationForm.value.salesTaxId,
        facebook_account:
          this.registrationForm.value.facebookAccount || 'Not provided',
        instagram_account:
          this.registrationForm.value.instagramAccount || 'Not provided',
        heard_about_us: selectedHeardAbout,

        // Metadata
        submission_date: submissionDate,
        submission_time: submissionTime,
        to_email: 'kerry@pdiamonddesigns.com',
        subject: 'New Wholesale Registration Application',
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
              'Registration email sent successfully!',
              response.status,
              response.text
            );
            this.isSubmitting = false;
            this.isSubmitted = true;

            // Reset form after 5 seconds
            setTimeout(() => {
              this.isSubmitted = false;
              this.registrationForm.reset();
            }, 5000);
          },
          (error) => {
            console.error('Failed to send registration email:', error);
            this.isSubmitting = false;
            this.submitError = true;

            // Hide error message after 6 seconds
            setTimeout(() => {
              this.submitError = false;
            }, 6000);
          }
        );
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(
          fieldName
        )} must be at least ${requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') {
          return 'Please enter a valid phone number: (555) 123-4567';
        }
        if (fieldName === 'zipCode') {
          return 'Please enter a valid zip code: 12345 or 12345-6789';
        }
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone',
      storeName: 'Store Name',
      storeAddress: 'Store Address',
      country: 'Country',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      storeWebsite: 'Store Website',
      salesTaxId: 'Sales Tax ID',
      facebookAccount: 'Facebook Account',
      instagramAccount: 'Instagram Account',
      heardAboutUs: 'How did you hear about us',
    };
    return fieldNames[fieldName] || fieldName;
  }
}
