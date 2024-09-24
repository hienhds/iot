package com.example.test.service;

import com.example.test.model.DeviceHistory;
import com.example.test.model.SensorData;
import com.example.test.repository.DeviceHistoryRepository;
import com.example.test.repository.SensorDataRepository;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MqttService {

    @Autowired
    private MqttClient mqttClient;

    @Autowired
    private SensorDataRepository dataSensorRepository;

    @Autowired
    private DeviceHistoryRepository deviceHistoryRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private double lastTemp = 0;
    private double lastHum = 0;
    private double lastLight = 0;

    private double tempSum = 0;
    private double humSum = 0;
    private double lightSum = 0;
    private int dataCount = 0;
    private LocalDateTime lastSaveTime = LocalDateTime.now();

    // Ngưỡng thay đổi cho từng loại dữ liệu
    private static final double TEMP_THRESHOLD = 2.0; // Ngưỡng thay đổi nhiệt độ
    private static final double HUM_THRESHOLD = 5.0; // Ngưỡng thay đổi độ ẩm
    private static final double LIGHT_THRESHOLD = 500.0; // Ngưỡng thay đổi cường độ ánh sáng

    private static final long SAVE_INTERVAL_MINUTES = 15; // Thời gian lưu trung bình (phút)

    @PostConstruct
    public void init() throws MqttException {
        mqttClient.subscribe("esp32/data");
        mqttClient.subscribe("esp32/lamp/status");
        mqttClient.subscribe("esp32/air-con/status");
        mqttClient.subscribe("esp32/fan/status");
        mqttClient.setCallback(new MqttCallback() {
            @Override
            public void connectionLost(Throwable throwable) {
                System.out.println("Connection lost: " + throwable.getMessage());
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) throws Exception {
                if (topic.equals("esp32/lamp/status")) {
                    // Xử lý phản hồi từ đèn
                    String state = new String(message.getPayload());
                    messagingTemplate.convertAndSend("/topic/lampStatus", state);
                    System.out.println("trang thai den " + state);
                    DeviceHistory deviceHistory = new DeviceHistory();
                    deviceHistory.setDevice_name("Đèn");
                    deviceHistory.setAction(state);
                    deviceHistory.setTimestamp(LocalDateTime.now());
                    deviceHistoryRepository.save(deviceHistory);
                }

                if (topic.equals("esp32/air-con/status")) {
                    // Xử lý phản hồi từ điều hòa
                    String state = new String(message.getPayload());
                    messagingTemplate.convertAndSend("/topic/airConStatus", state);
                    System.out.println("trang thai dieu hoa: "+state);
                    DeviceHistory deviceHistory = new DeviceHistory();
                    deviceHistory.setDevice_name("Điều Hòa");
                    deviceHistory.setAction(state);
                    deviceHistory.setTimestamp(LocalDateTime.now());
                    deviceHistoryRepository.save(deviceHistory);
                }

                if (topic.equals("esp32/fan/status")) {
                    // Xử lý phản hồi từ quạt
                    String state = new String(message.getPayload());
                    messagingTemplate.convertAndSend("/topic/fanStatus", state);
                    DeviceHistory deviceHistory = new DeviceHistory();
                    deviceHistory.setDevice_name("Quạt");
                    deviceHistory.setAction(state);
                    deviceHistory.setTimestamp(LocalDateTime.now());
                    deviceHistoryRepository.save(deviceHistory);
                }

                if (topic.equals("esp32/data")) {

                    String payload = new String(message.getPayload());
//                    System.out.println("Received message: " + payload);

                    Pattern pattern = Pattern.compile("Temp: (\\d+\\.\\d+), Hum: (\\d+\\.\\d+), Light: (\\d+)");
                    Matcher matcher = pattern.matcher(payload);

                    if (matcher.find()) {

                        double temperature = Double.parseDouble(matcher.group(1));
                        double humidity = Double.parseDouble(matcher.group(2));
                        int lightIntensity = Integer.parseInt(matcher.group(3));
                        SensorData sensorData = new SensorData();
                        sensorData.setTemperature(temperature);
                        sensorData.setHumidity(humidity);
                        sensorData.setLight(lightIntensity);
                        sensorData.setTimestamp(LocalDateTime.now());

                        // Gửi dữ liệu qua WebSocket
                        messagingTemplate.convertAndSend("/topic/sensorData", sensorData);
                        // Kiểm tra sự thay đổi đáng kể của từng loại dữ liệu
                        boolean isSignificantTempChange = Math.abs(temperature - lastTemp) > TEMP_THRESHOLD;
                        boolean isSignificantHumChange = Math.abs(humidity - lastHum) > HUM_THRESHOLD;
                        boolean isSignificantLightChange = Math.abs(lightIntensity - lastLight) > LIGHT_THRESHOLD;

                        // Lưu dữ liệu khi có bất kỳ sự thay đổi đáng kể nào
                        if (isSignificantTempChange || isSignificantHumChange || isSignificantLightChange) {
                            saveData(temperature, humidity, lightIntensity);
                        } else {
                            // Lưu giá trị để tính trung bình
                            tempSum += temperature;
                            humSum += humidity;
                            lightSum += lightIntensity;
                            dataCount++;

                            // Kiểm tra nếu đã qua 15 phút
                            if (lastSaveTime.plusMinutes(SAVE_INTERVAL_MINUTES).isBefore(LocalDateTime.now())) {
                                saveAverageData();
                            }
                        }

                    } else {
                        System.out.println("Invalid data format received");
                    }
                }
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
                // Xử lý khi tin nhắn đã được gửi thành công
            }
        });
    }


    // Hàm lưu dữ liệu
    private void saveData(double temperature, double humidity, int lightIntensity) {
        SensorData sensorData = new SensorData();
        sensorData.setTemperature(temperature);
        sensorData.setHumidity(humidity);
        sensorData.setLight(lightIntensity);
        sensorData.setTimestamp(LocalDateTime.now());
        dataSensorRepository.save(sensorData);

        // gửi dữ liệu qua webSocket
//        messagingTemplate.convertAndSend("/topic/sensorData", sensorData);

        // Cập nhật giá trị cuối cùng
        lastTemp = temperature;
        lastHum = humidity;
        lastLight = lightIntensity;
        lastSaveTime = LocalDateTime.now();

        // Reset giá trị trung bình
        resetAverageData();
    }

    // Hàm lưu dữ liệu trung bình mỗi 15 phút
    private void saveAverageData() {
        if (dataCount > 0) {
            double avgTemp = tempSum / dataCount;
            double avgHum = humSum / dataCount;
            double avgLight = lightSum / dataCount;

            saveData(avgTemp, avgHum, (int) avgLight);
        }
    }

    // Reset các giá trị trung bình
    private void resetAverageData() {
        tempSum = 0;
        humSum = 0;
        lightSum = 0;
        dataCount = 0;
    }

    public void publishDeviceCommand(String device, String command){
        try{
            String topic = "esp32/" + device;
            MqttMessage mqttMessage = new MqttMessage(command.getBytes());
            mqttClient.publish(topic, mqttMessage);
            System.out.println("Published message to topic: " + topic + ", command: " + command);
        }catch (MqttException e){
            e.printStackTrace();
        }
    }
}
