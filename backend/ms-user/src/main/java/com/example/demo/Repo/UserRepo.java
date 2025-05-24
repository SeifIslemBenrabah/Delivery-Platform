package com.example.demo.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.demo.Entity.User;

public interface UserRepo extends JpaRepository<User,Long> {
     Optional<User> findByEmail(String email);
    
}
