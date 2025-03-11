package com.esi.auth.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.esi.auth.Entity.User;


public interface UserRepo extends JpaRepository<User,Long> {
     Optional<User> findByEmail(String email);
    
}
