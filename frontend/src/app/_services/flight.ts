import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../_models/flight.model';

const API_URL = 'http://localhost:9090/api/flight/flights/';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = 'http://localhost:9090/api/flight/flights';
  private bookingUrl = 'http://localhost:9090/api/flight/bookings/book'

  constructor(private http: HttpClient) { }

  searchFlights(from: string, to: string, date: string): Observable<Flight[]> {
    return this.http.post<Flight[]>(`${this.baseUrl}/search`, {
      from: from, to: to, date: date
    });
  }
  bookFlight(bookingRequest: any): Observable<any> {
    return this.http.post<any>(this.bookingUrl, bookingRequest);
  }
  getAllFlights(): Observable<any> {
    return this.http.get(API_URL);
  }
}