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
    availableSeats: 0,
    airlineId: '',
    flightNumber: '',
    price: {
      oneWay: 0,
      roundTrip: 0
    }
  };
  minDateTime: string = '';
  isSuccessful = false;
  errorMessage = '';
  airports = [ 
    { code: 'DEL', name: 'Delhi' }, 
    { code: 'BOM', name: 'Mumbai' }, 
    { code: 'HYD', name: 'Hyderabad' }, 
    { code: 'BLR', name: 'Bengaluru' }, 
    { code: 'MAA', name: 'Chennai' }, 
    { code: 'CCU', name: 'Kolkata' }, 
    { code: 'PNQ', name: 'Pune' }, 
    { code: 'GOI', name: 'Goa' }, 
    { code: 'AMD', name: 'Ahmedabad' }, 
    { code: 'VJA', name: 'Vijayawada' }, 
    { code: 'PAT', name: 'Patna' }, 
    { code: 'LKO', name: 'Lucknow' }, 
    { code: 'COK', name: 'Kochi' }, 
    { code: 'TRV', name: 'Thiruvananthapuram' }, 
    { code: 'BBI', name: 'Bhubaneswar' } 
  ];
  constructor(
    private flightService: FlightService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
      const now = new Date();
      this.minDateTime = now.toISOString().slice(0,16);
  }
  validateForm(): boolean {
    this.errorMessage = '';
    const dep = new Date(this.flight.departureTime); 
    const arr = new Date(this.flight.arrivalTime);
    if (dep < new Date()) { 
      this.errorMessage = 'Departure time cannot be in the past.'; 
      return false; 
    }
    if(arr < new Date()) {
      this.errorMessage = 'Arrival time cannot be in the past.';
      return false;
    }
    if (this.flight.availableSeats <= 0) {
      this.errorMessage = 'Available seats must be greater than 0.';
      return false;
    }
    if (arr <= dep) { 
      this.errorMessage = 'Arrival time must be later than Departure time.'; 
      return false; 
    }
    if (this.flight.price.oneWay <= 0 || this.flight.price.roundTrip <= 0) {
      this.errorMessage = 'Prices must be greater than 0.';
      return false;
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