import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '../_services/storage';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  roles: string[] = [];

  constructor(
    private storageService: StorageService, 
    private router: Router,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.storageService.loggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const user = this.storageService.getUser();
        this.username = user.username || 'User';        
        this.roles = user.roles || []; 
      } else {
        this.username = '';
        this.roles = [];
      }
      this.cd.detectChanges(); 
    });
  }

  logout(): void {
    this.storageService.clean();
    this.isLoggedIn = false;
    this.roles = [];
    this.cd.detectChanges(); 
    this.router.navigate(['/login']);
  }
}