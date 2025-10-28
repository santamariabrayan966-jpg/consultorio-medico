package com.example.acceso.service;

import com.example.acceso.model.Usuario;
import com.example.acceso.model.Perfil;
import com.example.acceso.repository.UsuarioRepository;
import com.example.acceso.repository.PerfilRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ================================
    // LISTAR USUARIOS
    // ================================
    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {
        // Retorna todos los usuarios excepto los eliminados (estado = 2)
        return usuarioRepository.findAllByEstadoNot(2);
    }

    // ================================
    // GUARDAR O ACTUALIZAR USUARIO
    // ================================
    @Transactional
    public Usuario guardarUsuario(Usuario usuario) {
        try {
            validarCamposObligatorios(usuario);

            // Normalizamos los campos
            usuario.setNombre(usuario.getNombre().trim());
            usuario.setUsuario(usuario.getUsuario().trim().toLowerCase());
            usuario.setCorreo(usuario.getCorreo().trim().toLowerCase());

            // Asociar perfil si existe
            if (usuario.getPerfil() != null && usuario.getPerfil().getId() != null) {
                Perfil perfil = perfilRepository.findById(usuario.getPerfil().getId())
                        .orElseThrow(() -> new IllegalArgumentException("El perfil especificado no existe"));
                usuario.setPerfil(perfil);
            } else {
                usuario.setPerfil(null);
            }

            // Si ya existe, actualiza; si no, crea uno nuevo
            if (usuario.getId() != null) {
                return actualizarUsuario(usuario);
            } else {
                return crearUsuario(usuario);
            }

        } catch (DataIntegrityViolationException e) {
            manejarViolacionesDeIntegridad(e);
            return null; // No llega aquí, pero requerido por compilador
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el usuario: " + e.getMessage(), e);
        }
    }

    // ================================
    // CREAR NUEVO USUARIO
    // ================================
    private Usuario crearUsuario(Usuario usuario) {
        if (usuario.getClave() == null || usuario.getClave().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria para nuevos usuarios");
        }

        usuario.setClave(passwordEncoder.encode(usuario.getClave().trim()));
        usuario.setEstado(1); // Activo por defecto
        return usuarioRepository.save(usuario);
    }

    // ================================
    // ACTUALIZAR USUARIO EXISTENTE
    // ================================
    private Usuario actualizarUsuario(Usuario usuario) {
        Optional<Usuario> existente = obtenerUsuarioPorId(usuario.getId());
        if (existente.isEmpty()) {
            throw new IllegalArgumentException("Usuario no encontrado para actualizar");
        }

        Usuario usuarioExistente = existente.get();

        // Si no se cambia la clave, mantener la anterior
        if (usuario.getClave() == null || usuario.getClave().trim().isEmpty()) {
            usuario.setClave(usuarioExistente.getClave());
        } else {
            usuario.setClave(passwordEncoder.encode(usuario.getClave().trim()));
        }

        return usuarioRepository.save(usuario);
    }

    // ================================
    // VALIDAR CAMPOS OBLIGATORIOS
    // ================================
    private void validarCamposObligatorios(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (usuario.getUsuario() == null || usuario.getUsuario().trim().isEmpty()) {
            throw new IllegalArgumentException("El usuario es obligatorio");
        }
        if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
    }

    // ================================
    // MANEJAR EXCEPCIONES DE INTEGRIDAD
    // ================================
    private void manejarViolacionesDeIntegridad(DataIntegrityViolationException e) {
        String msg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";

        if (msg.contains("usuario")) {
            throw new IllegalArgumentException("El nombre de usuario ya existe");
        } else if (msg.contains("correo") || msg.contains("email")) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado");
        } else {
            throw new IllegalArgumentException("Error de integridad de datos");
        }
    }

    // ================================
    // OBTENER USUARIO POR ID
    // ================================
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        if (id == null || id <= 0) return Optional.empty();
        return usuarioRepository.findById(id);
    }

    // ================================
    // CONTAR USUARIOS
    // ================================
    @Transactional(readOnly = true)
    public long contarUsuarios() {
        return usuarioRepository.countByEstadoNot(2);
    }

    // ================================
    // BUSCAR POR NOMBRE DE USUARIO
    // ================================
    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsuario(String usuario) {
        if (usuario == null || usuario.trim().isEmpty()) return Optional.empty();
        return usuarioRepository.findByUsuario(usuario.trim().toLowerCase());
    }

    // ================================
    // ELIMINAR (BORRADO LÓGICO)
    // ================================
    @Transactional
    public void eliminarUsuario(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("ID de usuario inválido");

        Usuario usuario = obtenerUsuarioPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        usuario.setEstado(2); // Estado 2 = Eliminado
        usuarioRepository.save(usuario);
    }

    // ================================
    // CAMBIAR ESTADO ACTIVO/INACTIVO
    // ================================
    @Transactional
    public Optional<Usuario> cambiarEstadoUsuario(Long id) {
        if (id == null || id <= 0) return Optional.empty();

        return obtenerUsuarioPorId(id).map(usuario -> {
            if (usuario.getEstado() == 1) usuario.setEstado(0);
            else if (usuario.getEstado() == 0) usuario.setEstado(1);
            return usuarioRepository.save(usuario);
        });
    }

    // ================================
    // VERIFICAR EXISTENCIA DE USUARIO/CORREO
    // ================================
    @Transactional(readOnly = true)
    public boolean existeUsuario(String nombreUsuario) {
        return nombreUsuario != null && usuarioRepository.existsByUsuario(nombreUsuario.trim().toLowerCase());
    }

    @Transactional(readOnly = true)
    public boolean existeCorreo(String correo) {
        return correo != null && usuarioRepository.existsByCorreo(correo.trim().toLowerCase());
    }

    // ================================
    // VERIFICAR CONTRASEÑA
    // ================================
    public boolean verificarContrasena(String contrasenaTextoPlano, String contrasenaEncriptada) {
        return passwordEncoder.matches(contrasenaTextoPlano, contrasenaEncriptada);
    }
}
