package com.prodmate.ProdMate.controller;

import com.prodmate.ProdMate.model.Requirement;
import com.prodmate.ProdMate.service.RequirementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requirements")
public class RequirementsController {

    @Autowired
    private RequirementsService requirementsService;

    @GetMapping("/part/{partId}")
    public List<Requirement> getRequirementsByPartId(@PathVariable Long partId) {
        return requirementsService.getRequirementsByPartId(partId);
    }

    @GetMapping("/stock/{stockId}")
    public List<Requirement> getRequirementsByStockId(@PathVariable Long stockId) {
        return requirementsService.getRequirementsByStockId(stockId);
    }


    @DeleteMapping("/{requirementId}")
    public void deleteRequirement(@PathVariable Long requirementId) {
        requirementsService.deleteRequirement(requirementId);
    }
}
