package com.example.acceso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CitaController {

    @GetMapping("/citas/listar")
    public String listarCitas() {
        return "citas"; // Renderiza templates/citas.html
    }
}
