import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:9090/api/flight/flights/';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) { }

  searchFlights(from: string, to: string): Observable<any> {
    return this.http.post(API_URL + 'search', {
      from: from,
      to: to
    });
  }

  getAllFlights(): Observable<any> {
    return this.http.get(API_URL);
  }
}