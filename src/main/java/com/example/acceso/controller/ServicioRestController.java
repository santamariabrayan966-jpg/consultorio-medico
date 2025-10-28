package com.example.acceso.controller;

import com.example.acceso.model.Servicio;
import com.example.acceso.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/servicios/api")
public class ServicioRestController {

    private final ServicioRepository repository;

    public ServicioRestController(ServicioRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public Map<String, Object> listar() {
        Map<String, Object> res = new HashMap<>();
        res.put("data", repository.findAll());
        return res;
    }

    @PostMapping("/guardar")
    public Servicio guardar(@RequestBody Servicio servicio) {
        return repository.save(servicio);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
