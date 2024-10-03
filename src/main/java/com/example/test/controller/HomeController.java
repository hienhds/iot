package com.example.test.controller;

import com.example.test.model.SensorData;
import com.example.test.service.MqttService;
import com.example.test.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private SensorDataService sensorDataService;

    @Autowired
    private MqttService mqttService;

    @MessageMapping("/lampControl")
    public void controlLamp(String message) {
        // Gửi tín hiệu điều khiển đèn qua MQTT
        if (message.equals("on")) {
            mqttService.publishDeviceCommand("lamp", "on");
        } else if (message.equals("off")) {
            mqttService.publishDeviceCommand("lamp", "off");
        }
    }

    @MessageMapping("/air-conControl")
    public void controlAir(String message){
        if (message.equals("on")) {
            mqttService.publishDeviceCommand("air-con", "on");
        } else if (message.equals("off")) {
            mqttService.publishDeviceCommand("air-con", "off");
        }
    }

    @MessageMapping("/fanControl")
    public void controlFan(String message){
        if (message.equals("on")) {
            mqttService.publishDeviceCommand("fan", "on");
        } else if (message.equals("off")) {
            mqttService.publishDeviceCommand("fan", "off");
        }
    }

    @MessageMapping("/allControl")
    public void allControl(String message){
        if(message.equals("on")){
            mqttService.pulishAllControl("on");
        }
        else if (message.equals("off")){
            mqttService.pulishAllControl("off");
        }
    }

    @RequestMapping("index")
    public String showPage(){
        return "index";
    }


    @GetMapping("api/chart")
    public ResponseEntity<?> getSensorData(
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir) {

        // Lấy dữ liệu từ service và sắp xếp theo yêu cầu
        List<SensorData> data = sensorDataService.getAllSensorData(Sort.by(Sort.Direction.fromString(sortDir), sortField));

        // Trả về danh sách dữ liệu đã sắp xếp
        return ResponseEntity.ok(data);
    }

    @GetMapping("/profile")
    public String showPageProfile(){
        return "profile";
    }
}
