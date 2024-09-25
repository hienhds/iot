package com.example.test.controller;

import com.example.test.model.SensorData;
import com.example.test.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SensorDataService sensorDataService;

    // Gửi dữ liệu mới nhất từ database tới client khi có kết nối
    @MessageMapping("/requestSensorData")
    @SendTo("/topic/sensorData")
    public SensorData sendSensorData() {
        // Truy vấn dữ liệu mới nhất từ database
        return sensorDataService.getLatestSensorData();
    }
}

