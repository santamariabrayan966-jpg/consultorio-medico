package com.example.acceso.controller;

import com.example.acceso.model.Medico;
import com.example.acceso.service.MedicoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/medicos")
public class MedicoController {

    private final MedicoService medicoService;

    public MedicoController(MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    // Listar médicos
    @GetMapping("/listar")
    public String listarMedicos(Model model) {
        model.addAttribute("medicos", medicoService.obtenerTodosLosMedicos());
        return "medicos"; // archivo templates/medicos.html
    }

    // Formulario para nuevo médico
    @GetMapping("/nuevo")
    public String nuevoMedico(Model model) {
        model.addAttribute("medico", new Medico());
        return "medico-form"; // archivo templates/medico-form.html
    }

    // Guardar médico
    @PostMapping("/guardar")
    public String guardarMedico(@ModelAttribute Medico medico) {
        medicoService.guardar(medico); // 👈 este método ya existe en MedicoService
        return "redirect:/medicos/listar";
    }

    // Eliminar médico
    @GetMapping("/eliminar/{id}")
    public String eliminarMedico(@PathVariable Long id) {
        medicoService.eliminar(id); // 👈 usamos eliminar() que ya tienes
        return "redirect:/medicos/listar";
    }
}
