package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.entity.Schedule;
import com.jaehyeon.portfolio.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository repository;

    public List<Schedule> getAllSchedules(String username) {
        return repository.findByUsername(username);
    }
    public Schedule saveSchedule(Schedule schedule) { return repository.save(schedule); }
    public void deleteSchedule(Long id) { repository.deleteById(id); }

    @Transactional
    public void toggleComplete(Long id) {
        Schedule schedule = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));

        schedule.setCompleted(!schedule.isCompleted());
    }
}