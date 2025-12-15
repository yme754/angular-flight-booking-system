package com.flightapp;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BookingServiceApplicationTest {

    @Test
    void contextLoads() {
    }

    @Test
    void main() {
        assertDoesNotThrow(() ->
            BookingServiceApplication.main(new String[]{})
        );
    }
}
