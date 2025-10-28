/**
 * Script para la gestión de especialidades con Bootstrap 5 + DataTables
 * Archivo: src/main/resources/static/js/especialidades.js
 */

$(document).ready(function() {
    // Variables globales
    let dataTable;
    let especialidadModal;

    // API
    const API_BASE = '/especialidades/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
    };

    // Inicializar DataTable
    initializeDataTable();

    // Modal
    especialidadModal = new bootstrap.Modal(document.getElementById('especialidadModal'));

    // Eventos
    setupEventListeners();

    /**
     * DataTable config
     */
    function initializeDataTable() {
        dataTable = $('#tablaEspecialidades').DataTable({
            responsive: true,
            processing: true,
            ajax: {
                url: ENDPOINTS.list,
                dataSrc: 'data'
            },
            columns: [
                { data: 'id' },           // <- id_especialidad mapeado en Entity como id
                { data: 'nombre' },
                { data: 'descripcion' },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return `
                            <div class="d-flex gap-1">
                                <button data-id="${row.id}" class="action-btn action-btn-edit action-edit" title="Editar">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button data-id="${row.id}" class="action-btn action-btn-delete action-delete" title="Eliminar">
                                    <i class="bi bi-trash3-fill"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            columnDefs: [
                { responsivePriority: 1, targets: 1 }, // Nombre
                { responsivePriority: 2, targets: 3 }  // Acciones
            ],
            language: {
                url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            },
            pageLength: 10
        });
    }

    /**
     * Listeners
     */
    function setupEventListeners() {
        $('#btnNuevaEspecialidad').on('click', openModalForNew);
        $('#formEspecialidad').on('submit', function(e) {
            e.preventDefault();
            saveEspecialidad();
        });

        $('#tablaEspecialidades tbody').on('click', '.action-edit', handleEdit);
        $('#tablaEspecialidades tbody').on('click', '.action-delete', handleDelete);
    }

    /**
     * Recargar tabla
     */
    function loadEspecialidades() {
        dataTable.ajax.reload();
    }

    /**
     * Guardar especialidad (crear/editar)
     */
    function saveEspecialidad() {
        const formData = {
            id: $('#id').val() || null,
            nombre: $('#nombre').val().trim(),
            descripcion: $('#descripcion').val().trim()
        };

        fetch(ENDPOINTS.save, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                hideModal();
                showNotification(data.message, 'success');
                loadEspecialidades();
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(() => showNotification('Error de conexión con el servidor', 'error'));
    }

    /**
     * Editar
     */
    function handleEdit() {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    openModalForEdit(data.data);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(() => showNotification('Error al obtener la especialidad', 'error'));
    }

    /**
     * Eliminar
     */
    function handleDelete() {
        const id = $(this).data('id');
        Swal.fire({
            title: '¿Eliminar especialidad?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                fetch(ENDPOINTS.delete(id), { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showNotification(data.message, 'success');
                            loadEspecialidades();
                        } else {
                            showNotification(data.message, 'error');
                        }
                    })
                    .catch(() => showNotification('Error al eliminar', 'error'));
            }
        });
    }

    /**
     * Modal nuevo
     */
    function openModalForNew() {
        $('#formEspecialidad')[0].reset();
        $('#id').val('');
        $('#modalTitle').text('Agregar Especialidad');
        especialidadModal.show();
    }

    /**
     * Modal editar
     */
    function openModalForEdit(especialidad) {
        $('#formEspecialidad')[0].reset();
        $('#id').val(especialidad.id);
        $('#nombre').val(especialidad.nombre);
        $('#descripcion').val(especialidad.descripcion);
        $('#modalTitle').text('Editar Especialidad');
        especialidadModal.show();
    }

    /**
     * Ocultar modal
     */
    function hideModal() {
        especialidadModal.hide();
    }

    /**
     * Notificaciones
     */
    function showNotification(message, type = 'success') {
        const toastClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';

        const toast = $(`
            <div class="toast align-items-center ${toastClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);

        $('#notification-container').append(toast);
        new bootstrap.Toast(toast[0]).show();
    }
});
