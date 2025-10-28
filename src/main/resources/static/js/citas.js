/**
 * Script: citas.js
 * Gestión de citas médicas con Bootstrap 5 + DataTables + SweetAlert2
 * Autor: Brayan Santamaría
 */

$(document).ready(function () {
  // ===== Variables =====
  let dataTable;
  const citaModal = new bootstrap.Modal(document.getElementById('citaModal'));
  let isEditing = false;

  // ===== API =====
  const API_BASE = '/citas/api';
  const ENDPOINTS = {
    list: `${API_BASE}/listar`,
    save: `${API_BASE}/guardar`,
    get: (id) => `${API_BASE}/${id}`,
    delete: (id) => `${API_BASE}/eliminar/${id}`,
    toggleStatus: (id) => `${API_BASE}/cambiar-estado/${id}`,
    buscarPaciente: (dni) => `/api/dni/${dni}`, // endpoint para buscar por DNI o RUC
    medicos: `/medicos/api/listar`,
    servicios: `/servicios/api/listar`
  };

  // ===== Inicializar DataTable =====
  initializeDataTable();

  // ===== Eventos =====
  $('#btnNuevaCita').on('click', openModalNuevaCita);
  $('#btnBuscarPaciente').on('click', buscarPacientePorDNI);
  $('#formCita').on('submit', guardarCita);

  $('#tablaCitas tbody').on('click', '.action-edit', editarCita);
  $('#tablaCitas tbody').on('click', '.action-delete', eliminarCita);
  $('#tablaCitas tbody').on('click', '.action-status', cambiarEstado);

  // ===== Funciones =====

  function initializeDataTable() {
    dataTable = $('#tablaCitas').DataTable({
      responsive: true,
      processing: true,
      ajax: { url: ENDPOINTS.list, dataSrc: 'data' },
      columns: [
        { data: 'id' },
        { data: 'paciente' },
        { data: 'medico' },
        { data: 'servicio' },
        {
          data: 'fechaHora',
          render: (d) => (d ? new Date(d).toLocaleString() : '')
        },
        { data: 'motivo' },
        {
          data: 'estado',
          render: (d) =>
            d
              ? '<span class="badge text-bg-success">Activo</span>'
              : '<span class="badge text-bg-danger">Cancelado</span>'
        },
        {
          data: null,
          orderable: false,
          render: (row) => `
            <button class="btn btn-sm btn-primary action-edit" data-id="${row.id}">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-warning action-status" data-id="${row.id}">
              <i class="bi bi-power"></i>
            </button>
            <button class="btn btn-sm btn-danger action-delete" data-id="${row.id}">
              <i class="bi bi-trash3-fill"></i>
            </button>
          `
        }
      ],
      language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json" },
      pageLength: 10
    });
  }

  // ===============================
  //   🔹 Abrir modal Nueva Cita
  // ===============================
  async function openModalNuevaCita() {
    isEditing = false;
    $('#formCita')[0].reset();
    $('#id').val('');
    await cargarMedicos();
    await cargarServicios();
    citaModal.show();
  }

  // ===============================
  //   🔹 Buscar paciente por DNI
  // ===============================
  async function buscarPacientePorDNI() {
    const dni = $('#dni').val().trim();
    if (!dni) {
      Swal.fire('Atención', 'Ingrese un DNI o RUC válido.', 'warning');
      return;
    }

    try {
      const res = await fetch(ENDPOINTS.buscarPaciente(dni));
      const data = await res.json();

      if (data.success) {
        $('#paciente').val(data.nombre || '');
        $('#telefono').val(data.telefono || '');
        $('#correo').val(data.correo || '');
        Swal.fire('Éxito', 'Datos obtenidos correctamente.', 'success');
      } else {
        Swal.fire('Error', data.message || 'No se encontraron datos del paciente.', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'No se pudo conectar con el servicio.', 'error');
    }
  }

  // ===============================
  //   🔹 Guardar cita
  // ===============================
  function guardarCita(e) {
    e.preventDefault();

    const formData = {
      id: $('#id').val() || null,
      dni: $('#dni').val().trim(),
      paciente: $('#paciente').val().trim(),
      telefono: $('#telefono').val().trim(),
      correo: $('#correo').val().trim(),
      medico: $('#medico').val(),
      servicio: $('#servicio').val(),
      fechaHora: $('#fechaHora').val(),
      motivo: $('#motivo').val().trim(),
      estado: true
    };

    // Validación
    if (!formData.paciente || !formData.medico || !formData.servicio || !formData.fechaHora) {
      Swal.fire('Atención', 'Por favor complete todos los campos obligatorios.', 'warning');
      return;
    }

    fetch(ENDPOINTS.save, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          Swal.fire('Éxito', res.message || 'Cita guardada correctamente.', 'success');
          citaModal.hide();
          dataTable.ajax.reload();
        } else {
          Swal.fire('Error', res.message || 'No se pudo guardar la cita.', 'error');
        }
      })
      .catch(() => Swal.fire('Error', 'Error de conexión con el servidor.', 'error'));
  }

  // ===============================
  //   🔹 Editar cita
  // ===============================
  function editarCita() {
    const id = $(this).data('id');
    fetch(ENDPOINTS.get(id))
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          const c = data.data;
          $('#id').val(c.id);
          $('#dni').val(c.dni || '');
          $('#paciente').val(c.paciente);
          $('#telefono').val(c.telefono);
          $('#correo').val(c.correo);
          await cargarMedicos(c.medico);
          await cargarServicios(c.servicio);
          $('#fechaHora').val(c.fechaHora.replace(' ', 'T'));
          $('#motivo').val(c.motivo);
          citaModal.show();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      });
  }

  // ===============================
  //   🔹 Eliminar cita
  // ===============================
  function eliminarCita() {
    const id = $(this).data('id');
    Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (!result.isConfirmed) return;

      fetch(ENDPOINTS.delete(id), { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire('Eliminado', data.message || 'Cita eliminada.', 'success');
            dataTable.ajax.reload();
          } else {
            Swal.fire('Error', data.message || 'No se pudo eliminar.', 'error');
          }
        });
    });
  }

  // ===============================
  //   🔹 Cambiar estado cita
  // ===============================
  function cambiarEstado() {
    const id = $(this).data('id');
    fetch(ENDPOINTS.toggleStatus(id), { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire('Éxito', data.message || 'Estado actualizado.', 'success');
          dataTable.ajax.reload();
        } else {
          Swal.fire('Error', data.message || 'No se pudo cambiar el estado.', 'error');
        }
      })
      .catch(() => Swal.fire('Error', 'No se pudo cambiar el estado.', 'error'));
  }

  // ===============================
  //   🔹 Cargar médicos y servicios
  // ===============================
  async function cargarMedicos(selected = '') {
    try {
      const r = await fetch(ENDPOINTS.medicos);
      const res = await r.json();
      const $sel = $('#medico');
      $sel.empty();
      $sel.append(new Option('Seleccione un médico', '', true, false));
      if (res.success && Array.isArray(res.data)) {
        res.data.forEach((m) => {
          $sel.append(new Option(m.nombre, m.id, false, m.nombre === selected));
        });
      }
    } catch (e) {
      console.error('Error cargando médicos:', e);
    }
  }

  async function cargarServicios(selected = '') {
    try {
      const r = await fetch(ENDPOINTS.servicios);
      const res = await r.json();
      const $sel = $('#servicio');
      $sel.empty();
      $sel.append(new Option('Seleccione un servicio', '', true, false));
      if (res.success && Array.isArray(res.data)) {
        res.data.forEach((s) => {
          $sel.append(new Option(s.nombre, s.id, false, s.nombre === selected));
        });
      }
    } catch (e) {
      console.error('Error cargando servicios:', e);
    }
  }
});
