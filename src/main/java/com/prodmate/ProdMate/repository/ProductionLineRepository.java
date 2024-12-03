package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.ProductionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionLineRepository extends JpaRepository<ProductionLine, Long>{

    List<ProductionLine> findByUserId(Long userId);
}
