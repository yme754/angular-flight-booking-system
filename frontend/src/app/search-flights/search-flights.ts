import { Component } from '@angular/core';
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
export class SearchFlightsComponent {
  fromPlace = '';
  toPlace = '';
  
  flights: Flight[] = [];
  errorMessage = '';

  constructor(private flightService: FlightService) { }

  ngOnInit(): void {
  }

  onSearch(): void {
    if (!this.fromPlace || !this.toPlace) {
      this.errorMessage = "Please enter both From and To locations.";
      return;
    }

    this.flightService.searchFlights(this.fromPlace, this.toPlace).subscribe({
      next: (data) => {
        this.flights = data;
        this.errorMessage = '';
        if (data.length === 0) {
          this.errorMessage = 'No flights found for this route.';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error fetching flights.';
        console.error(err);
      }
    });
  }
}