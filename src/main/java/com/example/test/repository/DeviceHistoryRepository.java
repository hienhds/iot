package com.example.test.repository;

import com.example.test.model.DeviceHistory;
import com.example.test.model.SensorData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DeviceHistoryRepository extends JpaRepository<DeviceHistory, Long> {
    DeviceHistory findTopByOrderByTimestampDesc();

    // Tìm kiếm với từ khóa cho phân trang
    @Query("SELECT s FROM DeviceHistory s WHERE " +
            "CAST(s.timestamp AS string) LIKE %:keyword%")
    Page<DeviceHistory> findByKeyword(String keyword, Pageable pageable);

    // Tìm kiếm không phân trang
    @Query("SELECT s FROM DeviceHistory s WHERE " +
            "CAST(s.timestamp AS string) LIKE %:keyword%")
    List<DeviceHistory> findByKeyword(String keyword, Sort sort);

    @Query("SELECT s.action, count(s) FROM DeviceHistory s WHERE s.device_name = :deviceName AND s.timestamp between :startOfDay AND :endOfDay GROUP BY s.action")
    List<Object[]> findDeviceHistoryForToday(@Param("deviceName") String deviceName, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);


}
