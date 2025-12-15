package com.flightapp.kafka;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.concurrent.CompletableFuture;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import com.flightapp.events.BookingCancelledEvent;
import com.flightapp.events.BookingCreatedEvent;
class BookingEventProducerTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private BookingEventProducer bookingEventProducer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendBookingCreatedEvent_Success() {
        BookingCreatedEvent event = new BookingCreatedEvent("101", "test@mail.com", "PNR101", 1);
        CompletableFuture<SendResult<String, Object>> future = CompletableFuture.completedFuture(null);
        when(kafkaTemplate.send("booking-created", "101", event)).thenReturn(future);
        bookingEventProducer.sendBookingCreatedEvent(event);
        verify(kafkaTemplate).send("booking-created", "101", event);
    }

    @Test
    void testSendBookingCreatedEvent_Failure() {
        BookingCreatedEvent event = new BookingCreatedEvent("102", "fail@mail.com", "PNR102", 1);
        CompletableFuture<SendResult<String, Object>> future = new CompletableFuture<>();
        future.completeExceptionally(new RuntimeException("Kafka down"));
        when(kafkaTemplate.send("booking-created", "102", event)).thenReturn(future);
        bookingEventProducer.sendBookingCreatedEvent(event);
        verify(kafkaTemplate).send("booking-created", "102", event);
    }

    @Test
    void testSendBookingCancelledEvent_Success() {
        BookingCancelledEvent event = mock(BookingCancelledEvent.class);
        when(event.getBookingId()).thenReturn("103");
        when(event.getPnr()).thenReturn("PNR103");
        CompletableFuture<SendResult<String, Object>> future = CompletableFuture.completedFuture(null);
        when(kafkaTemplate.send("booking-cancelled", "103", event)).thenReturn(future);
        bookingEventProducer.sendBookingCancelledEvent(event);
        verify(kafkaTemplate).send("booking-cancelled", "103", event);
    }

    @Test
    void testSendBookingCancelledEvent_Failure() {
        BookingCancelledEvent event = mock(BookingCancelledEvent.class);
        when(event.getBookingId()).thenReturn("104");
        when(event.getPnr()).thenReturn("PNR104");
        CompletableFuture<SendResult<String, Object>> future = new CompletableFuture<>();
        future.completeExceptionally(new RuntimeException("Kafka error"));
        when(kafkaTemplate.send("booking-cancelled", "104", event)).thenReturn(future);
        bookingEventProducer.sendBookingCancelledEvent(event);
        verify(kafkaTemplate).send("booking-cancelled", "104", event);
    }
}