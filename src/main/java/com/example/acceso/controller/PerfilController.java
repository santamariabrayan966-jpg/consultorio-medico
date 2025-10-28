package com.example.acceso.controller;

import com.example.acceso.repository.PerfilRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/perfiles")
public class PerfilController {

    private final PerfilRepository repository;

    public PerfilController(PerfilRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/listar")
    public String listar(Model model) {
        model.addAttribute("perfiles", repository.findAll());
        return "perfiles"; // busca templates/perfiles.html
    }
}

