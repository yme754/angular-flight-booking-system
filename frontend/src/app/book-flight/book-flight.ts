import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../_services/flight'; 
import { StorageService } from '../_services/storage';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './book-flight.html',
  styleUrls: ['./book-flight.css']
})
export class BookFlightComponent implements OnInit {
  passengerName = '';
  email = '';
  seatCount = 0;
  flightId = '';
  flightNumber = '';
  date = '';
  seatNumber = '';
  error = '';
  success = '';

  constructor(
    private flightService: FlightService, 
    private router: Router,
    private cd: ChangeDetectorRef,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = history.state; 
    if (state && state.flight) {
      this.flightId = state.flight.id;
      this.flightNumber = state.flight.flightNumber;
      this.date = state.date;
    } else {
      this.error = 'No flight selected. Please go back to search.';
    }
    if (this.storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      this.email = user.email || user.username; 
    }
  }

  confirmBooking() {
    this.error = '';
    this.success = '';
    
    const pIds = this.passengerName.split(',').map(id => id.trim());
    const sNums = this.seatNumber.split(',').map(seat => seat.trim());

    if (pIds.length !== sNums.length) {
      this.error = `Mismatch! You entered ${pIds.length} names but ${sNums.length} seats.`;
      return;
    }

    const finalPayload = {
      email: this.email,
      flightId: this.flightId,
      seatCount: pIds.length,
      passengerIds: pIds,
      seatNumbers: sNums
    };

    console.log('Sending to Backend:', finalPayload); 

    this.flightService.bookFlight(finalPayload).subscribe({
      next: (response: any) => {
        this.success = `Booking Confirmed! ${response.pnr || 'Generated'}`;
        this.error = '';
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Booking Failed: ' + (err.error?.message || 'Check seat/passenger details');
        this.success = '';
        this.cd.detectChanges();
      }
    });
  }
}