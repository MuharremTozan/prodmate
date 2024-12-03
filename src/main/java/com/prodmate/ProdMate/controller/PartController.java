package com.prodmate.ProdMate.controller;

import com.prodmate.ProdMate.model.Part;
import com.prodmate.ProdMate.service.PartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
public class PartController {

    @Autowired
    private PartService partService;

    @PostMapping
    public Part addPart(@RequestBody Part part) {
        return partService.addPart(part);
    }

    @GetMapping
    public List<Part> getAllParts() {
        return partService.getAllParts();
    }

    @PutMapping("/{id}")
    public Part updatePart(@PathVariable Long id, @RequestBody Part partDetails) {
        return partService.updatePart(id, partDetails);
    }

    @DeleteMapping("/{id}")
    public void deletePart(@PathVariable Long id) {
        partService.deletePart(id);
    }
}
