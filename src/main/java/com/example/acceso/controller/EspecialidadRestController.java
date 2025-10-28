package com.example.acceso.controller;

import com.example.acceso.model.Especialidad;
import com.example.acceso.repository.EspecialidadRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/especialidades/api")
public class EspecialidadRestController {

    private final EspecialidadRepository repository;

    public EspecialidadRestController(EspecialidadRepository repository) {
        this.repository = repository;
    }

    // ✅ Listar todas las especialidades (para DataTables)
    @GetMapping("/listar")
    public Map<String, Object> listar() {
        List<Especialidad> lista = repository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", lista); // DataTables espera "data"
        return response;
    }

    // ✅ Obtener una especialidad por ID
    @GetMapping("/{id}")
    public Map<String, Object> obtener(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Especialidad> esp = repository.findById(id);

        if (esp.isPresent()) {
            response.put("success", true);
            response.put("data", esp.get());
        } else {
            response.put("success", false);
            response.put("message", "Especialidad no encontrada");
        }
        return response;
    }

    // ✅ Guardar o actualizar
    @PostMapping("/guardar")
    public Map<String, Object> guardar(@RequestBody Especialidad especialidad) {
        Map<String, Object> response = new HashMap<>();
        try {
            Especialidad guardada = repository.save(especialidad);
            response.put("success", true);
            response.put("message", "Especialidad guardada correctamente");
            response.put("data", guardada);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar: " + e.getMessage());
        }
        return response;
    }

    // ✅ Eliminar por ID
    @DeleteMapping("/eliminar/{id}")
    public Map<String, Object> eliminar(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        if (!repository.existsById(id)) {
            response.put("success", false);
            response.put("message", "Especialidad no encontrada");
            return response;
        }
        repository.deleteById(id);
        response.put("success", true);
        response.put("message", "Especialidad eliminada correctamente");
        return response;
    }
}
