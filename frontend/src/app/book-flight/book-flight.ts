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
  availableSeats: string[] = [];
  allSeats: any[] = [];
  seatNumbers: string[] = [];
  constructor(
    private flightService: FlightService, 
    private router: Router,
    private cd: ChangeDetectorRef,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const state = history.state; 
    if (state && state.flight) {
      this.flightId = state.flight.id;
      this.flightNumber = state.flight.flightNumber;
      this.date = state.date;
      this.flightService.getSeatsByFlightId(this.flightId).subscribe({
        next: (seats: any[]) => {
          this.allSeats = seats;
          this.availableSeats = seats.filter(s => s.available === true).map(s => s.seatNumber);
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching seats', err);
          this.error = 'Could not load seats';
        }
      });
    } else {
      this.error = 'No flight selected. Please go back to search.';
    }
    if (this.storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      this.email = user.email || user.username; 
    }
  }
passengerNames: string[] = [''];
seatSelections: string[] = [];
updateSeatCount(count: number) {
  this.seatCount = count;
  while (this.passengerNames.length < count) {
    this.passengerNames.push('');
    this.seatSelections.push('');
  }
  while (this.passengerNames.length > count) {
    this.passengerNames.pop();
    this.seatSelections.pop();
  }
}

confirmBooking() {
  this.error = '';
  this.success = '';
  if (this.passengerNames.some(n => !n.trim())) {
    this.error = 'Please enter all passenger names.';
    return;
  }
  if (this.seatSelections.some(s => !s)) {
    this.error = 'Please select seats for all passengers.';
    return;
  }
  const finalPayload = {
    email: this.email,
    flightId: this.flightId,
    seatCount: this.seatCount,
    passengerIds: this.passengerNames,
    seatNumbers: this.seatSelections
  };
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