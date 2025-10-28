/**
 * Script para la gestión de trabajadores con Bootstrap 5
 * Archivo: src/main/resources/static/js/trabajadores.js
 */

$(document).ready(function() {
    let dataTable;
    let isEditing = false;
    let trabajadorModal;

    const API_BASE = '/trabajadores/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
    };

    // Inicializar DataTable
    initializeDataTable();

    // Inicializar Modal de Bootstrap
    trabajadorModal = new bootstrap.Modal(document.getElementById('trabajadorModal'));

    // Event Listeners
    setupEventListeners();

    /** ================================
     * FUNCIONES
     =================================*/

    function initializeDataTable() {
        dataTable = $('#tablaTrabajadores').DataTable({
            responsive: true,
            processing: true,
            destroy: true,   // 👈 evita error de reinit
            ajax: {
                url: ENDPOINTS.list,
                dataSrc: 'data'
            },
            columns: [
                { data: 'id' },
                {
                    data: 'foto',
                    render: function(data) {
                        return `<img src="${data || '/img/default.png'}" alt="Foto" class="rounded-circle" width="40" height="40">`;
                    }
                },
                { data: 'nombre' },
                { data: 'funcion' },
                { data: 'edad' },
                {
                    data: 'estado',
                    render: function(data) {
                        return data === 'Activo'
                            ? '<span class="badge bg-success">Activo</span>'
                            : '<span class="badge bg-danger">Inactivo</span>';
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function(row) {
                        return `
                            <div class="d-flex gap-1">
                                <button class="btn btn-info btn-sm action-view" data-id="${row.id}">👁</button>
                                <button class="btn btn-warning btn-sm action-edit" data-id="${row.id}">✏</button>
                                <button class="btn btn-danger btn-sm action-delete" data-id="${row.id}">🗑</button>
                            </div>
                        `;
                    }
                }
            ],
            language: {
                url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            }
        });
    }

    function setupEventListeners() {
        // Botón nuevo registro
        $('#btnNuevoTrabajador').on('click', openModalForNew);

        // Submit form
        $('#formTrabajador').on('submit', function(e) {
            e.preventDefault();
            saveTrabajador();
        });

        // Eventos en la tabla
        $('#tablaTrabajadores tbody').on('click', '.action-edit', handleEdit);
        $('#tablaTrabajadores tbody').on('click', '.action-view', handleView);
        $('#tablaTrabajadores tbody').on('click', '.action-delete', handleDelete);
    }

    function loadTrabajadores() {
        dataTable.ajax.reload();
    }

    function saveTrabajador() {
        const formData = {
            id: $('#id').val() || null,
            nombre: $('#nombre').val().trim(),
            funcion: $('#funcion').val().trim(),
            edad: $('#edad').val(),
            estado: $('#estado').val(),
            foto: $('#foto').val()
        };

        fetch(ENDPOINTS.save, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    hideModal();
                    showNotification(data.message, 'success');
                    loadTrabajadores();
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(() => showNotification('Error de conexión', 'error'));
    }

    function handleEdit() {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    openModalForEdit(data.data);
                } else {
                    showNotification(data.message, 'error');
                }
            });
    }

    function handleView() {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    const t = data.data;
                    Swal.fire({
                        title: t.nombre,
                        html: `
                            <p><b>Función:</b> ${t.funcion}</p>
                            <p><b>Edad:</b> ${t.edad}</p>
                            <p><b>Estado:</b> ${t.estado}</p>
                            <img src="${t.foto || '/img/default.png'}" width="100" class="mt-2 rounded-circle">
                        `,
                        icon: 'info'
                    });
                }
            });
    }

    function handleDelete() {
        const id = $(this).data('id');
        Swal.fire({
            title: '¿Eliminar?',
            text: "No podrás revertirlo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                fetch(ENDPOINTS.delete(id), { method: 'DELETE' })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            showNotification(data.message, 'success');
                            loadTrabajadores();
                        } else {
                            showNotification(data.message, 'error');
                        }
                    });
            }
        });
    }

    /** ================================
     * MODAL
     =================================*/
    function openModalForNew() {
        isEditing = false;
        $('#formTrabajador')[0].reset();
        $('#id').val('');
        $('#modalTitle').text('Agregar Trabajador');
        trabajadorModal.show();
    }

    function openModalForEdit(t) {
        isEditing = true;
        $('#formTrabajador')[0].reset();
        $('#id').val(t.id);
        $('#nombre').val(t.nombre);
        $('#funcion').val(t.funcion);
        $('#edad').val(t.edad);
        $('#estado').val(t.estado);
        $('#foto').val(t.foto);
        $('#modalTitle').text('Editar Trabajador');
        trabajadorModal.show();
    }

    function hideModal() {
        trabajadorModal.hide();
    }

    /** ================================
     * UTILIDADES
     =================================*/
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
