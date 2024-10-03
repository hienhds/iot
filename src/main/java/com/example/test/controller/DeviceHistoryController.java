package com.example.test.controller;

import com.example.test.model.DeviceHistory;
import com.example.test.service.DeviceHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class DeviceHistoryController {
    @Autowired
    private DeviceHistoryService deviceHistoryService;

    @RequestMapping("/history")
    public String getDeviceHistory(Model model,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int size,
                                @RequestParam(defaultValue = "timestamp") String sortField,
                                @RequestParam(defaultValue = "asc") String sortDir,
                                @RequestParam(defaultValue = "") String searchKeyword,
                                @RequestParam(defaultValue = "false") boolean ajax) {


        Page<DeviceHistory> deviceHistoryPage = null;

        if (size == -1) {
            List<DeviceHistory> allData;
            allData = deviceHistoryService.searchDeviceHistory(searchKeyword, Sort.by(Sort.Direction.fromString(sortDir), sortField));

            model.addAttribute("deviceHistoryList", allData);
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", 1);
        } else {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortField));

            deviceHistoryPage = deviceHistoryService.searchDeviceHistory(pageable, searchKeyword);
            model.addAttribute("deviceHistoryList", deviceHistoryPage.getContent());
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", deviceHistoryPage.getTotalPages());
        }


        if (deviceHistoryPage != null && deviceHistoryPage.isEmpty()) {
            model.addAttribute("noResultsMessage", "Không tìm thấy kết quả phù hợp.");
            model.addAttribute("totalPages", 0);
        }

        model.addAttribute("size", size);
        model.addAttribute("sortField", sortField);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("searchKeyword", searchKeyword);
        if (ajax) {
            // Trả về phần tbody của bảng dưới dạng HTML cho yêu cầu AJAX
            return "fragments/deviceHistoryTable :: tableBody";
        }

        return "history";
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/fan-action-counts")
    public ResponseEntity<Map<String, Long>> getFanActionCountsForToday(@RequestParam String deviceName) {
        Map<String, Long> actionCounts = deviceHistoryService.getFanActionCountsForToday(deviceName);
        return ResponseEntity.ok(actionCounts);
    }
}
