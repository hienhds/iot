package com.example.test.service;

import com.example.test.model.SensorData;
import com.example.test.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorDataService {
    @Autowired
    private SensorDataRepository sensorDataRepository;

    public List<SensorData> getAllSensorData(Sort sort) {
        return sensorDataRepository.findAll(sort);
    }

    public SensorData getLatestSensorData() {
        return sensorDataRepository.findTopByOrderByTimestampDesc();
    }

    public Page<SensorData> getSensorData(Pageable pageable) {
        return sensorDataRepository.findAll(pageable);
    }

    // Phương thức tìm kiếm với phân trang
    public Page<SensorData> searchSensorData(Pageable pageable, String searchKeyword) {
        return sensorDataRepository.findByKeyword(searchKeyword, pageable);
    }

    // Phương thức tìm kiếm không phân trang
    public List<SensorData> searchSensorData(String searchKeyword, Sort sort) {
        return sensorDataRepository.findByKeyword(searchKeyword, sort);
    }

    // Phương thức tìm kiếm theo loại cảm biến với phân trang
    public Page<SensorData> searchSensorDataByType(Pageable pageable, String searchKeyword, String sensorType) {
        return sensorDataRepository.findByKeywordAndSensorType(searchKeyword, sensorType, pageable);
    }

    // Phương thức tìm kiếm theo loại cảm biến không phân trang
    public List<SensorData> searchSensorDataByType(String searchKeyword, String sensorType, Sort sort) {
        return sensorDataRepository.findByKeywordAndSensorType(searchKeyword, sensorType, sort);
    }
    public Long countBuiGreaterThan80ByDate() {
        return sensorDataRepository.countBuiGreaterThan80ByDate();
    }

    public List<Integer> listValueBui(){
        return sensorDataRepository.listValueBui();
    }
}
