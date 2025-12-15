package com.flightapp.service.implementation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.flightapp.entity.Seat;
import com.flightapp.repository.SeatRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class SeatSImplementationTest {

    @Mock private SeatRepository seatRepo;
    @InjectMocks private SeatSImplementation service;

    private Seat seat1;
    private Seat seat2;

    @BeforeEach
    void setup() {
        seat1 = new Seat("S1", "1A", true, "F1");
        seat2 = new Seat("S2", "1B", false, "F1");
    }

    @Test
    void testGetSeatsByFlightId() {
        when(seatRepo.findByFlightId("F1")).thenReturn(Flux.just(seat1));
        StepVerifier.create(service.getSeatsByFlightId("F1")).expectNext(seat1).verifyComplete();
    }

    @Test
    void testAddSeats_New() {
        when(seatRepo.findByFlightIdAndSeatNumber("F1", "1A")).thenReturn(Mono.empty());
        when(seatRepo.save(any(Seat.class))).thenReturn(Mono.just(seat1));

        StepVerifier.create(service.addSeats("F1", List.of(seat1))).verifyComplete();
    }

    @Test
    void testAddSeats_Existing() {
        when(seatRepo.findByFlightIdAndSeatNumber("F1", "1A")).thenReturn(Mono.just(seat1));        
        lenient().when(seatRepo.save(any(Seat.class))).thenReturn(Mono.empty());
        StepVerifier.create(service.addSeats("F1", List.of(seat1))).verifyComplete();
    }

    @Test
    void testUpdateSeats() {
        when(seatRepo.findByFlightId("F1")).thenReturn(Flux.just(seat1));
        when(seatRepo.delete(seat1)).thenReturn(Mono.empty());
        when(seatRepo.save(any(Seat.class))).thenReturn(Mono.just(seat1));
        StepVerifier.create(service.updateSeats("F1", List.of(seat1))).verifyComplete();
    }

    @Test
    void testBookSeats_Success() {
        when(seatRepo.findByFlightIdAndSeatNumberIn(anyString(), anyList())).thenReturn(Flux.just(seat1));
        when(seatRepo.saveAll(anyList())).thenReturn(Flux.just(seat1));
        StepVerifier.create(service.bookSeats("F1", List.of("1A")))
            .verifyComplete();
    }

    @Test
    void testBookSeats_SizeMismatch() {
        when(seatRepo.findByFlightIdAndSeatNumberIn(anyString(), anyList())).thenReturn(Flux.just(seat1));
        StepVerifier.create(service.bookSeats("F1", List.of("1A", "99Z")))
            .expectErrorMatches(e -> e instanceof ResponseStatusException 
                && e.getMessage().contains("do not exist"))
            .verify();
    }

    @Test
    void testBookSeats_AlreadyBooked() {
        when(seatRepo.findByFlightIdAndSeatNumberIn(anyString(), anyList())).thenReturn(Flux.just(seat2));
        StepVerifier.create(service.bookSeats("F1", List.of("1B")))
            .expectErrorMatches(e -> e instanceof ResponseStatusException && e.getMessage().contains("already booked")).verify();
    }
}