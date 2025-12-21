import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styles: [`.container { margin-top: 20px; }`]
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  showChangePassword = false;
  newPassword = '';
  confirmPassword = '';
  passwordMismatch = false;
  constructor(private storageService: StorageService) {}
  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMismatch = false;
  }
  submitPasswordChange(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;
    console.log('Password updated successfully:', this.newPassword);
    this.showChangePassword = false;
  }
}
