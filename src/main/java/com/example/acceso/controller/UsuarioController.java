package com.example.acceso.controller;

import com.example.acceso.model.Usuario;
import com.example.acceso.model.Perfil;
import com.example.acceso.service.UsuarioService;
import com.example.acceso.repository.PerfilRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Controller
@RequestMapping(value = "/usuarios", produces = "application/json; charset=UTF-8")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final PerfilRepository perfilRepository;

    @Autowired
    public UsuarioController(UsuarioService usuarioService, PerfilRepository perfilRepository) {
        this.usuarioService = usuarioService;
        this.perfilRepository = perfilRepository;
    }

    // ================================
    // VISTA PRINCIPAL DE USUARIOS
    // ================================
    @GetMapping("/listar")
    public String listarUsuarios(Model model) {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        List<Perfil> perfiles = perfilRepository.findAll(); // Solo perfiles activos
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("perfiles", perfiles);
        model.addAttribute("formUsuario", new Usuario());
        return "usuarios";
    }

    // ================================
    // API - LISTAR USUARIOS
    // ================================
    @GetMapping("/api/listar")
    @ResponseBody
    public ResponseEntity<?> listarUsuariosApi() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", usuarioService.listarUsuarios());
        return ResponseEntity.ok(response);
    }

    // ================================
    // API - GUARDAR USUARIO (con perfil e imagen)
    // ================================
    @PostMapping("/api/guardar")
    @ResponseBody
    public ResponseEntity<?> guardarUsuarioAjax(
            @Valid @ModelAttribute Usuario usuario,
            BindingResult bindingResult,
            @RequestParam(value = "imagen", required = false) MultipartFile file,
            @RequestParam(value = "idPerfil", required = false) Integer idPerfil)
    {

        Map<String, Object> response = new HashMap<>();

        // Validar errores del formulario
        if (bindingResult.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));
            response.put("success", false);
            response.put("message", "Datos inválidos");
            response.put("errors", errores);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Asignar el perfil (si se envía)
            if (idPerfil != null) {
                Perfil perfil = perfilRepository.findById(idPerfil)
                        .orElseThrow(() -> new IllegalArgumentException("Perfil no válido"));
                usuario.setPerfil(perfil);
            } else {
                usuario.setPerfil(null);
            }

            // Procesar imagen si se adjunta
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                File saveFile = new File("src/main/resources/static/uploads/" + fileName);
                saveFile.getParentFile().mkdirs();
                file.transferTo(saveFile);
                usuario.setImagen(fileName);
            }

            Usuario usuarioGuardado = usuarioService.guardarUsuario(usuario);

            response.put("success", true);
            response.put("usuario", usuarioGuardado);
            response.put("message",
                    usuario.getId() != null
                            ? "Usuario actualizado correctamente"
                            : "Usuario creado correctamente");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Error al subir imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // ================================
    // API - OBTENER USUARIO POR ID
    // ================================
    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        return usuarioService.obtenerUsuarioPorId(id)
                .map(usuario -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("data", usuario);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Usuario no encontrado")));
    }

    // ================================
    // API - ELIMINAR USUARIO
    // ================================
    @DeleteMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<?> eliminarUsuarioAjax(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        if (usuarioService.obtenerUsuarioPorId(id).isEmpty()) {
            response.put("success", false);
            response.put("message", "Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        usuarioService.eliminarUsuario(id);
        response.put("success", true);
        response.put("message", "Usuario eliminado correctamente");
        return ResponseEntity.ok(response);
    }

    // ================================
    // API - CAMBIAR ESTADO
    // ================================
    @PostMapping("/api/cambiar-estado/{id}")
    @ResponseBody
    public ResponseEntity<?> cambiarEstadoUsuarioAjax(@PathVariable Long id) {
        return usuarioService.cambiarEstadoUsuario(id)
                .map(usuario -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("usuario", usuario);
                    response.put("message", "Estado del usuario actualizado correctamente");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Usuario no encontrado")));
    }
}
