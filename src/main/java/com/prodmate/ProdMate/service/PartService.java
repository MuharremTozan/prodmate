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

    public Part updatePart(Long id, Part partDetails){
        Part part = partRepository.findById(id).orElseThrow(() -> new RuntimeException("Part not found"));
        part.setName(partDetails.getName());
        part.setAmount(partDetails.getAmount());
        part.setIsFinalProduct(partDetails.getIsFinalProduct());
        part.setSalePrice(partDetails.getSalePrice());
        return partRepository.save(part);
    }

    public void deletePart(Long id){
        partRepository.deleteById(id);
    }
}
