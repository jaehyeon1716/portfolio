package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.entity.Schedule;
import com.jaehyeon.portfolio.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService service;

    @GetMapping
    public List<Schedule> getSchedules(@RequestParam("username") String username) {
        return service.getAllSchedules(username);
    }

    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return service.saveSchedule(schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        service.deleteSchedule(id);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleSchedule(@PathVariable Long id){
        service.toggleComplete(id);
        return ResponseEntity.ok().build();
    }
}