import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../_services/auth';
import { StorageService } from '../_services/storage'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService, 
    private storageService: StorageService, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: (data) => { 
        this.storageService.saveUser(data); 
        if (data.token) { 
          this.storageService.saveToken(data.token); 
        } 
        this.isLoggedIn = true; 
        this.roles = this.storageService.getUser().roles;         
        this.cd.detectChanges(); 
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        this.isLoginFailed = true;      
        if (err.status === 401) {
             this.errorMessage = "Incorrect password or username.";
        } else {
             this.errorMessage = "Login failed. Please try again later.";
        }        
        this.cd.detectChanges(); 
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}