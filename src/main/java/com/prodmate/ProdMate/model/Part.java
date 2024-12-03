package com.prodmate.ProdMate.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "parts")
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long partId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private Boolean isFinalProduct;

    @Column(nullable = false)
    private Double salePrice;

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Requirement> requirements;

    // Getters and Setters
    public Long getPartId() {
        return partId;
    }

    public void setPartId(Long partId) {
        this.partId = partId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Boolean getIsFinalProduct() {
        return isFinalProduct;
    }

    public void setIsFinalProduct(Boolean isFinalProduct) {
        this.isFinalProduct = isFinalProduct;
    }

    public Double getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(Double salePrice) {
        this.salePrice = salePrice;
    }

    public List<Requirement> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<Requirement> requirements) {
        this.requirements = requirements;
    }
}
