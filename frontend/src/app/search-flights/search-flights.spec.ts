import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFlightsComponent } from './search-flights';
import { FlightService } from '../_services/flight';
import { of } from 'rxjs';

describe('SearchFlightsComponent', () => {
  let component: SearchFlightsComponent;
  let fixture: ComponentFixture<SearchFlightsComponent>;
  let flightServiceSpy: any; 
  beforeEach(async () => {
    const spy = (window as any).jasmine ? 
                (window as any).jasmine.createSpyObj('FlightService', ['searchFlights']) : 
                jasmine.createSpyObj('FlightService', ['searchFlights']);
    spy.searchFlights.and.returnValue(of([])); 
    await TestBed.configureTestingModule({
      imports: [SearchFlightsComponent],
      providers: [
        { provide: FlightService, useValue: spy } 
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SearchFlightsComponent);
    component = fixture.componentInstance;
    flightServiceSpy = TestBed.inject(FlightService);
    fixture.detectChanges(); 
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show error if fields are empty', () => {
    component.fromPlace = '';
    component.toPlace = '';
    component.travelDate = '';
    component.onSearch();
    expect(component.errorMessage).toBe("Please enter From, To, and Date.");
    expect(flightServiceSpy.searchFlights).not.toHaveBeenCalled();
  });

  it('should call service when form is valid', () => {
    component.fromPlace = 'HYD';
    component.toPlace = 'BLR';
    component.travelDate = '2025-12-25';
    component.onSearch();
    expect(component.errorMessage).toBe('');
    expect(flightServiceSpy.searchFlights).toHaveBeenCalledWith('HYD', 'BLR', '2025-12-25');
  });
});