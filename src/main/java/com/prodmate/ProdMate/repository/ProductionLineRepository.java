package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.ProductionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionLineRepository extends JpaRepository<ProductionLine, Long>{

    @Query("SELECT p FROM ProductionLine p WHERE p.userId = :userId")
    List<ProductionLine> findByUserId(@Param("userId") Long userId);

}
