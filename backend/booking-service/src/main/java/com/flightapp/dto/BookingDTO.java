package com.flightapp.dto;

import java.util.List;

import com.flightapp.enums.GENDER;
import com.flightapp.enums.MEAL_PREFERENCE;
import com.flightapp.enums.TRIP_TYPE;

import lombok.Data;

@Data
public class BookingDTO {
	private String id;
    private String pnr;
    private String email;
    private String flightId;
    private int seatCount;
    private List<String> passengerIds;
    private List<String> seatNumbers;
    private float totalAmount;
    private GENDER gender;
    private TRIP_TYPE tripType;
    private MEAL_PREFERENCE mealPref;
}