import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../_models/flight.model';

const FLIGHT_API = 'http://localhost:9090/api/flight/flights';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  constructor(private http: HttpClient) {}

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(FLIGHT_API);
  }
  
  searchFlights(from: string, to: string): Observable<Flight[]> {
      return this.http.post<Flight[]>(FLIGHT_API + '/search', { from, to });
  }

  getFlightById(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${FLIGHT_API}/${id}`);
  }
}