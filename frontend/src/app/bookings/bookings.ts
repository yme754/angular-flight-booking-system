import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightService } from '../_services/flight';
import { StorageService } from '../_services/storage';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;
  error = '';
  success = '';
  currentUserEmail = '';

  constructor(
    private flightService: FlightService, 
    private storageService: StorageService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.currentUserEmail = user.email || user.username; 

    if (!this.currentUserEmail) {
      this.error = 'User not found. Please log in again.';
      this.isLoading = false;
      return;
    }

    this.loadBookings();
  }

  loadBookings() {
    this.flightService.getAllBookings().subscribe({
      next: (response: any) => {
        let allBookings: any[] = [];        
        if (Array.isArray(response)) {
          allBookings = response;
        } else if (response && Array.isArray(response.bookings)) {
          allBookings = response.bookings;
        }
        console.log('My Email:', this.currentUserEmail);
        this.bookings = allBookings.filter(booking => 
            booking.email === this.currentUserEmail
        );
        if (this.bookings.length === 0 && allBookings.length > 0) {
           console.log('Bookings exist, but none matched your email.');
        }
        this.isLoading = false;
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.error = 'Failed to load bookings.';
        this.isLoading = false;
        this.cd.detectChanges(); 
      }
    });
  }
  cancelFlight(id: string, pnr: string) {    
    if (!confirm(`Are you sure you want to cancel PNR: ${pnr}?`)) {
      return;
    }
    this.flightService.cancelBooking(id).subscribe({
      next: () => {
        this.success = 'Booking Cancelled Successfully!';
        this.bookings = this.bookings.filter(b => b.id !== id);        
        this.cd.detectChanges();
        setTimeout(() => {
            this.success = '';
            this.cd.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        this.error = 'Cancellation Failed: ' + (err.error?.message || err.error || err.statusText || 'Server Error');
        this.cd.detectChanges();
      }
    });
  }
}