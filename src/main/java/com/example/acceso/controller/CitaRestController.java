package com.example.acceso.controller;

import com.example.acceso.model.Cita;
import com.example.acceso.repository.CitaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/citas/api")
public class CitaRestController {

    private final CitaRepository repository;

    public CitaRestController(CitaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public Map<String, Object> listar() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", repository.findAll());
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(cita -> ResponseEntity.ok(Map.of("success", true, "data", cita)))
                .orElseGet(() -> ResponseEntity.ok(Map.of("success", false, "message", "Cita no encontrada")));
    }

    @PostMapping("/guardar")
    public ResponseEntity<Map<String, Object>> guardar(@RequestBody Cita cita) {
        Map<String, Object> res = new HashMap<>();
        try {
            repository.save(cita);
            res.put("success", true);
            res.put("message", "Cita guardada correctamente");
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Error al guardar la cita");
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();
        try {
            repository.deleteById(id);
            res.put("success", true);
            res.put("message", "Cita eliminada correctamente");
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Error al eliminar la cita");
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/cambiar-estado/{id}")
    public ResponseEntity<Map<String, Object>> cambiarEstado(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();
        try {
            Optional<Cita> opt = repository.findById(id);
            if (opt.isPresent()) {
                Cita cita = opt.get();
                cita.setEstado(!cita.isEstado()); // 👈 alterna el estado actual
                repository.save(cita);
                res.put("success", true);
                res.put("message", "Estado de la cita actualizado correctamente");
            } else {
                res.put("success", false);
                res.put("message", "Cita no encontrada");
            }
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Error al cambiar el estado de la cita");
        }
        return ResponseEntity.ok(res);
    }
}
