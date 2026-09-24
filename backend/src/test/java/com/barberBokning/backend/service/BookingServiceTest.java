package com.barberBokning.backend.service;

import com.barberBokning.backend.model.Booking;
import com.barberBokning.backend.repository.BookingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void shouldGetAllBookings() {
        Booking booking = new Booking(
                "John Doe",
                "john@example.com",
                "Ahmed",
                "Haircut",
                LocalDate.of(2026, 10, 1),
                LocalTime.of(14, 30)
        );

        when(bookingRepository.findAll())
                .thenReturn(List.of(booking));

        List<Booking> result = bookingService.getAllBookings();

        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getCustomerName());

        verify(bookingRepository).findAll();
    }

    @Test
    void shouldCreateBooking() {
        Booking booking = new Booking(
                "Jane Doe",
                "jane@example.com",
                "Ahmed",
                "Beard Trim",
                LocalDate.of(2026, 10, 2),
                LocalTime.of(15, 0)
        );

        when(bookingRepository.save(booking))
                .thenReturn(booking);

        Booking result = bookingService.createBooking(booking);

        assertEquals("Jane Doe", result.getCustomerName());
        assertEquals("Beard Trim", result.getService());

        verify(bookingRepository).save(booking);
    }

    @Test
    void shouldDeleteBooking() {
        Long bookingId = 1L;

        bookingService.deleteBooking(bookingId);

        verify(bookingRepository).deleteById(bookingId);
    }
}