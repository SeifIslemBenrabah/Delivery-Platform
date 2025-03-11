package com.esi.auth.Entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class PickUpAddress {
    private Double longitude;
    private Double latitude;
}