package com.prodmate.ProdMate.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lines_and_parts")
public class LinesAndParts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long linesAndPartsId;

    @ManyToOne
    @JoinColumn(name = "production_line_id", nullable = false)
    private ProductionLine productionLine;

    @ManyToOne
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;

    // Getters and Setters
    public Long getLinesAndPartsId() {
        return linesAndPartsId;
    }

    public void setLinesAndPartsId(Long linesAndPartsId) {
        this.linesAndPartsId = linesAndPartsId;
    }

    public ProductionLine getProductionLine() {
        return productionLine;
    }

    public void setProductionLine(ProductionLine productionLine) {
        this.productionLine = productionLine;
    }

    public Part getPart() {
        return part;
    }

    public void setPart(Part part) {
        this.part = part;
    }
}
