import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../_services/flight';
import { Flight } from '../_models/flight.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-flights.html',
  styleUrl: './search-flights.css'
})
export class SearchFlightsComponent implements OnInit {
  fromPlace = '';
  toPlace = '';
  travelDate = '';
  minDate = '';
  flights: Flight[] = [];
  errorMessage = '';
  successMessage = ''; 

  constructor(private flightService: FlightService, private router: Router) { }

  ngOnInit(): void {
        const today = new Date(); this.minDate = today.toISOString().split('T')[0];

  }

  onSearch(): void {
    if (!this.fromPlace || !this.toPlace || !this.travelDate) {
      this.errorMessage = "Please enter From, To, and Date.";
      return;
    }
    this.flightService.searchFlights(this.fromPlace, this.toPlace, this.travelDate).subscribe({
      next: (data: Flight[]) => {
        this.flights = data; 
        if (data.length === 0) {
          this.errorMessage = 'No flights found for this route.';
        }
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = "Error fetching flights.";
      }
    });
  }

  onBook(flight: Flight): void {
    this.router.navigate(['/book-flights'], { 
      state: { 
        flight: flight,
        date: this.travelDate 
      } 
    });
  }
}