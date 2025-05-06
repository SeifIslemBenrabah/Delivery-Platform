package com.example.demo.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.demo.Entity.Commercant;

public interface commercentRepo extends JpaRepository<Commercant,Long> {
    Commercant findByUser_Id(Long userId);
}
