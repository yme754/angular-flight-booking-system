package com.flightapp.service.implementation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.server.ResponseStatusException;

import com.flightapp.entity.Flight;
import com.flightapp.entity.Price;
import com.flightapp.entity.Seat;
import com.flightapp.repository.FlightRepository;
import com.flightapp.repository.SeatRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class FlightSImplementationTest {

    @Mock private FlightRepository flightRepo;
    @Mock private SeatRepository seatRepo;
    @Mock private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks private FlightSImplementation service;

    private Flight flight;
    private Seat seat;

    @BeforeEach
    void setup() {
        flight = new Flight(UUID.randomUUID().toString(), "HYD", "DEL", LocalDateTime.now(),
                LocalDateTime.now().plusHours(2), 100, new Price(2000, 3500), "A1", "6E101");
        seat = new Seat("S1", "1A", true, flight.getId());
    }

    @Test
    void testGetAllFlights() {
        when(flightRepo.findAll()).thenReturn(Flux.just(flight));
        StepVerifier.create(service.getAllFlights()).expectNext(flight).verifyComplete();
    }

    @Test
    void testGetFlightById() {
        when(flightRepo.findById(flight.getId())).thenReturn(Mono.just(flight));
        StepVerifier.create(service.getFlightById(flight.getId())).expectNext(flight).verifyComplete();
    }

    @Test
    void testUpdateFlight() {
        when(flightRepo.save(any(Flight.class))).thenReturn(Mono.just(flight));
        StepVerifier.create(service.updateFlight(flight.getId(), flight)).verifyComplete();
    }

    @Test
    void testAddFlight_Success() {
        when(flightRepo.findByFlightNumber(flight.getFlightNumber())).thenReturn(Mono.empty());
        when(flightRepo.save(any(Flight.class))).thenReturn(Mono.just(flight));

        StepVerifier.create(service.addFlight(flight)).expectNext(flight).verifyComplete();
    }

    @Test
    void testAddFlight_Conflict() {
        when(flightRepo.findByFlightNumber(flight.getFlightNumber())).thenReturn(Mono.just(flight));        
        lenient().when(flightRepo.save(any(Flight.class))).thenReturn(Mono.empty());

        StepVerifier.create(service.addFlight(flight))
            .expectError(ResponseStatusException.class)
            .verify();
    }

    @Test
    void testSearchFlights() {
        when(flightRepo.findByFromPlaceAndToPlace("HYD", "DEL")).thenReturn(Flux.just(flight));
        StepVerifier.create(service.searchFlights("HYD", "DEL")).expectNext(flight).verifyComplete();
    }

    @Test
    void testGetSeatsByFlightId() {
        when(seatRepo.findByFlightId(flight.getId())).thenReturn(Flux.just(seat));
        StepVerifier.create(service.getSeatsByFlightId(flight.getId())).expectNext(seat).verifyComplete();
    }

    @Test
    void testUpdateSeats() {
        when(seatRepo.findByFlightId(flight.getId())).thenReturn(Flux.just(seat));
        when(seatRepo.delete(seat)).thenReturn(Mono.empty());
        when(seatRepo.save(any(Seat.class))).thenReturn(Mono.just(seat));

        StepVerifier.create(service.updateSeats(flight.getId(), List.of(seat))).verifyComplete();
    }

    @Test
    void testReduceAvailableSeats_Success() {
        when(mongoTemplate.findAndModify(any(Query.class), any(Update.class), eq(Flight.class)))
            .thenReturn(Mono.just(flight));

        StepVerifier.create(service.reduceAvailableSeats(flight.getId(), 5))
            .expectNext(flight)
            .verifyComplete();
    }

    @Test
    void testReduceAvailableSeats_Failure() {
        when(mongoTemplate.findAndModify(any(Query.class), any(Update.class), eq(Flight.class)))
            .thenReturn(Mono.empty()); 

        StepVerifier.create(service.reduceAvailableSeats(flight.getId(), 5))
            .expectErrorMatches(e -> e.getMessage().contains("Not enough seats"))
            .verify();
    }

    @Test
    void testIncreaseAvailableSeats() {
        when(flightRepo.findById(flight.getId())).thenReturn(Mono.just(flight));
        when(flightRepo.save(any(Flight.class))).thenReturn(Mono.just(flight));

        StepVerifier.create(service.increaseAvailableSeats(flight.getId(), 10))
            .expectNextMatches(f -> f.getAvailableSeats() == 110)
            .verifyComplete();
    }
}