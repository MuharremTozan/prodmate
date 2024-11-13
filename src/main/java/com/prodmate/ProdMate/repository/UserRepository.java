package com.prodmate.ProdMate.repository;

import com.prodmate.ProdMate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
