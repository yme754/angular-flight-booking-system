export interface Flight {
  id: string;
  flightNumber: string;
  airlineId: string;
  fromPlace: string;
  toPlace: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}