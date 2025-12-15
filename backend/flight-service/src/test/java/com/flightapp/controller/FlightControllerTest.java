package com.flightapp.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flightapp.dto.FlightRequest;
import com.flightapp.dto.SearchRequestDTO;
import com.flightapp.entity.Flight;
import com.flightapp.entity.Price;
import com.flightapp.service.FlightService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class FlightControllerTest {

    @Mock
    private FlightService flightService;

    private FlightController controller;
    private Flight flight;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        controller = new FlightController(flightService);

        flight = new Flight(UUID.randomUUID().toString(), "HYD", "DEL", LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(2), 100, new Price(2000, 3500), "A1", "6E101");
    }

    @Test
    void testGetAllFlights() {
        when(flightService.getAllFlights()).thenReturn(Flux.just(flight));

        StepVerifier.create(controller.getAllFlights())
            .expectNext(flight)
            .verifyComplete();

        verify(flightService).getAllFlights();
    }

    @Test
    void testUpdateFlight() {
        when(flightService.updateFlight(eq(flight.getId()), any(Flight.class))).thenReturn(Mono.empty());
        FlightRequest request = mock(FlightRequest.class);
        when(request.getFromPlace()).thenReturn("HYD");
        when(request.getToPlace()).thenReturn("DEL");
        StepVerifier.create(controller.updateFlight(flight.getId(), request)).verifyComplete();
        verify(flightService).updateFlight(eq(flight.getId()), any(Flight.class));
    }

    @Test
    void testGetFlightById() {
        when(flightService.getFlightById(flight.getId())).thenReturn(Mono.just(flight));
        StepVerifier.create(controller.getFlightById(flight.getId())).expectNext(flight).verifyComplete();
        verify(flightService).getFlightById(flight.getId());
    }

    @Test
    void testAddFlight() {
        when(flightService.addFlight(any())).thenReturn(Mono.just(flight));

        FlightRequest request = mock(FlightRequest.class);
        StepVerifier.create(controller.addFlight(request))
            .expectNextMatches(response -> {
                @SuppressWarnings("unchecked")
                Map<String, String> body = (Map<String, String>) response.getBody();
                return response.getStatusCode().is2xxSuccessful() && 
                       body.get("id").equals(flight.getId());
            })
            .verifyComplete();
            
        verify(flightService).addFlight(any());
    }

    @Test
    void testSearchFlights() {
        when(flightService.searchFlights("HYD", "DEL")).thenReturn(Flux.just(flight));
        SearchRequestDTO searchRequest = mock(SearchRequestDTO.class);
        when(searchRequest.getFrom()).thenReturn("HYD");
        when(searchRequest.getTo()).thenReturn("DEL");
        StepVerifier.create(controller.searchFlights(searchRequest))
            .expectNext(flight)
            .verifyComplete();
        verify(flightService).searchFlights("HYD", "DEL");
    }

    @Test
    void testAddInventory() {
        when(flightService.increaseAvailableSeats(flight.getId(), 10)).thenReturn(Mono.just(flight));
        StepVerifier.create(controller.addInventory(flight.getId(), 10)) 
            .expectNext(flight)
            .verifyComplete();
        verify(flightService).increaseAvailableSeats(flight.getId(), 10);
    }
}