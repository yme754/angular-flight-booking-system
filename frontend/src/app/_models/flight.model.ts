export interface Price {
  oneWay: number;
  roundTrip: number;
}
export interface Flight {
  id: string;
  flightNumber: string;
  airlineId: string;
  fromPlace: string;
  toPlace: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  price: Price;
  passengerName?: string; 
  seatsToBook?: number;
  isBooked?: boolean;
}