import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../_services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }
  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: (data: any) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;        
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;        
        this.cd.detectChanges();
      }
    });
  }
}