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

  // EmailJS configuration - Replace these with your actual values
  private readonly EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  private readonly EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  private readonly EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Initialize EmailJS
    emailjs.init(this.EMAILJS_PUBLIC_KEY);
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
        phone: this.contactForm.value.phone || 'Not provided',
        subject: this.contactForm.value.subject || 'Contact Form Submission',
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

            // Reset form after success message
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
