package com.prodmate.ProdMate.controller;

import com.prodmate.ProdMate.model.LinesAndParts;
import com.prodmate.ProdMate.model.Part;
import com.prodmate.ProdMate.repository.LinesAndPartsRepository;
import com.prodmate.ProdMate.repository.StocksRepository;
import com.prodmate.ProdMate.service.LinesAndPartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lines-and-parts")
public class LinesAndPartsController {

    @Autowired
    private LinesAndPartsService linesAndPartsService;
    @Autowired
    private StocksRepository stocksRepository;
    @Autowired
    private LinesAndPartsRepository linesAndPartsRepository;

    @GetMapping("part/{partId}/lines")
    public ResponseEntity<List<Long>> getLineIdsByPartId(@PathVariable Long partId) {
        List<Long> lineIds = linesAndPartsRepository.findLineIdsByPartId(partId);
        return ResponseEntity.ok(lineIds);
    }

    @PostMapping("/create-with-line")
    public LinesAndParts addPartWithPossibleNewProductionLine(@RequestBody Map<String, Object> partData) {
        Long userId = Long.valueOf(partData.get("userId").toString());
        Long productionLineId = Long.valueOf(partData.get("lineId").toString());

        Part newPart = new Part();
        newPart.setName(partData.get("name").toString());
        newPart.setAmount(Integer.valueOf(partData.get("quantity").toString()));
        newPart.setPurchasePrice(Double.valueOf(partData.get("purchasePrice").toString()));
        newPart.setSalePrice(Double.valueOf(partData.get("salePrice").toString()));
        newPart.setIsFinalProduct(Boolean.valueOf(partData.get("isFinalProduct").toString()));

        List<Map<String, Object>> stockRequirements = (List<Map<String, Object>>) partData.get("stockRequirements");

        return linesAndPartsService.createPartAndPossiblyNewProductionLine(productionLineId, userId, newPart, stockRequirements);
    }



    @GetMapping("/{productionLineId}")
    public List<Map<String, Object>> getPartsByProductionLine(@PathVariable Long productionLineId) {
        return linesAndPartsService.getPartsByProductionLineId(productionLineId)
                .stream()
                .map(lineAndPart -> {
                    Map<String, Object> partData = new HashMap<>();
                    Part part = lineAndPart.getPart();
                    partData.put("partId", part.getPartId());
                    partData.put("name", part.getName());
                    partData.put("quantity", part.getAmount());
                    partData.put("purchasePrice", part.getPurchasePrice());
                    partData.put("salePrice", part.getSalePrice());
                    partData.put("isFinalProduct", part.getIsFinalProduct());

                    // Requirements verisini ekleyin
                    List<Map<String, Object>> requirements = part.getRequirements().stream()
                            .map(req -> {
                                Map<String, Object> reqMap = new HashMap<>();
                                reqMap.put("stockName", req.getStock().getName());
                                reqMap.put("amount", req.getAmount());
                                return reqMap;
                            })
                            .collect(Collectors.toList());
                    partData.put("stockRequirements", requirements);

                    return partData;
                })
                .collect(Collectors.toList());
    }


    @DeleteMapping("/{id}")
    public void removePartFromProductionLine(@PathVariable Long id) {
        linesAndPartsService.removePartFromProductionLine(id);
    }
}
