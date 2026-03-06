package com.jaehyeon.portfolio.repository;

import com.jaehyeon.portfolio.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {
    Optional<CommonCode> findByGroupIdAndCode(String groupId, String code);
}
