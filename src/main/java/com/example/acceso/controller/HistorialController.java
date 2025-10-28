package com.example.acceso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/historial")
public class HistorialController {

    @GetMapping("/listar")
    public String listarHistorial(Model model) {
        // Aquí deberías traer datos de la BD cuando tengas el modelo Historial
        // model.addAttribute("historiales", historialService.obtenerTodos());

        return "historial_clinico"; // este es tu archivo templates/historial_clinico.html
    }
}

