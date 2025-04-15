package com.example.demo.Entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commercant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cartNationalId;
    private String type;

    @OneToOne(mappedBy = "commercant")
    private User user;
    @OneToMany(mappedBy = "commercant")
    private List<Boutique> boutiques;

}