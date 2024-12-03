package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.LinesAndParts;
import com.prodmate.ProdMate.model.ProductionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinesAndPartsRepository extends JpaRepository<LinesAndParts, Long> {
    @Query("SELECT lp FROM LinesAndParts lp WHERE lp.productionLine.productionLineId = :productionLineId")
    List<LinesAndParts> findByProductionLineId(@Param("productionLineId") Long productionLineId);
    long countByProductionLine(ProductionLine productionLine);

    @Query("SELECT DISTINCT lp.productionLine.productionLineId FROM LinesAndParts lp WHERE lp.part.partId = :partId")
    List<Long> findLineIdsByPartId(@Param("partId") Long partId);
}
