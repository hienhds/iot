package com.example.test.config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.internal.wire.MqttConnect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {
    // Cấu hình URL của broker MQTT cục bộ
    private static final String MQTT_BROKER_URL = "tcp://localhost:1983";
    private static final String CLIENT_ID = "SpringBootClient";

    @Bean
    public MqttClient mqttClient() throws MqttException {
        MqttClient client = new MqttClient(MQTT_BROKER_URL, CLIENT_ID);
        MqttConnectOptions options = new MqttConnectOptions();

        options.setCleanSession(true);
        // Nếu broker yêu cầu xác thực, thêm user và password
        options.setUserName("hiendong");  // Thêm user nếu có
        options.setPassword("b21dccn046".toCharArray());  // Thêm password nếu có

        client.connect(options);
        return client;
    }
}

