package com.example.acceso.controller;

import com.example.acceso.model.Perfil;
import com.example.acceso.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/perfiles/api")
public class PerfilRestController {

    @Autowired
    private PerfilRepository perfilRepository;

    // Listar
    @GetMapping("/listar")
    public Map<String, Object> listar() {
        List<Perfil> perfiles = perfilRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("data", perfiles);
        return response;
    }

    // Guardar o editar
    @PostMapping("/guardar")
    public Map<String, Object> guardar(@RequestBody Perfil perfil) {
        perfilRepository.save(perfil);
        return Map.of("success", true, "message", "Perfil guardado correctamente");
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public Map<String, Object> obtener(@PathVariable Integer id) {
        Optional<Perfil> perfil = perfilRepository.findById(id);
        return perfil.map(p -> Map.of("success", true, "data", p))
                .orElse(Map.of("success", false, "message", "Perfil no encontrado"));
    }

    // Eliminar
    @DeleteMapping("/eliminar/{id}")
    public Map<String, Object> eliminar(@PathVariable Integer id) {
        perfilRepository.deleteById(id);
        return Map.of("success", true, "message", "Perfil eliminado correctamente");
    }

    // Cambiar estado
    @PostMapping("/cambiar-estado/{id}")
    public Map<String, Object> cambiarEstado(@PathVariable Integer id) {
        Optional<Perfil> perfilOpt = perfilRepository.findById(id);

        if (perfilOpt.isPresent()) {
            Perfil perfil = perfilOpt.get();
            perfil.setEstado(perfil.getEstado() != null && perfil.getEstado() == 1 ? 0 : 1);
            perfilRepository.save(perfil);
            return Map.of("success", true, "message", "Estado actualizado correctamente");
        }
        return Map.of("success", false, "message", "Perfil no encontrado");
    }
}

