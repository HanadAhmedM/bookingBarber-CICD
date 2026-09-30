package com.barberBokning.backend.repository;

import com.barberBokning.backend.model.Booking;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
     boolean existsByBarberAndBookingDateAndBookingTime(
            String barber,
            LocalDate bookingDate,
            LocalTime bookingTime
            
    );
}