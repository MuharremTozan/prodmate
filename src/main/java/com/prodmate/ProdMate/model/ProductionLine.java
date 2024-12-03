package com.prodmate.ProdMate.model;
import jakarta.persistence.*;

@Entity
@Table(name = "production_lines")
public class ProductionLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productionLineId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long userId;

    // Getters and Setters
    public Long getProductionLineId() {
        return productionLineId;
    }

    public void setProductionLineId(Long productionLineId) {
        this.productionLineId = productionLineId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
