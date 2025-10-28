package com.example.acceso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ConsultorioController {

    @GetMapping("/consultorio")
    public String consultorio() {
        // Busca templates/Panelconsultorio.html
        return "consultorio";
    }
}
