package com.example.acceso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ServicioController {

    @GetMapping("/servicios/listar")
    public String listarServicios() {
        return "servicios"; // templates/servicios.html
    }
}
