package com.example.acceso.repository;

import com.example.acceso.model.Usuario;
import com.example.acceso.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar por nombre de usuario
    Optional<Usuario> findByUsuario(String usuario);

    // Buscar por correo
    Optional<Usuario> findByCorreo(String correo);

    // Verificar si existen por usuario o correo
    boolean existsByUsuario(String usuario);
    boolean existsByCorreo(String correo);

    // Listar usuarios con estado activo/inactivo
    List<Usuario> findAllByEstadoNot(Integer estado);
    long countByEstadoNot(Integer estado);

    // 🔍 Nuevo: Buscar usuarios por perfil
    List<Usuario> findByPerfil(Perfil perfil);

    // 🔍 Nuevo: Buscar usuarios activos por perfil
    List<Usuario> findByPerfilAndEstado(Perfil perfil, Integer estado);
}
