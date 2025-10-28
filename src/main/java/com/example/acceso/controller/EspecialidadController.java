package com.example.acceso.controller;

import com.example.acceso.model.Especialidad;
import com.example.acceso.repository.EspecialidadRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/especialidades")
public class EspecialidadController {

    private final EspecialidadRepository repository;

    public EspecialidadController(EspecialidadRepository repository) {
        this.repository = repository;
    }

    // ✅ 1. Listar especialidades
    @GetMapping("/listar")
    public String listarEspecialidades(Model model) {
        List<Especialidad> especialidades = repository.findAll();
        model.addAttribute("especialidades", especialidades);
        return "especialidades"; // busca especialidades.html en /templates
    }

    // ✅ 2. Mostrar formulario para crear nueva especialidad
    @GetMapping("/nueva")
    public String nuevaEspecialidad(Model model) {
        model.addAttribute("especialidad", new Especialidad());
        return "especialidades-form"; // 👉 esta será tu vista del formulario
    }

    // ✅ 3. Guardar nueva especialidad
    @PostMapping("/guardar")
    public String guardarEspecialidad(@ModelAttribute Especialidad especialidad) {
        repository.save(especialidad);
        return "redirect:/especialidades/listar";
    }

    // ✅ 4. Editar especialidad
    @GetMapping("/editar/{id}")
    public String editarEspecialidad(@PathVariable("id") Long id, Model model) {
        Especialidad especialidad = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Especialidad no encontrada: " + id));
        model.addAttribute("especialidad", especialidad);
        return "especialidades-form";
    }

    // ✅ 5. Eliminar especialidad
    @GetMapping("/eliminar/{id}")
    public String eliminarEspecialidad(@PathVariable("id") Long id) {
        repository.deleteById(id);
        return "redirect:/especialidades/listar";
    }

    // ✅ 6. Activar o desactivar (opcional)
    @GetMapping("/estado/{id}")
    public String cambiarEstado(@PathVariable("id") Long id) {
        Especialidad e = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Especialidad no encontrada: " + id));
        e.setEstado(!e.isEstado());
        repository.save(e);
        return "redirect:/especialidades/listar";
    }
}
