package com.prodmate.ProdMate.service;

import com.prodmate.ProdMate.model.Part;
import com.prodmate.ProdMate.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartService {

    @Autowired
    private PartRepository partRepository;

    public Part addPart(Part part) {
        return partRepository.save(part);
    }

    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    public Part getPartById(Long id) {
        return partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Part not found with ID: " + id));
    }

    public Part updatePart(Long id, Part partDetails){
        return partRepository.findById(id).map(part -> {
            if (partDetails.getName() != null) {
                part.setName(partDetails.getName());
            }
            if (partDetails.getAmount() != null) {
                part.setAmount(partDetails.getAmount());
            }
            if (partDetails.getIsFinalProduct() != null) {
                part.setIsFinalProduct(partDetails.getIsFinalProduct());
            }
            if (partDetails.getSalePrice() != null) {
                part.setSalePrice(partDetails.getSalePrice());
            }
            if (partDetails.getRequirements() != null) {
                part.setRequirements(partDetails.getRequirements());
            }
            return partRepository.save(part);
        }).orElseThrow(() -> new RuntimeException("Part not found with ID: " + id));
    }

    public void deletePart(Long id){
        if (partRepository.existsById(id)) {
            partRepository.deleteById(id);
        } else {
            throw new RuntimeException("Part not found with ID: " + id);
        }
    }
}
