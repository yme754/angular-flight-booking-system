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
  passengers: { name: string }[] = [{ name: '' }];
  seatSelections: string[] = [];
  email = '';
  seatCount = 1;
  flightId = '';
  flightNumber = '';
  date = '';
  error = '';
  success = '';  
  tripType = 'ONE_WAY';
  gender = '';
  mealPref = 'NONE';  
  prices = { oneWay: 0, roundTrip: 0 };
  currentUnitPrice = 0;
  totalAmount = 0;
  seatRows: number[] = [1, 2, 3, 4, 5, 6];
  availableSeats: string[] = [];
  allSeats: any[] = [];

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
      this.prices.oneWay = state.flight.fare || 5000; 
      this.prices.roundTrip = state.flight.roundTripFare || (this.prices.oneWay * 1.8);
      this.calculateTotal();
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

  updateSeatCount(count: number) {
    if(count < 1) count = 1;
  if(count > 10) count = 10;
  this.seatCount = count;        
  while (this.passengers.length < count) this.passengers.push({ name: '' });
  while (this.passengers.length > count) this.passengers.pop();
  this.seatSelections = []; 
  this.calculateTotal();
  }
  calculateTotal() {
    if (this.tripType === 'ROUND_TRIP') {
      this.currentUnitPrice = this.prices.roundTrip;
    } else {
      this.currentUnitPrice = this.prices.oneWay;
    }
    this.totalAmount = this.currentUnitPrice * this.seatCount;
  }
  isSeatTaken(seat: string, currentIndex: number): boolean {
    return this.seatSelections.some((s, index) => s === seat && index !== currentIndex);
  }
  confirmBooking() {
    this.error = '';
    this.success = '';
    const names = this.passengers.map(p => p.name);
    if (names.some(n => !n || !n.trim())) {
      this.error = 'Please enter all passenger names.';
      return;
    }
    if (this.seatSelections.length !== this.seatCount) {
      this.error = `Please select exactly ${this.seatCount} seats from the map.`;
      return;
    }
    if (!this.gender) {
      this.error = 'Please select the primary passenger gender.';
      return;
    }
    const finalPayload = {
      email: this.email,
      flightId: this.flightId,
      seatCount: this.seatCount,
      passengerIds: names,
      seatNumbers: this.seatSelections,      
      tripType: this.tripType,
      gender: this.gender,
      mealPref: this.mealPref,
      totalAmount: this.totalAmount
    };
    this.flightService.bookFlight(finalPayload).subscribe({
      next: (response: any) => {
        this.success = `Booking Confirmed! ${response.pnr || 'PNR Generated'}`;
        this.error = '';
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Booking Failed: ' + (err.error?.message || err.error?.error || 'Check details');
        this.success = '';
        this.cd.detectChanges();
      }
    });
  }
  trackByIndex(index: number, item: any): any {
    return index;
  }
getSeatStatus(seatNum: string): string {
  if (this.seatSelections.includes(seatNum)) return 'selected';
  if (this.availableSeats.includes(seatNum)) return 'available';
  return 'booked';
}
toggleSeat(seatNum: string) {
  const index = this.seatSelections.indexOf(seatNum);
  if (index > -1) {
    this.seatSelections.splice(index, 1);
  } else {
    if (this.seatSelections.length < this.seatCount) {
      this.seatSelections.push(seatNum);
    } else {
      alert(`You can only select ${this.seatCount} seats.`);
    }
  }
}
}
