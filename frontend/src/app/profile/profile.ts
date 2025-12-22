import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '../_services/storage';
import { AuthService } from '../_services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styles: [`.container { margin-top: 20px; }`],
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  showChangePassword = false;
  newPassword = '';
  confirmPassword = '';  
  passwordMismatch = false;
  message = '';
  isSuccess = false;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.newPassword = '';
    this.confirmPassword = '';    
    this.passwordMismatch = false; 
    this.message = '';
    this.isSuccess = false;
  }
  submitPasswordChange(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true; 
      this.message = 'Passwords do not match!';
      this.isSuccess = false;
      return;
    }
    this.passwordMismatch = false;
    this.authService.changePassword(this.currentUser.username, this.newPassword).subscribe({
      next: (data) => {
        this.handleSuccess('Password updated successfully!');
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Failed to update password.';
        this.isSuccess = false;
        this.cd.detectChanges();
      }
    });
  }
  private handleSuccess(msg: string) {
    this.message = msg;
    this.isSuccess = true;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMismatch = false;
    this.cd.detectChanges();
    setTimeout(() => {
        this.showChangePassword = false;
        this.message = '';
        this.cd.detectChanges();
    }, 3000);
  }
}