package com.flightapp.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.flightapp.dto.AirlineRequest;
import com.flightapp.entity.Airline;
import com.flightapp.service.AirlineService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class AirControllerTest {

    @Mock
    private AirlineService airlineService;

    private AirlineController controller;
    private Airline sample;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        controller = new AirlineController(airlineService);
        
        sample = new Airline(UUID.randomUUID().toString(), "Indigo", "http://logo.com/a.png", List.of("F1", "F2"));
    }

    @Test
    void testGetAllAirlines() {
        when(airlineService.getAllAirlines()).thenReturn(Flux.just(sample));

        StepVerifier.create(controller.getAllAirlines())
            .expectNext(sample)
            .verifyComplete();
            
        verify(airlineService).getAllAirlines();
    }

    @Test
    void testGetById() {
        when(airlineService.getById(sample.getId())).thenReturn(Mono.just(sample));

        StepVerifier.create(controller.getById(sample.getId()))
            .expectNext(sample)
            .verifyComplete();
            
        verify(airlineService).getById(sample.getId());
    }

    @Test
    void testAddAirline() {
        when(airlineService.addAirline(any())).thenReturn(Mono.just(sample));

        AirlineRequest request = mock(AirlineRequest.class);
        when(request.getName()).thenReturn("Indigo");

        StepVerifier.create(controller.addAirline(request))
            .expectNextMatches(response -> {
                return response.getStatusCode().is2xxSuccessful() && 
                       response.getBody().equals(sample);
            })
            .verifyComplete();
            
        verify(airlineService).addAirline(any()); 
    }

    @Test
    void testAddFlightToAirline() {
        when(airlineService.addFlightToAirline("A1", "F101")).thenReturn(Mono.just(sample));
        StepVerifier.create(controller.addFlightToAirline("A1", "F101")).expectNext(sample).verifyComplete();
        verify(airlineService).addFlightToAirline("A1", "F101");
    }
}