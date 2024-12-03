package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequirementsRepository extends JpaRepository<Requirement, Long> {
    List<Requirement> findByPartPartId(Long partId);
    List<Requirement> findByStockStockId(Long stockId);
}
