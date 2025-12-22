import { Component } from '@angular/core';
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
export class LoginComponent {
  form: any = { username: null, password: null };
  isLoggedIn = false;
  roles: string[] = [];
  isLoginFailed = false;
  errorMessage = '';
  constructor(
    private authService: AuthService, 
    private storageService: StorageService, 
    private router: Router
  ) {}
  ngOnInit(): void {
    this.storageService.loggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.roles = this.storageService.getUser().roles || [];
      } else {
        this.roles = [];
      }
    });
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe({
      next: (data) => { 
        this.storageService.saveUser(data); 
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        this.isLoginFailed = true;      
        this.errorMessage = err.status === 401 ? "Incorrect password or username." : "Login failed. Please try again later.";
      }
    });
  }
}