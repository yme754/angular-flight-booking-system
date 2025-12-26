import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}