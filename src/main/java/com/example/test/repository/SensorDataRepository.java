package com.example.test.repository;

import com.example.test.model.SensorData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    SensorData findTopByOrderByTimestampDesc();

    // Tìm kiếm với từ khóa cho phân trang
    @Query("SELECT s FROM SensorData s WHERE " +
            "CAST(s.temperature AS string) LIKE %:keyword% OR " +
            "CAST(s.light AS string) LIKE %:keyword% OR " +
            "CAST(s.humidity AS string) LIKE %:keyword% OR " +
            "CAST(s.bui AS string) LIKE %:keyword% OR " +
            "CAST(s.timestamp AS string) LIKE %:keyword%")
    Page<SensorData> findByKeyword(String keyword, Pageable pageable);

    // Tìm kiếm không phân trang
    @Query("SELECT s FROM SensorData s WHERE " +
            "CAST(s.temperature AS string) LIKE %:keyword% OR " +
            "CAST(s.light AS string) LIKE %:keyword% OR " +
            "CAST(s.humidity AS string) LIKE %:keyword% OR " +
            "CAST(s.bui AS string) LIKE %:keyword% OR " +
            "CAST(s.timestamp AS string) LIKE %:keyword%")
    List<SensorData> findByKeyword(String keyword, Sort sort);

    // Tìm kiếm theo loại cảm biến với phân trang
    @Query("SELECT s FROM SensorData s WHERE " +
            "(:sensorType = 'temp' AND CAST(s.temperature AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'light' AND CAST(s.light AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'hum' AND CAST(s.humidity AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'bui' AND CAST(s.bui AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'time' AND CAST(s.timestamp AS string) LIKE %:keyword%)")
    Page<SensorData> findByKeywordAndSensorType(@Param("keyword") String keyword,
                                                @Param("sensorType") String sensorType,
                                                Pageable pageable);

    // Tìm kiếm theo loại cảm biến không phân trang
    @Query("SELECT s FROM SensorData s WHERE " +
            "(:sensorType = 'temp' AND CAST(s.temperature AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'light' AND CAST(s.light AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'hum' AND CAST(s.humidity AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'bui' AND CAST(s.bui AS string) LIKE %:keyword%) OR " +
            "(:sensorType = 'time' AND CAST(s.timestamp AS string) LIKE %:keyword%)")
    List<SensorData> findByKeywordAndSensorType(@Param("keyword") String keyword,
                                                @Param("sensorType") String sensorType,
                                                Sort sort);

    @Query("SELECT COUNT(s) FROM SensorData s WHERE s.bui > 80 AND FUNCTION('DATE', s.timestamp) = CURRENT_DATE")
    Long countBuiGreaterThan80ByDate();


    @Query("select s.bui from SensorData s where function('date', s.timestamp) = current date order by s.bui desc limit 5")
    List<Integer> listValueBui();
}
