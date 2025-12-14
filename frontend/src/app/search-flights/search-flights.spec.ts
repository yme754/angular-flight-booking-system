import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlightsComponent } from './search-flights';

describe('SearchFlightsComponent', () => {
  let component: SearchFlightsComponent;
  let fixture: ComponentFixture<SearchFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFlightsComponent); 
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});