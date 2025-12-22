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
  confirmingId: string | null = null;
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
        this.bookings = allBookings.filter(booking => 
            booking.email === this.currentUserEmail
        );
        this.isLoading = false;
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load bookings.';
        this.isLoading = false;
        this.cd.detectChanges(); 
      }
    });
  }
  showConfirm(id: string) {
    this.confirmingId = id;
  }
  cancelConfirm() {
    this.confirmingId = null;
  }
  cancelFlight(id: string, pnr: string) {    
    this.flightService.cancelBooking(id).subscribe({
      next: () => {
        this.success = 'Booking Cancelled Successfully!';
        this.bookings = this.bookings.filter(b => b.id !== id);
        this.confirmingId = null;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);        
        let backendMessage = 'Server Error';
        if (typeof err.error === 'string') {
          backendMessage = err.error;
        } else if (err.error && err.error.message) {
          backendMessage = err.error.message;
        }
        this.error = 'Cancellation Failed: ' + backendMessage;
        this.confirmingId = null;
        this.cd.detectChanges();
      }
    });
  }
}