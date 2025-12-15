package com.flightapp.service.implementation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.flightapp.entity.Airline;
import com.flightapp.repository.AirlineRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class AirlineSImplementationTest {

    @Mock
    private AirlineRepository airlineRepo;

    @InjectMocks
    private AirlineSImplementation service;

    private Airline airline;

    @BeforeEach
    void setup() {
        airline = new Airline(UUID.randomUUID().toString(), "Indigo", "url", new ArrayList<>());
    }

    @Test
    void testGetAllAirlines() {
        when(airlineRepo.findAll()).thenReturn(Flux.just(airline));
        StepVerifier.create(service.getAllAirlines()).expectNext(airline).verifyComplete();
    }

    @Test
    void testGetById() {
        when(airlineRepo.findById(airline.getId())).thenReturn(Mono.just(airline));
        StepVerifier.create(service.getById(airline.getId())).expectNext(airline).verifyComplete();
    }

    @Test
    void testAddAirline_Success() {
        when(airlineRepo.findByName(airline.getName())).thenReturn(Mono.empty());
        when(airlineRepo.save(any(Airline.class))).thenReturn(Mono.just(airline));

        StepVerifier.create(service.addAirline(airline))
            .expectNext(airline)
            .verifyComplete();
    }

    @Test
    void testAddAirline_Conflict() {
        when(airlineRepo.findByName(airline.getName())).thenReturn(Mono.just(airline));
        lenient().when(airlineRepo.save(any(Airline.class))).thenReturn(Mono.empty());

        StepVerifier.create(service.addAirline(airline))
            .expectErrorMatches(ex -> ex instanceof ResponseStatusException 
                && ex.getMessage().contains("already exists"))
            .verify();
    }

    @Test
    void testAddFlightToAirline() {
        when(airlineRepo.findById("A1")).thenReturn(Mono.just(airline));
        when(airlineRepo.save(any(Airline.class))).thenReturn(Mono.just(airline));

        StepVerifier.create(service.addFlightToAirline("A1", "F101"))
            .expectNextMatches(a -> a.getFlightIds().contains("F101"))
            .verifyComplete();
    }
}