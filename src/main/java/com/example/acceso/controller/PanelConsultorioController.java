package com.example.acceso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PanelConsultorioController {

    @GetMapping("/panel-consultorio")
    public String panelConsultorio() {
        // Busca templates/panelConsultorio.html
        return "panelConsultorio";
    }
}
