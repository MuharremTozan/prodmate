package com.prodmate.ProdMate.controller;

import com.prodmate.ProdMate.model.ProductionLine;
import com.prodmate.ProdMate.service.ProductionLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production-lines")
public class ProductionLineController {

    @Autowired
    private ProductionLineService productionLineService;

    @PostMapping
    public ResponseEntity<?> createProductionLine(
            @RequestBody ProductionLine productionLine
    ) {
        if (productionLine.getUserId() == null) {
            return ResponseEntity.badRequest().body("User ID is required.");
        }
        ProductionLine savedLine = productionLineService.createProductionLine(productionLine);
        return ResponseEntity.ok(savedLine);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ProductionLine>> getProductionLines(@PathVariable String userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Long userIdLong = Long.parseLong(userId);
        List<ProductionLine> productionLines = productionLineService.getProductionLinesByUserId(userIdLong);
        return ResponseEntity.ok(productionLines);
    }

    @DeleteMapping("/{lineId}")
    public ResponseEntity<Void> deleteProductionLine(@PathVariable Long lineId) {
        productionLineService.deleteProductionLineById(lineId);
        return ResponseEntity.noContent().build();
    }
}
