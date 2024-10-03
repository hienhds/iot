package com.example.test.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="sensor_data")
public class SensorData {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "light")
    private int light;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "bui")
    private int bui;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;




}
