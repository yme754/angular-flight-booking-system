import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../_services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent implements OnInit {
  form: any = {
    username: '',
    newPassword: '',
    confirmPassword: ''
  };
  isSuccessful = false;
  isFailed = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.form.username = params['username'] || '';
    });
  }

  onSubmit(): void {
    const { username, newPassword, confirmPassword } = this.form;    
    this.isFailed = false;
    this.errorMessage = '';
    if (newPassword !== confirmPassword) {
      this.isFailed = true;
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    this.authService.changePassword(username, newPassword).subscribe({
      next: (data) => {
        this.isSuccessful = true;
        this.isFailed = false;
      },
      error: (err) => {
        this.isFailed = true;
        this.errorMessage = err.error.message || "Failed to update password.";
      }
    });
  }
}