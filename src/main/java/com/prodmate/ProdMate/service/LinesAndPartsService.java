package com.prodmate.ProdMate.service;

import com.prodmate.ProdMate.model.LinesAndParts;
import com.prodmate.ProdMate.model.Part;
import com.prodmate.ProdMate.model.ProductionLine;
import com.prodmate.ProdMate.model.Requirement;
import com.prodmate.ProdMate.repository.LinesAndPartsRepository;
import com.prodmate.ProdMate.repository.PartRepository;
import com.prodmate.ProdMate.repository.ProductionLineRepository;
import com.prodmate.ProdMate.repository.StocksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LinesAndPartsService {

    @Autowired
    private LinesAndPartsRepository linesAndPartsRepository;

    @Autowired
    private ProductionLineRepository productionLineRepository;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private RequirementsService requirementsService;

    @Autowired
    private StocksRepository stocksRepository;

    public LinesAndParts createPartAndPossiblyNewProductionLine(Long productionLineId, Long userId, Part newPart, List<Map<String, Object>> stockRequirements) {
        ProductionLine existingProductionLine = productionLineRepository.findById(productionLineId)
                .orElseThrow(() -> new RuntimeException("Production Line not found"));

        Part savedPart = partRepository.save(newPart);

        if (stockRequirements != null && !stockRequirements.isEmpty()) {
            List<Requirement> requirements = stockRequirements.stream()
                    .map(reqMap -> {
                        Requirement requirement = new Requirement();
                        requirement.setAmount(Integer.valueOf(reqMap.get("amount").toString()));

                        Long stockId = Long.valueOf(reqMap.get("stockId").toString());
                        requirement.setStock(stocksRepository.findById(stockId)
                        .orElseThrow(() -> new RuntimeException("Stock not found")));
                        requirement.setPart(savedPart);
                        return requirement;
                    })
                    .collect(Collectors.toList());

            // Gereksinimleri kaydet
            requirements.forEach(requirementsService::addRequirement);

            // Part'a ilişkilendir
            newPart.setRequirements(requirements);
        }

        LinesAndParts linesAndParts = new LinesAndParts();
        linesAndParts.setProductionLine(existingProductionLine);
        linesAndParts.setPart(savedPart);
        linesAndPartsRepository.save(linesAndParts);



        if (newPart.getIsFinalProduct()) {
            long partCount = linesAndPartsRepository.countByProductionLine(existingProductionLine);
            if (partCount > 1) {
                createNewProductionLineWithPart(savedPart, userId);
            }
        }

        return linesAndParts;
    }

    private void createNewProductionLineWithPart(Part part, Long userId) {
        ProductionLine newProductionLine = new ProductionLine();
        newProductionLine.setName(part.getName() + " Production Line");
        newProductionLine.setUserId(userId);
        ProductionLine savedNewLine = productionLineRepository.save(newProductionLine);

        LinesAndParts newRelation = new LinesAndParts();
        newRelation.setProductionLine(savedNewLine);
        newRelation.setPart(part);
        linesAndPartsRepository.save(newRelation);
    }


    public List<LinesAndParts> getPartsByProductionLineId(Long productionLineId) {
        return linesAndPartsRepository.findByProductionLineId(productionLineId);
    }

    public void removePartFromProductionLine(Long id) {
        linesAndPartsRepository.deleteById(id);
    }
}
