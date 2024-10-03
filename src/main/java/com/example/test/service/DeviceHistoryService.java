package com.example.test.service;

import com.example.test.model.DeviceHistory;
import com.example.test.model.SensorData;
import com.example.test.repository.DeviceHistoryRepository;
import com.example.test.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DeviceHistoryService {
    @Autowired
    private DeviceHistoryRepository deviceHistoryRepository;

    public List<DeviceHistory> getAllDeviceHistory(Sort sort) {
        return deviceHistoryRepository.findAll(sort);
    }

    public DeviceHistory getLatestDeviceHistory() {
        return deviceHistoryRepository.findTopByOrderByTimestampDesc();
    }

    public Page<DeviceHistory> getDeviceHistory(Pageable pageable) {
        return deviceHistoryRepository.findAll(pageable);
    }

    // Phương thức tìm kiếm với phân trang
    public Page<DeviceHistory> searchDeviceHistory(Pageable pageable, String searchKeyword) {
        return deviceHistoryRepository.findByKeyword(searchKeyword, pageable);
    }

    // Phương thức tìm kiếm không phân trang
    public List<DeviceHistory> searchDeviceHistory(String searchKeyword, Sort sort) {
        return deviceHistoryRepository.findByKeyword(searchKeyword, sort);
    }

    public Map<String, Long> getFanActionCountsForToday(String deviceName) {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);

//        String startOfDayString = "2024-09-25 00:00:00";
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//        LocalDateTime startOfDay = LocalDateTime.parse(startOfDayString, formatter);

        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        List<Object[]> actionCounts = deviceHistoryRepository.findDeviceHistoryForToday(deviceName, startOfDay, endOfDay);

        Map<String, Long> result = new HashMap<>();
        for (Object[] actionCount : actionCounts) {
            String action = (String) actionCount[0];
            Long count = (Long) actionCount[1];
            result.put(action, count);
        }
        System.out.println(deviceName);
        System.out.println(startOfDay);
        System.out.println(endOfDay);
        System.out.println("Action counts: " + actionCounts);
        return result;
    }
}
