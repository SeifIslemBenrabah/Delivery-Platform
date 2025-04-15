package com.example.demo.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Boutique;
import com.example.demo.Entity.HeuresTravail;

public interface heuresTravailRepo extends JpaRepository<HeuresTravail, Long>  {
    List<HeuresTravail> findByBoutique(Boutique boutique);

    void deleteByBoutique(Boutique boutique);
}
