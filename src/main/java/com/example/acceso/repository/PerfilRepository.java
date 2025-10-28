package com.example.acceso.repository;

import com.example.acceso.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Integer> {

    // 🔍 Buscar perfil por nombre (por si quieres validar duplicados)
    Optional<Perfil> findByNombreIgnoreCase(String nombre);

    // 🔍 Listar solo perfiles activos (estado = 1)
    List<Perfil> findByEstado(Integer estado);

    // 🔍 Verificar si existe un perfil por nombre (ignora mayúsculas)
    boolean existsByNombreIgnoreCase(String nombre);
}
