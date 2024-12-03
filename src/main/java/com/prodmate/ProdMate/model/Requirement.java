package com.prodmate.ProdMate.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "requirements")
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requirementId;

    private Integer amount;

    @ManyToOne
    @JoinColumn(name = "part_id", nullable = false)
    @JsonBackReference
    private Part part;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    // Getters and Setters
    public Long getRequirementId() {
        return requirementId;
    }

    public void setRequirementId(Long requirementId) {
        this.requirementId = requirementId;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Part getPart() {
        return part;
    }

    public void setPart(Part part) {
        this.part = part;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }
}
