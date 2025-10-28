// === MANEJO DE USUARIOS ===

// Loader global
const loader = document.getElementById("loader");
const showLoader = () => loader && (loader.style.display = "flex");
const hideLoader = () => loader && (loader.style.display = "none");

// Abrir modal "Nuevo usuario"
document.getElementById("btnNuevoUsuario")?.addEventListener("click", () => {
  const form = document.getElementById("formUsuario");
  form.reset();
  document.getElementById("id").value = "";
  document.getElementById("preview").src = "/img/default.png";
  document.getElementById("idPerfil").value = "";
  document.getElementById("estado").value = "1";
  new bootstrap.Modal(document.getElementById("modalUsuario")).show();
});

// Preview imagen
document.getElementById("imagen")?.addEventListener("change", function () {
  const file = this.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => document.getElementById("preview").src = e.target.result;
  reader.readAsDataURL(file);
});

// Guardar usuario (crear/editar)
document.getElementById("formUsuario")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoader();

  try {
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/usuarios/api/guardar', {
      method: 'POST',
      body: formData
    });

    const payload = await res.json();
    hideLoader();

    if (!payload.success) {
      Swal.fire('Error', payload.message || 'No se pudo guardar', 'error');
      console.error(payload);
      return;
    }

    await Swal.fire('Éxito', payload.message, 'success');
    location.reload();

  } catch (error) {
    hideLoader();
    console.error(error);
    Swal.fire('Error', 'Ocurrió un error al guardar el usuario', 'error');
  }
});

// Editar usuario
window.editarUsuario = async (id) => {
  showLoader();
  try {
    const res = await fetch(`/usuarios/api/${id}`);
    const data = await res.json();
    hideLoader();

    if (!data.success) {
      Swal.fire('Error', 'Usuario no encontrado', 'error');
      return;
    }

    const u = data.data;
    document.getElementById("id").value = u.id;
    document.getElementById("nombre").value = u.nombre;
    document.getElementById("usuario").value = u.usuario;
    document.getElementById("correo").value = u.correo;
    document.getElementById("estado").value = u.estado;
    document.getElementById("idPerfil").value = (u.perfil && u.perfil.id) ? u.perfil.id : "";
    document.getElementById("preview").src = u.imagen ? `/uploads/${u.imagen}` : '/img/default.png';

    new bootstrap.Modal(document.getElementById("modalUsuario")).show();

  } catch (error) {
    hideLoader();
    console.error(error);
    Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
  }
};

// Cambiar estado
window.cambiarEstado = async (id) => {
  showLoader();
  try {
    const res = await fetch(`/usuarios/api/cambiar-estado/${id}`, { method: 'POST' });
    if (res.ok) location.reload();
  } catch (e) {
    console.error(e);
    Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
  } finally {
    hideLoader();
  }
};

// Eliminar usuario
window.eliminarUsuario = async (id) => {
  const confirm = await Swal.fire({
    title: '¿Eliminar usuario?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  showLoader();
  try {
    const res = await fetch(`/usuarios/api/eliminar/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
      location.reload();
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
  } finally {
    hideLoader();
  }
};
