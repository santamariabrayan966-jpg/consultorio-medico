package com.example.acceso.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "historial_clinico")
public class HistorialClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario paciente;

    @Column(nullable = false, length = 255)
    private String diagnostico;

    @Column(nullable = false, length = 255)
    private String tratamiento;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    // ===== CONSTRUCTORES =====
    public HistorialClinico() {}
    public HistorialClinico(Usuario paciente, String diagnostico, String tratamiento, LocalDate fechaRegistro) {
        this.paciente = paciente;
        this.diagnostico = diagnostico;
        this.tratamiento = tratamiento;
        this.fechaRegistro = fechaRegistro;
    }

    // ===== GETTERS Y SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getPaciente() { return paciente; }
    public void setPaciente(Usuario paciente) { this.paciente = paciente; }

    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }

    public String getTratamiento() { return tratamiento; }
    public void setTratamiento(String tratamiento) { this.tratamiento = tratamiento; }

    public LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
