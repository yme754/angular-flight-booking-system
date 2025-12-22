import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../_services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  form: any = { 
    username: null, 
    email: null, 
    password: null, 
    role: '' 
  };
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  onSubmit(): void {
    const { username, email, password, role } = this.form;
    this.authService.register(username, email, password, [role]).subscribe({
      next: (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.cd.detectChanges();        
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Registration Failed";
        this.isSignUpFailed = true;
        this.cd.detectChanges();
      }
    });
  }
}