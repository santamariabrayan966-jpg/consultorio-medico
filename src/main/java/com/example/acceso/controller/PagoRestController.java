package com.example.acceso.controller;

import com.example.acceso.model.Pago;
import com.example.acceso.repository.PagoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/pagos/api")
public class PagoRestController {

    private final PagoRepository repository;

    public PagoRestController(PagoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public Map<String, Object> listar() {
        Map<String, Object> res = new HashMap<>();
        res.put("data", repository.findAll());
        return res;
    }

    @PostMapping("/guardar")
    public Pago guardar(@RequestBody Pago pago) {
        return repository.save(pago);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
