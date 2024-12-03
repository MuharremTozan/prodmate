package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StocksRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByUserUserId(Long userId);
    Optional<Stock> findById(Long id);
}
