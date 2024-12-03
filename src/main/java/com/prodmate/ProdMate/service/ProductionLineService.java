package com.prodmate.ProdMate.service;


import com.prodmate.ProdMate.model.ProductionLine;
import com.prodmate.ProdMate.repository.ProductionLineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductionLineService {

    @Autowired
    private ProductionLineRepository productionLineRepository;

    public ProductionLine createProductionLine(ProductionLine productionLine) {
        if(productionLine.getUserId() == null){
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return productionLineRepository.save(productionLine);
    }

    public List<ProductionLine> getProductionLinesByUserId(Long userId) {
        if(userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return productionLineRepository.findByUserId(userId);
    }

    public void deleteProductionLine(Long productionLineId) {
        productionLineRepository.deleteById(productionLineId);
    }
}
