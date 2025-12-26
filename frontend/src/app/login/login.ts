import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../_services/auth';
import { StorageService } from '../_services/storage'; 
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  form: any = { username: null, password: null };
  isLoggedIn = false;
  isLoginFailed = false;
  isPasswordExpired = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService, 
    private storageService: StorageService, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    
    this.isLoginFailed = false;
    this.isPasswordExpired = false;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoginFailed = true;        
        if (err.status === 403) {
          console.log("Forcing UI update for Password Expiry...");
          this.isPasswordExpired = true;
          this.errorMessage = "Your password has expired. Please reset it to continue.";          
          this.cd.detectChanges(); 
          return;
        }

        if (err.status === 423) {
           this.errorMessage = err.error && err.error.message ? err.error.message : "Account is locked. Please try again later.";
        } else if (err.status === 401) {
           this.errorMessage = "Incorrect username or password.";
        } else {
           this.errorMessage = "Login failed. Please try again later."; 
        }
      }
    });
  }
  navigateToReset(): void {
    this.router.navigate(['/change-password'], { 
      queryParams: { username: this.form.username } 
    });
  }
}