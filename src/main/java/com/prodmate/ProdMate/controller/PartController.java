package com.prodmate.ProdMate.controller;

import com.prodmate.ProdMate.model.Part;
import com.prodmate.ProdMate.model.Requirement;
import com.prodmate.ProdMate.model.Stock;
import com.prodmate.ProdMate.repository.StocksRepository;
import com.prodmate.ProdMate.service.PartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/parts")
public class PartController {

    @Autowired
    private PartService partService;
    @Autowired
    private StocksRepository stocksRepository;

    @PostMapping
    public Part addPart(@RequestBody Part part) {
        return partService.addPart(part);
    }

    @GetMapping
    public List<Part> getAllParts() {
        return partService.getAllParts();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Part> updatePart(@PathVariable Long id, @RequestBody Map<String, Object> partData) {
        Part existingPart = partService.getPartById(id);

        // Yeni verilerle mevcut veriyi birleştir
        if (partData.containsKey("name")) {
            existingPart.setName(partData.get("name").toString());
        }
        if (partData.containsKey("quantity")) {
            existingPart.setAmount(Integer.valueOf(partData.get("quantity").toString()));
        }
        if (partData.containsKey("salePrice")) {
            existingPart.setSalePrice(Double.valueOf(partData.get("salePrice").toString()));
        }
        if (partData.containsKey("isFinalProduct")) {
            existingPart.setIsFinalProduct(Boolean.valueOf(partData.get("isFinalProduct").toString()));
        }

        // Gereksinimler varsa güncelle
        if (partData.containsKey("stockRequirements")) {
            List<Map<String, Object>> stockRequirements = (List<Map<String, Object>>) partData.get("stockRequirements");

            // Mevcut gereksinim koleksiyonunu temizle
            existingPart.getRequirements().clear();

            // Yeni gereksinimleri oluştur ve ekle
            stockRequirements.forEach(reqMap -> {
                Requirement requirement = new Requirement();
                requirement.setAmount(Integer.valueOf(reqMap.get("amount").toString()));

                Long stockId = Long.valueOf(reqMap.get("stockId").toString());
                Stock stock = stocksRepository.findById(stockId)
                        .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + stockId));
                requirement.setStock(stock);
                requirement.setPart(existingPart);
                existingPart.getRequirements().add(requirement);
            });
        }

        Part updatedPart = partService.updatePart(id, existingPart);

        return ResponseEntity.ok(updatedPart);
    }

    @DeleteMapping("/{id}")
    public void deletePart(@PathVariable Long id) {
        partService.deletePart(id);
    }

}




