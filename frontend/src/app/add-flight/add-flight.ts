import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../_services/flight';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-flight.html',
  styleUrls: ['./add-flight.css']
})
export class AddFlightComponent {
  flight: any = {
    fromPlace: '',
    toPlace: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: 60, // Better default than 0
    airlineId: '',
    flightNumber: '',
    price: {
      oneWay: 0,
      roundTrip: 0
    }
  };
  
  isSuccessful = false;
  errorMessage = '';

  constructor(
    private flightService: FlightService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}
  validateForm(): boolean {
    this.errorMessage = '';
    if (this.flight.availableSeats <= 0) {
      this.errorMessage = 'Available seats must be greater than 0.';
      return false;
    }
    if (this.flight.price.oneWay <= 0 || this.flight.price.roundTrip <= 0) {
      this.errorMessage = 'Prices must be greater than 0.';
      return false;
    }
    if (this.flight.departureTime && this.flight.arrivalTime) {
      const dep = new Date(this.flight.departureTime);
      const arr = new Date(this.flight.arrivalTime);
      if (arr <= dep) {
        this.errorMessage = 'Arrival time must be later than Departure time.';
        return false;
      }
    }
    return true;
  }
  onSubmit(): void {
    if (!this.validateForm()) {
      this.cd.detectChanges();
      return;
    }
    console.log('Submitting Flight:', this.flight);
    this.flightService.addFlight(this.flight).subscribe({
      next: (data) => {
        this.isSuccessful = true;
        this.errorMessage = '';
        this.cd.detectChanges();        
        setTimeout(() => {
           this.router.navigate(['/search']); 
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Error adding flight';
        this.isSuccessful = false;
        this.cd.detectChanges();
      }
    });
  }
}