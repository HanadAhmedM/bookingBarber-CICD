package com.barberBokning.backend.controller;

import com.barberBokning.backend.model.Booking;
import com.barberBokning.backend.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookingService bookingService;

    @Test
    void shouldGetAllBookings() throws Exception {

        Booking booking = new Booking(
                "John Doe",
                "john@example.com",
                "Ahmed",
                "Haircut",
                LocalDate.of(2026, 10, 1),
                LocalTime.of(14, 30)
        );

        when(bookingService.getAllBookings())
                .thenReturn(List.of(booking));

        mockMvc.perform(get("/api/bookings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customerName").value("John Doe"))
                .andExpect(jsonPath("$[0].service").value("Haircut"))
                .andExpect(jsonPath("$[0].barber").value("Ahmed"));
    }

    @Test
    void shouldReturn404WhenBookingDoesNotExist() throws Exception {

        when(bookingService.getBookingById(999L))
                .thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/api/bookings/999"))
                .andExpect(status().isNotFound());
    }
}