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

import java.time.LocalDateTime;
import java.util.List;

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
}
