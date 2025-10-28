package com.example.acceso.controller;

import com.example.acceso.model.Usuario;
import com.example.acceso.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
public class LoginController {
    // Inyección de dependencia del servicio de usuario.
    private final UsuarioService usuarioService;

    public LoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Maneja las peticiones GET a /login. Muestra el formulario de inicio de
    // sesión.
    @GetMapping("/login")
    public String mostrarFormularioLogin(HttpSession session) {
        // Comprueba si ya existe un usuario en la sesión actual.
        if (session.getAttribute("usuarioLogueado") != null) {
            // Si ya ha iniciado sesión, lo redirige a la página principal para no mostrarle
            // el login de nuevo.
            return "redirect:/";
        }
        // Si no ha iniciado sesión, muestra la página de login.
        return "login";
    }

    // Maneja las peticiones POST a /login, que se envían desde el formulario.
    @PostMapping("/login")
    public String procesarLogin(@RequestParam String usuario, @RequestParam String clave, HttpSession session,
            RedirectAttributes redirectAttributes) {
        // Busca al usuario en la base de datos por su nombre de usuario.
        Optional<Usuario> usuarioOpt = usuarioService.findByUsuario(usuario);

        // Si el Optional está vacío, significa que el usuario no fue encontrado.
        if (usuarioOpt.isEmpty()) {
            // addFlashAttribute guarda un mensaje que sobrevive a una redirección. Es ideal
            // para mostrar errores.
            redirectAttributes.addFlashAttribute("error", "Usuario no encontrado.");
            return "redirect:/login";
        }

        // Si se encontró, obtenemos el objeto Usuario.
        Usuario usuarioEncontrado = usuarioOpt.get();

        // Verificamos el estado del usuario. Solo los usuarios con estado 1 (Activo)
        // pueden iniciar sesión.
        if (usuarioEncontrado.getEstado() != 1) { // 1 = Activo
            redirectAttributes.addFlashAttribute("error", "Este usuario se encuentra inactivo.");
            return "redirect:/login";
        }

        // Verificamos si la contraseña proporcionada coincide con la contraseña
        // encriptada en la BD.
        if (usuarioService.verificarContrasena(clave, usuarioEncontrado.getClave())) {
            // Si la contraseña es correcta, guardamos el objeto Usuario en la sesión.
            // Esto es lo que nos permitirá saber que el usuario está "logueado" en futuras
            // peticiones.
            session.setAttribute("usuarioLogueado", usuarioEncontrado);
            return "redirect:/"; // Redirige al dashboard en caso de éxito
        } else {
            // Si la contraseña es incorrecta, mostramos un mensaje de error.
            redirectAttributes.addFlashAttribute("error", "Contraseña incorrecta.");
            return "redirect:/login";
        }
    }

    // Maneja las peticiones GET a /logout.
    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        // Invalida la sesión, eliminando todos los atributos guardados (incluyendo
        // "usuarioLogueado").
        session.invalidate();
        // Añade un mensaje de éxito para mostrar en la página de login.
        redirectAttributes.addFlashAttribute("logout", "Has cerrado sesión exitosamente.");
        return "redirect:/login";
    }
}