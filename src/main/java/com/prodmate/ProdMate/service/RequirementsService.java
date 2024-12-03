package com.prodmate.ProdMate.service;

import com.prodmate.ProdMate.model.Part;
import com.prodmate.ProdMate.model.Requirement;
import com.prodmate.ProdMate.model.Stock;
import com.prodmate.ProdMate.repository.PartRepository;
import com.prodmate.ProdMate.repository.RequirementsRepository;
import com.prodmate.ProdMate.repository.StocksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequirementsService {

    @Autowired
    private RequirementsRepository requirementsRepository;

    @Autowired
    private StocksRepository stocksRepository;

    @Autowired
    private PartRepository partRepository;

    public List<Requirement> getRequirementsByPartId(Long partId) {
        return requirementsRepository.findByPartPartId(partId);
    }

    public List<Requirement> getRequirementsByStockId(Long stockId) {
        return requirementsRepository.findByStockStockId(stockId);
    }

    public Requirement addRequirement(Requirement requirement) {
        Stock managedStock = stocksRepository.findById(requirement.getStock().getStockId())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        Part managedPart = partRepository.findById(requirement.getPart().getPartId())
                .orElseThrow(() -> new RuntimeException("Part not found"));

        requirement.setStock(managedStock);
        requirement.setPart(managedPart);

        return requirementsRepository.save(requirement);
    }


    public void deleteRequirement(Long requirementId) {
        requirementsRepository.deleteById(requirementId);
    }

}
