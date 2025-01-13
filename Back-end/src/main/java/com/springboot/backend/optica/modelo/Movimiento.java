package com.springboot.backend.optica.modelo;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Entity
@Table(name = "movimientos")
@Data
public class Movimiento implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false)
    private String tipoMovimiento; // ENTRADA o SALIDA

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private double total;
    
    @Column(nullable = false)
    private double totalImpuesto;

    @Column(length = 200)
    private String descripcion;

    // Relación con Paciente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonIgnoreProperties({"movimientos", "hibernateLazyInitializer", "handler"})
    private Paciente paciente;

    // Relación con DetalleMovimiento
    @OneToMany(mappedBy = "movimiento", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"movimiento", "hibernateLazyInitializer", "handler"})
    private List<DetalleMovimiento> detalles;

    // Relación con MetodoPago
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metodo_pago_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MetodoPago metodoPago; // Forma de pago utilizada en el movimiento
    
 // Relación con Local
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "local_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Local local;

    private static final long serialVersionUID = 1L;
}
