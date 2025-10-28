package com.example.acceso.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PagoController {

    @GetMapping("/pagos/listar")
    public String listarPagos() {
        return "pagos"; // templates/pagos.html
    }
}
