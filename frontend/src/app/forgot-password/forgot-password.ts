import { Component } from '@angular/core';
import { AuthService } from '../_services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-page">
      <div class="glass-card">
        <h2>Forgot Password?</h2>
        <p class="subtitle">Enter your email to receive a reset link.</p>
        
        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="mb-4">
            <label class="form-label-custom">Email Address</label>
            <input type="email" class="form-control-custom" [(ngModel)]="email" name="email" required placeholder="name@example.com">
          </div>
          
          <button class="btn-login" [disabled]="loading">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
          
          <div *ngIf="message" [class]="isSuccess ? 'alert-custom alert-success' : 'alert-custom alert-danger'" class="mt-3">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.css']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  isSuccess = false;
  loading = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (data) => {
        this.isSuccess = true;
        this.message = data.message;
        this.loading = false;
      },
      error: (err) => {
        this.isSuccess = false;
        this.message = err.error.message || "Error sending email.";
        this.loading = false;
      }
    });
  }
}