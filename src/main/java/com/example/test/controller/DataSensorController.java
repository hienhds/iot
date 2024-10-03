package com.example.test.controller;

import com.example.test.model.SensorData;
import com.example.test.service.SensorDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class DataSensorController {

    // Khởi tạo Logger
    private static final Logger logger = LoggerFactory.getLogger(DataSensorController.class);


    @Autowired
    private SensorDataService sensorDataService;

    @RequestMapping("/dataSensor")
    public String getDataSensor(Model model,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int size,
                                @RequestParam(defaultValue = "id") String sortField,
                                @RequestParam(defaultValue = "asc") String sortDir,
                                @RequestParam(defaultValue = "") String searchKeyword,
                                @RequestParam(defaultValue = "all") String sensorType,
                                @RequestParam(defaultValue = "false") boolean ajax) {
        logger.info("Bắt đầu xử lý getDataSensor với các tham số: page={}, size={}, sortField={}, sortDir={}, searchKeyword={}",
                page, size, sortField, sortDir, searchKeyword);

        Page<SensorData> sensorDataPage = null;

        if (size == -1) {
            List<SensorData> allData;
            if (!sensorType.equals("all")) {
                // Cần thêm tham số Sort khi gọi phương thức
                allData = sensorDataService.searchSensorDataByType(searchKeyword, sensorType, Sort.by(Sort.Direction.fromString(sortDir), sortField));
            } else {
                allData = sensorDataService.searchSensorData(searchKeyword, Sort.by(Sort.Direction.fromString(sortDir), sortField));
            }
            model.addAttribute("sensorDataList", allData);
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", 1);
            logger.info("Lấy tất cả dữ liệu thành công.");
        } else {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortField));
            if (!sensorType.equals("all")) {
                sensorDataPage = sensorDataService.searchSensorDataByType(pageable, searchKeyword, sensorType);
            } else {
                sensorDataPage = sensorDataService.searchSensorData(pageable, searchKeyword);
            }
            model.addAttribute("sensorDataList", sensorDataPage.getContent());
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", sensorDataPage.getTotalPages());

            logger.info("Lấy dữ liệu phân trang thành công. Số trang: {}", sensorDataPage.getTotalPages());
        }


        if (sensorDataPage != null && sensorDataPage.isEmpty()) {
            model.addAttribute("noResultsMessage", "Không tìm thấy kết quả phù hợp.");
            model.addAttribute("totalPages", 0);
            logger.warn("Không tìm thấy kết quả nào cho từ khóa tìm kiếm: {}", searchKeyword);
        }

        model.addAttribute("size", size);
        model.addAttribute("sortField", sortField);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("searchKeyword", searchKeyword);
        model.addAttribute("sensorType", sensorType);
        if (ajax) {
            // Trả về phần tbody của bảng dưới dạng HTML cho yêu cầu AJAX
            logger.info("Trả về kết quả cho yêu cầu AJAX.");
            return "fragments/sensorDataTable :: tableBody";
        }

        return "dataSensor";
    }
    @GetMapping("/bui-count")
    public ResponseEntity<Long> getBuiCount() {
        Long count = sensorDataService.countBuiGreaterThan80ByDate();
        System.out.println(count);
        return ResponseEntity.ok(count);

    }

    @GetMapping("/bui-list-data")
    @ResponseBody
    public List<Integer> getListValueBui(){
        System.out.println(sensorDataService.listValueBui());
        return sensorDataService.listValueBui();
    }
}
