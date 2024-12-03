package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {
}
