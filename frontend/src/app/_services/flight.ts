import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../_models/flight.model';
import { StorageService } from '../_services/storage';

const API_URL = 'http://localhost:9090/api/flight/flights/';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private baseUrl = 'http://localhost:9090/api/flight/flights';
  private bookingUrl = 'http://localhost:9090/api/flight/bookings/book';
  private bookingsUrl = 'http://localhost:9090/api/flight/bookings';
  private seatsUrl = 'http://localhost:9090/api/flight';

  constructor(private http: HttpClient, private storageService: StorageService) {}

private getAuthHeaders(): HttpHeaders {
const token = this.storageService.getToken();
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  });
}
  searchFlights(from: string, to: string, date: string): Observable<Flight[]> {
    return this.http.post<Flight[]>(`${this.baseUrl}/search`, { from, to, date }, { headers: this.getAuthHeaders() });
  }
  bookFlight(bookingRequest: any): Observable<any> {
    return this.http.post<any>(this.bookingUrl, bookingRequest, { headers: this.getAuthHeaders() });
  }
  getAllFlights(): Observable<any> {
    return this.http.get(API_URL, { headers: this.getAuthHeaders() });
  }
  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.bookingsUrl, { headers: this.getAuthHeaders() });
  }
  cancelBooking(pnr: string): Observable<any> {
    return this.http.delete(`${this.bookingsUrl}/${pnr}`, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }
  addFlight(flightData: any): Observable<any> {
  return this.http.post(this.baseUrl + '/add', flightData, { headers: this.getAuthHeaders() });
}
getSeatsByFlightId(flightId: string): Observable<any[]> { 
  return this.http.get<any[]>(`${this.seatsUrl}/seats/${flightId}`); 
}
}
